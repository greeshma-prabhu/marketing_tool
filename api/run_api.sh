#!/bin/bash
# Run FastAPI backend server

cd "$(dirname "$0")/.."
source venv/bin/activate

echo "🚀 Starting FastAPI backend..."
echo "📝 API docs at: http://localhost:8000/docs"
echo ""

uvicorn api.main:app --reload --host 0.0.0.0 --port 8000

