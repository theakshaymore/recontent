@echo off
echo ========================================
echo ReContent AI - Starting Application
echo ========================================
echo.

echo [1/5] Starting Redis with Docker Compose...
docker-compose up -d
if %errorlevel% neq 0 (
    echo ERROR: Failed to start Redis. Make sure Docker is running.
    pause
    exit /b 1
)
echo Redis started successfully!
echo.

echo [2/5] Waiting for Redis to be ready...
timeout /t 3 /nobreak >nul
echo.

echo [3/5] Installing Frontend Dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies.
    pause
    exit /b 1
)
echo Frontend dependencies installed!
echo.

echo [4/5] Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies.
    cd ..
    pause
    exit /b 1
)
cd ..
echo Backend dependencies installed!
echo.

echo [5/5] Setup Complete!
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo 1. Configure your .env files (see setup-env.md)
echo 2. Run: npm run dev (in recontent/ for frontend)
echo 3. Run: npm run dev (in recontent/backend/ for backend)
echo.
echo Frontend will be at: http://localhost:5173
echo Backend API will be at: http://localhost:3000
echo ========================================
echo.
pause
