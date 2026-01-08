#!/bin/bash
# Start Frontend Development Server

cd "$(dirname "$0")/frontend" || exit 1

echo "🚀 Starting Frontend Development Server..."
echo "📁 Working directory: $(pwd)"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules not found. Installing dependencies..."
    npm install
    echo ""
fi

# Start the dev server
npm run dev

