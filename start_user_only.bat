@echo off
echo Starting Prescripto User Frontend...
echo.

echo Stopping existing servers...
taskkill /F /IM node.exe >nul 2>&1

echo Starting Backend Server...
start cmd /k "cd backend && npm run server"
timeout /t 5 >nul

echo Starting User Frontend...
start cmd /k "cd frontend && npm run dev"
timeout /t 5 >nul

echo Starting Admin Panel...
start cmd /k "cd admin && npm run dev"
timeout /t 3 >nul

echo Opening User Frontend...
start http://localhost:5173

echo.
echo ✅ Project Started Successfully!
echo User Frontend (Main Login): http://localhost:5173
echo Admin Panel: http://localhost:5174
echo Backend: http://localhost:4000
echo.
echo Note: Use SINGLE login at localhost:5173 for all users
echo.
pause