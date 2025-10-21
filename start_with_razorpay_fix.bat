@echo off
echo Starting Prescripto with Fixed Razorpay Integration...
echo.

echo Killing existing processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 3 >nul

echo Starting Backend Server (Port 4000)...
start cmd /k "cd backend && npm run server"

timeout /t 5

echo Starting User Frontend (Port 5173)...
start cmd /k "cd frontend && npm run dev"

echo.
echo ✅ Servers are starting with FIXED Razorpay integration...
echo Backend: http://localhost:4000
echo User Frontend: http://localhost:5173
echo.
echo 🎯 Razorpay Fixes Applied:
echo - Updated API keys
echo - Added demo/mock mode fallback
echo - Enhanced error handling
echo - Fixed script loading order
echo - Simplified payment flow
echo.
echo 💡 Test Instructions:
echo 1. Go to http://localhost:5173
echo 2. Book an appointment
echo 3. Go to My Appointments
echo 4. Click Pay Online → Razorpay
echo 5. Check browser console for detailed logs
echo.
echo 🔧 If still not working, check browser console (F12)
echo.
pause