import os
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
import uvicorn

from app.api.v1.api import api_router

# Create FastAPI instance
app = FastAPI(
    title="FastAPI Boilerplate with PostgreSQL",
    description="A modern FastAPI boilerplate and PostgreSQL integration",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    # Trust proxy headers for Gitpod environment
    root_path_in_servers=True,
    # Disable automatic trailing slash redirects to prevent HTTP redirects
    redirect_slashes=False,
)


# Create a custom ASGI app wrapper for Gitpod HTTPS enforcement
class HTTPSEnforcer:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        # Force HTTPS scheme for Gitpod environment
        if os.getenv("GITPOD_WORKSPACE_ID"):
            scope["scheme"] = "https"
            print(
                f"ASGI: HTTPS scheme enforced at scope level for: {scope.get('path', 'unknown')}"
            )

        await self.app(scope, receive, send)


# Wrap the FastAPI app with HTTPS enforcer
if os.getenv("GITPOD_WORKSPACE_ID"):
    app = HTTPSEnforcer(app)
    print("HTTPS Enforcer ASGI wrapper applied")


# Get allowed origins from environment variable
def get_secure_origins() -> list[str]:
    """Get and validate CORS origins from environment"""
    allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")

    # Parse the string representation of the list
    if allowed_origins.startswith("[") and allowed_origins.endswith("]"):
        # Remove brackets and split by comma, then strip quotes
        origins = [
            origin.strip().strip("'\"") for origin in allowed_origins[1:-1].split(",")
        ]
    else:
        origins = [allowed_origins]

    # Validate origins (basic URL format check)
    valid_origins = []
    for origin in origins:
        if origin.startswith(("http://", "https://")) and (
            "localhost" in origin or "gitpod.io" in origin
        ):
            valid_origins.append(origin)
        else:
            print(f"Warning: Skipping invalid origin: {origin}")

    if not valid_origins:
        print("Warning: No valid origins found, defaulting to localhost")
        valid_origins = ["http://localhost:4000"]

    return valid_origins


origins = get_secure_origins()
print(f"Configured CORS origins: {origins}")

# Add CORS middleware with secure origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


# Add middleware to handle HTTPS scheme for Gitpod environment
@app.middleware("http")
async def handle_https_scheme(request: Request, call_next):
    # Check if we're running in Gitpod environment
    if os.getenv("GITPOD_WORKSPACE_ID"):
        # Log headers for debugging
        print(f"Request headers: {dict(request.headers)}")
        print(f"Request scheme: {request.scope['scheme']}")
        print(f"Request URL: {request.url}")

        # Force HTTPS scheme for ALL Gitpod requests (more aggressive approach)
        request.scope["scheme"] = "https"
        print(f"HTTPS scheme forced for Gitpod request to: {request.url.path}")

        # Also check for X-Forwarded-Proto header as backup
        forwarded_proto = request.headers.get("x-forwarded-proto")
        if forwarded_proto == "https":
            print(f"X-Forwarded-Proto: https confirmed for: {request.url.path}")

        # Handle missing trailing slash for API endpoints
        path = request.url.path
        if path.endswith("/api/v1/states") and not path.endswith("/"):
            # This is a missing trailing slash case - redirect to the correct URL
            current_host = request.headers.get("host", "localhost")
            redirect_url = f"https://{current_host}{path}/"
            print(f"Missing trailing slash detected, redirecting to: {redirect_url}")
            return RedirectResponse(url=redirect_url, status_code=307)

    response = await call_next(request)

    # Force HTTPS URLs in response headers for Gitpod environment
    if os.getenv("GITPOD_WORKSPACE_ID"):
        # Check if there are any Location headers that need to be converted to HTTPS
        if "location" in response.headers:
            location = response.headers["location"]
            if location.startswith("http://") and "gitpod.io" in location:
                https_location = location.replace("http://", "https://")
                response.headers["location"] = https_location
                print(f"Converted Location header from {location} to {https_location}")

    return response


# Include API router
app.include_router(api_router, prefix="/api/v1")


# Add a custom route handler for missing trailing slashes in Gitpod
@app.get("/api/v1/states")
async def redirect_states_without_trailing_slash(request: Request):
    """Redirect /api/v1/states to /api/v1/states/ to handle missing trailing slash"""
    # Get the current host from the request
    current_host = request.headers.get("host", "localhost")

    if os.getenv("GITPOD_WORKSPACE_ID"):
        # Force HTTPS redirect for Gitpod
        redirect_url = f"https://{current_host}/api/v1/states/"
        print(f"Redirecting missing trailing slash to: {redirect_url}")
        return RedirectResponse(url=redirect_url, status_code=307)
    else:
        # Local development - use HTTP
        return RedirectResponse(url="/api/v1/states/", status_code=307)


# Custom exception handler for Gitpod environment to ensure HTTPS redirects
@app.exception_handler(HTTPException)
async def https_redirect_handler(request: Request, exc: HTTPException):
    if os.getenv("GITPOD_WORKSPACE_ID") and exc.status_code == 307:
        # Convert any HTTP redirects to HTTPS
        current_url = str(request.url)
        if current_url.startswith("http://") and "gitpod.io" in current_url:
            https_url = current_url.replace("http://", "https://")
            print(f"Converting HTTP redirect to HTTPS: {current_url} -> {https_url}")
            return RedirectResponse(url=https_url, status_code=307)

    # For all other exceptions, return the default response
    return exc


@app.get("/")
async def root():
    return {
        "message": "Welcome to FastAPI Boilerplate with PostgreSQL!",
        "status": "running",
        "docs": "/docs",
        "api": "/api/v1",
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "FastAPI Boilerplate with PostgreSQL",
        "database": "connected (migrations handled by Alembic)",
    }


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8300))
    # Configure uvicorn for Gitpod environment with proxy headers
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        proxy_headers=True,
        forwarded_allow_ips="127.0.0.1,::1,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16",
    )
