# Alembic Migration Guide

This guide explains how to use Alembic migrations with your FastAPI application following the proper workflow.

## 🚀 **Current Migration Status**

Your application now has **1 table** with proper Alembic migrations:

1. **`states`** - Status tracking table (New, In Progress, Done)

## 📋 **Migration Files Created**

- `alembic/versions/001_create_states_table.py`

## 🔧 **How It Works with Docker Compose**

### **Automatic Migration Execution**

When you run `docker-compose up --build`, the following happens automatically:

1. **PostgreSQL starts** and becomes healthy
2. **FastAPI container starts** and waits for PostgreSQL
3. **Alembic migrations run** automatically (`alembic upgrade head`)
4. **FastAPI application starts** with all tables ready

### **Entrypoint Script**

The `docker-entrypoint.sh` script handles:

- ✅ Waiting for PostgreSQL to be ready
- ✅ Running all pending migrations
- ✅ Starting the FastAPI application

## 🛠️ **Manual Migration Commands**

### **Local Development (without Docker)**

```bash
# Set database URL
export DATABASE_URL="postgresql://postgres:Aot123@localhost:6000/postgres"

# Check migration status
alembic current

# View migration history
alembic history

# Run migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1

# Rollback to specific migration
alembic downgrade 001
```

### **Inside Docker Container**

```bash
# Check migration status
docker exec -it fastapi-app alembic current

# View migration history
docker exec -it fastapi-app alembic history

# Run migrations manually
docker exec -it fastapi-app alembic upgrade head

# Rollback migrations
docker exec -it fastapi-app alembic downgrade -1
```

## 📝 **Creating New Migrations**

### **Step 1: Add New Model**

```python
# app/models/new_table.py
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.database import Base

class NewTable(Base):
    __tablename__ = "new_table"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
```

### **Step 2: Generate Migration**

```bash
# Generate migration file
alembic revision --autogenerate -m "Add new_table"

# This creates: alembic/versions/004_add_new_table.py
```

### **Step 3: Review and Edit Migration**

The generated file will look like this:

```python
"""Add new_table

Revision ID: 002
Revises: 001
Create Date: 2024-01-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

revision = '002'
down_revision = '001'
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Auto-generated code here
    op.create_table('new_table',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )

def downgrade() -> None:
    # Auto-generated code here
    op.drop_table('new_table')
```

### **Step 4: Run Migration**

```bash
# Apply the migration
alembic upgrade head

# Verify
alembic current
```

## 🔄 **Migration Workflow**

### **Development Workflow**

1. **Create/Update Model** in `app/models/`
2. **Generate Migration** with `alembic revision --autogenerate`
3. **Review Migration** file in `alembic/versions/`
4. **Test Migration** locally
5. **Commit Migration** to version control
6. **Deploy** - migrations run automatically

### **Production Workflow**

1. **Deploy Code** with new migrations
2. **Migrations Run Automatically** on container startup
3. **Application Starts** with updated schema
4. **Monitor** migration success in logs

## 📊 **Current Database Schema**

### **States Table**

```sql
CREATE TABLE states (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(200),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);
```

## 🚨 **Important Notes**

### **Migration Safety**

- ✅ **Never edit existing migration files** that have been applied
- ✅ **Always test migrations** on a copy of production data
- ✅ **Backup database** before running migrations
- ✅ **Use transactions** for complex migrations

### **Docker Integration**

- ✅ **Migrations run automatically** on container startup
- ✅ **Health checks** ensure proper startup order
- ✅ **Entrypoint script** handles all initialization
- ✅ **PostgreSQL client tools** included in container

## 🔍 **Troubleshooting**

### **Common Issues**

1. **Migration fails**

   ```bash
   # Check logs
   docker-compose logs api

   # Check database connection
   docker exec -it fastapi-postgres psql -U fastapi_user -d fastapi_db
   ```

2. **Tables not created**

   ```bash
   # Check migration status
   docker exec -it fastapi-app alembic current

   # Run migrations manually
   docker exec -it fastapi-app alembic upgrade head
   ```

3. **Container won't start**

   ```bash
   # Check PostgreSQL health
   docker-compose ps

   # Restart services
   docker-compose down && docker-compose up --build
   ```

### **Verification Commands**

```bash
# Check all tables exist (from host machine)
psql -h localhost -p 6000 -U fastapi_user -d fastapi_db -c "\dt"

# Or from container
docker exec -it fastapi-postgres psql -U fastapi_user -d fastapi_db -c "\dt"

# Check migration status
docker exec -it fastapi-app alembic current

# Check API health
curl http://localhost:8300/health

# View API docs
open http://localhost:8300/docs
```

## 📚 **Next Steps**

### **Adding More Tables**

1. Follow the model → schema → service → endpoint pattern
2. Generate migrations with `alembic revision --autogenerate`
3. Test and deploy

### **Data Migrations**

- Use `op.execute()` for complex data transformations
- Consider data validation in migrations
- Test rollback scenarios

### **Schema Changes**

- Add new columns with `op.add_column()`
- Modify existing columns with `op.alter_column()`
- Drop columns with `op.drop_column()`

Your FastAPI application now follows **best practices** for database migrations and will automatically handle schema updates when deployed! 🎉
