# Setup and Run script for SmartRoute

Write-Host "Setting up backend..."
cd backend
if (-Not (Test-Path "venv")) {
    python -m venv venv
}
.\venv\Scripts\activate
pip install -r requirements.txt

Write-Host "Starting PostgreSQL via Docker Compose..."
docker-compose up -d

Write-Host "Starting FastAPI server in a new window..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd d:\SmartRoute\backend; .\venv\Scripts\activate; uvicorn app.main:app --reload"

Write-Host "Starting Vite React server in a new window..."
cd ..\frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd d:\SmartRoute\frontend; npm run dev"

Write-Host "All services starting! Check the new windows."
