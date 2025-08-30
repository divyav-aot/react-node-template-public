# FastAPI Boilerplate with PostgreSQL

A modern FastAPI boilerplate with proper separation of concerns, PostgreSQL integration, and Docker support.

## 🏗️ **Architecture & Features**

- 🚀 **FastAPI** - Modern, fast web framework for building APIs
- 🐳 **Docker** - Containerized application with multi-stage build
- 🐘 **PostgreSQL** - Robust relational database with automatic initialization
- 📚 **Auto-generated docs** - Interactive API documentation at `/docs`
- 🔒 **CORS support** - Cross-origin resource sharing enabled
- 🏥 **Health checks** - Built-in health monitoring endpoints
- 📝 **Pydantic models** - Data validation and serialization
- 🗄️ **SQLAlchemy ORM** - Database abstraction and migrations
- 🔄 **Alembic** - Database migration management
- 🧪 **CRUD operations** - Complete CRUD API for states
- 🎯 **Separation of concerns** - Clean architecture with models, services, and API layers

## 📁 **Project Structure**

```
backend/
├── app/
│   ├── __init__.py
│   ├── database.py              # Database configuration
│   ├── models/                  # SQLAlchemy models
│   │   ├── __init__.py
│   │   └── state.py
│   ├── schemas/                 # Pydantic schemas
│   │   ├── __init__.py
│   │   └── state.py
│   ├── services/                # Business logic layer
│   │   ├── __init__.py
│   │   └── state_service.py
│   └── api/                     # API endpoints
│       ├── __init__.py
│       └── v1/
│           ├── __init__.py
│           ├── api.py
│           └── endpoints/
│               ├── __init__.py
│               └── states.py
├── alembic/                     # Database migrations
│   ├── env.py
│   ├── script.py.mako
│   └── versions/
│       ├── 001_create_states_table.py
├── main.py                      # Main application entry point
├── requirements.txt             # Python dependencies
├── Dockerfile                   # Docker image configuration
├── docker-compose.yml           # Docker services orchestration
├── docker-entrypoint.sh         # Docker startup script with migrations
├── .dockerignore                # Docker build exclusions
├── alembic.ini                 # Alembic configuration
├── start.bat                    # Windows startup script
├── start.sh                     # Unix/Linux/Mac startup script
├── ALEBIC_MIGRATION_GUIDE.md   # Alembic migration guide
└── README.md                    # This file
```

## 🚀 **Quick Start**

### **Option 1: Using Docker (Recommended)**

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd backend
   ```

2. **Run with Docker Compose**

   ```bash
   docker-compose up --build
   ```

3. **Access the API**
   - API: http://localhost:8300
   - Interactive docs: http://localhost:8300/docs
   - Alternative docs: http://localhost:8300/redoc
   - Health check: http://localhost:8300/health
   - API endpoints: http://localhost:8300/api/v1

### **Option 2: Local Development**

1. **Install PostgreSQL locally**

   - Install PostgreSQL 15+
   - Create database: `fastapi_db`
   - Create user: `fastapi_user` with password: `fastapi_password`

2. **Create virtual environment**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Set environment variables**

   ```bash
   # Windows
   set DATABASE_URL=postgresql://postgres:Aot123@localhost:6000/postgres

   # Unix/Linux/Mac
   export DATABASE_URL=postgresql://postgres:Aot123@localhost:6000/postgres
   ```

5. **Run database migrations**

   ```bash
   alembic upgrade head
   ```

6. **Run the application**
   ```bash
   python main.py
   # or
   uvicorn main:app --reload --host 0.0.0.0 --port 8300
   ```

## 🗄️ **Database**

### **PostgreSQL Setup**

- **Database**: `postgres`
- **User**: `postgres`
- **Password**: `Aot123`
- **Port**: `6000`

### **Automatic Migration Execution**

The database is automatically initialized with:

- **States table** with default values (New, In Progress, Done)
- **Proper indexes** and **triggers** for performance
- **Automatic timestamp updates**

### **Database Migrations with Alembic**

```bash
# Check migration status
alembic current

# View migration history
alembic history

# Create new migration
alembic revision --autogenerate -m "Description of changes"

# Apply migrations
alembic upgrade head

# Rollback migrations
alembic downgrade -1
```

## 🔌 **API Endpoints**

### **Base Endpoints**

- `GET /` - Welcome message
- `GET /health` - Health check

### **State Management (v1)**

- `GET /api/v1/states` - Get all states (ordered by sort_order)
- `GET /api/v1/states/active` - Get active states only
- `GET /api/v1/states/{id}` - Get specific state
- `POST /api/v1/states` - Create new state
- `PUT /api/v1/states/{id}` - Update state
- `DELETE /api/v1/states/{id}` - Delete state
- `POST /api/v1/states/initialize` - Initialize default states

### **Query Parameters**

- `skip`: Number of records to skip (pagination)
- `limit`: Maximum records to return (max 1000)
- `q`: Search term for customer/employee search

## 🐳 **Docker Commands**

### **Build and run**

```bash
# Build the image
docker build -t fastapi-app .

# Run the container
docker run -p 8300:8000 fastapi-app

# Run in detached mode
docker run -d -p 8300:8000 --name fastapi-container fastapi-app
```

### **Docker Compose**

```bash
# Start services
docker-compose up

# Start in detached mode
docker-compose up -d

# Stop services
docker-compose down

# Rebuild and start
docker-compose up --build

# View logs
docker-compose logs -f api

# View database logs
docker-compose logs -f postgres
```

### **Container management**

```bash
# View running containers
docker ps

# View logs
docker logs python-backend

# Execute commands in container
docker exec -it python-backend bash

# Connect to database (from host machine)
psql -h localhost -p 6000 -U postgres -d postgres

# Or connect directly to container
docker exec -it postgres_db psql -U postgres -d postgres

# Stop container
docker stop python-backend

# Remove container
docker rm python-backend
```

## 🛠️ **Development**

### **Adding New Models**

1. Create model in `app/models/`
2. Create schemas in `app/schemas/`
3. Create service in `app/services/`
4. Create endpoints in `app/api/v1/endpoints/`
5. Include in `app/api/v1/api.py`
6. Generate and run migrations with Alembic

### **Database Operations**

```bash
# Connect to database (from host machine)
psql -h localhost -p 6000 -U postgres -d postgres

# Or connect directly to container
docker exec -it postgres_db psql -U postgres -d postgres

# View tables
\dt

# View states
SELECT * FROM states;

# Exit
\q
```

### **Environment Variables**

- `PORT` - Application port (default: 8000)
- `PYTHONPATH` - Python path (default: /app)
- `DB_HOST` - DB host (default: localhost)
- `DB_USERNAME` - DB username (default: postgres)
- `DB_PASSWORD` - DB password (default: Aot123)
- `DB_DATABASE` - DB database name (default: postgres)
- `DB_SCHEMA` - DB schema name (default: public)
- `DB_PORT` - DB port (default: 5432)

## 🧪 **Running Unit Tests**

1. **Install dependencies** (including pytest):

   ```bash
   pip install -r requirements.txt
   ```

2. **Run all unit tests:**
   ```bash
   pytest tests/
   ```

- Test files are located in the `tests/` directory.
- Make sure your virtual environment is activated before running the commands.

## 🔒 **Production Considerations**

### **Security**

- Update CORS origins in production
- Use environment variables for sensitive data
- Enable HTTPS in production
- Consider adding authentication middleware
- Use strong database passwords

### **Performance**

- Use production ASGI server (Gunicorn + Uvicorn workers)
- Implement caching (Redis)
- Add database connection pooling
- Use CDN for static files
- Monitor database performance

### **Monitoring**

- Add logging configuration
- Implement metrics collection
- Set up health check endpoints
- Monitor container resources
- Database performance monitoring

## 🐛 **Troubleshooting**

### **Common Issues**

1. **Database connection failed**

   ```bash
   # Check if PostgreSQL is running
   docker-compose ps

   # Check database logs
   docker-compose logs postgres

   # Restart services
   docker-compose restart
   ```

2. **Port already in use**

   ```bash
   # Find process using port 8300
   netstat -ano | findstr :8300  # Windows
   lsof -i :8300                 # Linux/Mac

   # Kill process
   taskkill /PID <PID>           # Windows
   kill <PID>                     # Linux/Mac
   ```

3. **Port conflicts with PostgreSQL**

   ```bash
   # Check if port 6000 is available
   netstat -ano | findstr :6000  # Windows
   lsof -i :6000                 # Linux/Mac

   # If port 6000 is in use, you can change it in docker-compose.yml
   # Change "6000:5432" to another port like "6001:5432"
   ```

4. **Docker build fails**

   ```bash
   # Clean Docker cache
   docker system prune -a

   # Rebuild without cache
   docker-compose build --no-cache
   ```

5. **Migration issues**

   ```bash
   # Check migration status
   docker exec -it fastapi-app alembic current

   # View migration history
   docker exec -it fastapi-app alembic history

   # Reset migrations (careful!)
   docker exec -it fastapi-app alembic downgrade base
   ```

### **Logs**

```bash
# View application logs
docker-compose logs api

# View database logs
docker-compose logs postgres

# Follow logs in real-time
docker-compose logs -f

# View specific service logs
docker logs fastapi-app
```

## 📚 **API Documentation**

Once the application is running, visit:

- **Swagger UI**: http://localhost:8300/docs
- **ReDoc**: http://localhost:8300/redoc

These provide interactive documentation where you can:

- View all available endpoints
- Test API calls directly
- See request/response schemas
- Understand data validation rules

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Update documentation
6. Submit a pull request
