@echo off
cls
echo ========================================
echo    PRESCRIPTO - STARTING ALL SERVERS
echo ========================================
echo.

echo Stopping existing servers...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 3 >nul

echo Starting Backend Server (Port 4000)...
start cmd /k "title Backend Server && cd backend && npm run server"
timeout /t 8 >nul

echo Starting User Frontend (Port 5173)...
start cmd /k "title User Frontend && cd frontend && npm run dev"
timeout /t 5 >nul

echo Starting Admin Panel (Port 5174)...
start cmd /k "title Admin Panel && cd admin && npm run dev"
timeout /t 5 >nul

echo.
echo ========================================
echo     ALL SERVERS STARTED SUCCESSFULLY!
echo ========================================
echo.
echo Backend API:         http://localhost:4000
echo User Frontend:       http://localhost:5173
echo Admin Panel:         http://localhost:5174
echo.
echo ADMIN CREDENTIALS:
echo Email:    prescripto7208@gmail.com
echo Password: surajyadav123
echo.
echo Opening User Frontend...
start http://localhost:5173/login
echo.
echo Press any key to exit...
pause >nul