@echo off
setlocal
cd /d "%~dp0"

if not exist ".venv\Scripts\python.exe" (
    echo ERROR: .venv was not found.
    echo Create it with: py -m venv .venv
    echo Then install dependencies with: .venv\Scripts\python.exe -m pip install -r brain.py\Max2.0\requirements.txt -r backend\requirements.txt
    pause
    exit /b 1
)

if not exist "brain.py\Max2.0\.env" (
    copy /Y ".env.example" "brain.py\Max2.0\.env" >nul
    echo Created brain.py\Max2.0\.env from .env.example.
    echo Add your real GROQ_API_KEY before starting MAX.
)

set "BACKEND_PORT=8000"

cd /d "%~dp0MAX-Frontend"
call npm run build
if errorlevel 1 (
    echo ERROR: Frontend build failed.
    pause
    exit /b 1
)

cd /d "%~dp0"
start "MAX App" cmd /k ""%~dp0.venv\Scripts\python.exe" -m uvicorn backend.api:app --host 127.0.0.1 --port %BACKEND_PORT%"
start "MAX Browser" cmd /c "start ""http://127.0.0.1:%BACKEND_PORT%/""

echo.
echo MAX is starting.
echo App: http://127.0.0.1:%BACKEND_PORT%
echo.
echo Keep the terminal window open. Press any key to exit launcher.
pause >nul
