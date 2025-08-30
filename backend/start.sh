#!/bin/bash

echo "Starting FastAPI application..."
echo ""
echo "Make sure you have Python and pip installed."
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

echo ""
echo "Starting the server..."
echo "API will be available at: http://localhost:8300"
echo "Interactive docs at: http://localhost:8300/docs"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the application
python main.py 