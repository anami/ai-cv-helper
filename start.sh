#!/bin/bash

echo "================================================"
echo "CV Assistant - AI-Powered Career Helper"
echo "================================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null
then
    echo "ERROR: Python 3 is not installed"
    echo "Please install Python 3.8 or higher"
    exit 1
fi

echo "[1/3] Installing Python dependencies..."
pip3 install -r requirements.txt --quiet

echo "[2/3] Checking Ollama status..."
echo "Please make sure Ollama is running!"
echo "If not, start Ollama in another terminal with: ollama serve"
echo ""

echo "[3/3] Starting CV Assistant..."
echo ""
echo "================================================"
echo "Server starting at: http://localhost:8080"
echo "================================================"
echo ""
echo "Open your browser and go to: http://localhost:8080"
echo "Press Ctrl+C to stop the server"
echo ""

python3 app.py
