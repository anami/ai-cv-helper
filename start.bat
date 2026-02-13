@echo off
echo ================================================
echo AI Career Assistant - AI-Powered Career Helper
echo ================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8 or higher from python.org
    pause
    exit /b 1
)

echo [1/3] Installing Python dependencies...
pip install -r requirements.txt --quiet

echo [2/3] Checking Ollama status...
echo Please make sure Ollama is running!
echo If not, start Ollama from your terminal with: ollama serve
echo.

echo [3/3] Starting AI Career Assistant...
echo.
echo ================================================
echo Server starting at: http://localhost:5000
echo ================================================
echo.
echo Open your browser and go to: http://localhost:5000
echo Press Ctrl+C to stop the server
echo.

python app.py
