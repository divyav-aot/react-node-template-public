#!/bin/bash
set -euo pipefail

echo "🚀 Starting FastAPI application with database migrations..."

# Show basic env for debugging (mask password)
echo "ALEMBIC working dir: $(pwd)"
echo "Looking for alembic.ini at: $(pwd)/alembic.ini"
echo "Listing alembic/versions:"
ls -la alembic/versions || true

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
until pg_isready -h ${DB_HOST:-postgres_db} -U ${DB_USERNAME:-postgres} -d ${DB_DATABASE:-mydb}; do
    echo "PostgreSQL is unavailable - sleeping"
    sleep 2
done

echo "✅ PostgreSQL is ready!"

# Show Alembic status before running
echo "ℹ️  Alembic history (before upgrade):"
set +e
alembic history | cat || true
alembic current | cat || true
set -e

# Run database migrations
echo "🔄 Running database migrations (alembic upgrade head)..."
if ! alembic upgrade head; then
  echo "❌ Alembic migration failed"
  echo "ℹ️  Current Alembic status:"
  set +e
  alembic current | cat || true
  alembic history | cat || true
  set -e
  exit 1
fi

echo "✅ Database migrations completed!"

# Show Alembic status after running
echo "ℹ️  Alembic current (after upgrade):"
alembic current | cat || true

# Start the application
echo "🚀 Starting FastAPI application..."
exec uvicorn main:app --host 0.0.0.0 --port 8000 