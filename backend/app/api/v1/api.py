from fastapi import APIRouter
from app.api.v1.endpoints import states

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(states.router, prefix="/states", tags=["states"])
