@echo off
title FarmTrace - Blockchain System
color 0A
echo.
echo ========================================
echo    FarmTrace - Blockchain System
echo ========================================
echo.

echo [1/3] Checking system requirements...
docker --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✓ Docker found - Using Docker method
    echo.
    echo [2/3] Building and starting system...
    echo This may take 5-10 minutes on first run...
    echo.
    docker compose up --build
    goto :success
)

node --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✓ Node.js found - Using Node.js method
    echo.
    echo [2/3] Installing dependencies and building...
    npm install
    npm run build:frontend
    echo.
    echo [3/3] Starting server...
    npm start
    goto :success
)

echo ✗ Neither Docker nor Node.js found
echo.
echo Please install one of these:
echo 1. Docker Desktop: https://www.docker.com/products/docker-desktop/
echo 2. Node.js: https://nodejs.org/
echo.
echo Then restart your computer and run this script again.
echo.
pause
exit /b 1

:success
echo.
echo ========================================
echo    ✓ SYSTEM IS RUNNING!
echo ========================================
echo.
echo 🌐 Open in browser: http://localhost:3000
echo.
echo 🔑 Demo Login Credentials:
echo    Admin:    admin / admin123
echo    Farmer:   farmer1 / demo123
echo    Consumer: consumer1 / demo123
echo.
echo 📋 Quick Test:
echo    1. Login as farmer1/demo123
echo    2. Create a product
echo    3. Login as consumer1/demo123
echo    4. Trace the product
echo.
pause
