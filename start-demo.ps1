# RAKTAVA BBIS - Demo Startup Script
# Run this from D:\Shruti_Projects\AXN-BBIS to start all services
Write-Host "=== RAKTAVA BBIS Demo Startup ===" -ForegroundColor Cyan
Write-Host ""

# Start Backend (Express API on port 8000)
Write-Host "[1/3] Starting Backend API Server (port 8000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm run dev" -WindowStyle Normal

Start-Sleep -Seconds 4

# Start AI Daemon (Python ML Engine on port 8081)
Write-Host "[2/3] Starting AI Intelligence Daemon (port 8081)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; .\venv\Scripts\python.exe src\modules\ai\ai_daemon.py" -WindowStyle Normal

Start-Sleep -Seconds 2

# Start Frontend (Next.js on port 3000)
Write-Host "[3/3] Starting Frontend Application (port 3000)..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "=== All services starting. Please wait 10-15 seconds ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Frontend:  http://localhost:3000" -ForegroundColor White
Write-Host "  Backend:   http://localhost:8000" -ForegroundColor White
Write-Host "  AI Daemon: http://127.0.0.1:8081" -ForegroundColor White
Write-Host ""
Write-Host "Demo Credentials:" -ForegroundColor Yellow
Write-Host "  Admin:    admin@raktava.in     / SecurePassword123!" -ForegroundColor Gray
Write-Host "  Hospital: dispatch@apollo.in   / HospitalAccess123!" -ForegroundColor Gray
Write-Host "  Patient:  amit.verma@mail.in   / PatientPassword123!" -ForegroundColor Gray
Write-Host ""
Write-Host "Press Enter to open the app in your browser..."
Read-Host
Start-Process "http://localhost:3000"
