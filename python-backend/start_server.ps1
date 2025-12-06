# Start Flask server using virtual environment
# Run this script from the python-backend directory

$venvPython = ".\venv\Scripts\python.exe"

if (Test-Path $venvPython) {
    Write-Host "Starting Flask server with venv Python..." -ForegroundColor Green
    & $venvPython app.py
} else {
    Write-Host "Virtual environment not found! Please create it first:" -ForegroundColor Red
    Write-Host "  python -m venv venv" -ForegroundColor Yellow
    Write-Host "  .\venv\Scripts\activate" -ForegroundColor Yellow
    Write-Host "  pip install -r requirements.txt" -ForegroundColor Yellow
}
