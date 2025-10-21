@echo off
echo Restarting all servers with updated payment gateway configuration...
echo.

echo Killing existing processes...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM npm.exe >nul 2>&1
timeout /t 3 >nul

echo Starting Backend Server (Port 4000)...
start cmd /k "cd backend && npm run server"

timeout /t 5

echo Starting Admin Frontend (Port 5174)...
start cmd /k "cd admin && npm run dev"

timeout /t 3

echo Starting User Frontend (Port 5173)...
start cmd /k "cd frontend && npm run dev"

echo.
echo All servers are starting...
echo Backend: http://localhost:4000
echo Admin Panel: http://localhost:5174
echo User Frontend: http://localhost:5173
echo.
echo Payment gateways are now active!
echo - Stripe (Test Mode)
echo - Razorpay (Test Mode)
echo.
pause