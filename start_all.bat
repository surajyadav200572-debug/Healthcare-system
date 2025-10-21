@echo off
echo Starting Prescripto Application...
echo.

REM Start Backend Server
echo Starting Backend Server...
start "Backend Server" cmd /k "cd /d C:\Users\palv2\Desktop\prescripto_full-stack_doctor_appointment_app-main\backend && npm start"

REM Wait for 3 seconds
timeout /t 3 /nobreak > nul

REM Start Admin Panel
echo Starting Admin Panel...
start "Admin Panel" cmd /k "cd /d C:\Users\palv2\Desktop\prescripto_full-stack_doctor_appointment_app-main\admin && npm run dev"

REM Wait for 3 seconds
timeout /t 3 /nobreak > nul

REM Start Frontend
echo Starting Frontend...
start "Frontend" cmd /k "cd /d C:\Users\palv2\Desktop\prescripto_full-stack_doctor_appointment_app-main\frontend && npm run dev"

echo.
echo All servers are starting...
echo Backend: http://localhost:4000
echo Admin Panel: http://localhost:5174  
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window...
pause > nul