@echo off
REM Start Flask server using the virtual environment Python

cd /d "%~dp0"

echo Starting Flask server with venv Python...
venv\Scripts\python.exe app.py

pause
