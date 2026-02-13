#!/bin/bash

echo "================================================"
echo "AI Career Assistant - AI-Powered Career Helper"
echo "================================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "ERROR: Node.js is not installed"
    echo "Please install Node.js 20 or higher"
    exit 1
fi

echo "[1/3] Installing dependencies..."
npm install --silent

echo "[2/3] Checking Ollama status..."
echo "Please make sure Ollama is running!"
echo "If not, start Ollama in another terminal with: ollama serve"
echo ""

echo "[3/3] Starting AI Career Assistant..."
echo ""
echo "================================================"
echo "Dev server starting at: http://localhost:5173"
echo "API server starting at: http://localhost:8080"
echo "================================================"
echo ""
echo "Open your browser and go to: http://localhost:5173"
echo "Press Ctrl+C to stop the servers"
echo ""

npm run dev
