@echo off
echo Starting User Frontend with Unified Login...
echo.

echo Killing existing frontend processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul

echo Starting Backend Server (Port 4000)...
start cmd /k "cd backend && npm run server"

timeout /t 5

echo Starting User Frontend (Port 5173) with Unified Login...
start cmd /k "cd frontend && npm run dev"

echo.
echo Servers are starting...
echo Backend: http://localhost:4000
echo User Frontend: http://localhost:5173
echo.
echo ✅ Unified Login Features Available:
echo - User Login/Register (Default)
echo - Admin Login (Redirects to Admin Panel)
echo - Doctor Login (Redirects to Doctor Panel)
echo - Payment Gateways (Stripe & Razorpay) Active
echo.
echo 🌐 Access your app at: http://localhost:5173
echo.
pause