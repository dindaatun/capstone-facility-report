@echo off
title Facility Report Launcher

echo ========================================
echo   Menjalankan Facility Report
echo ========================================
echo.

REM Folder tempat start-app.bat berada
cd /d "%~dp0"

echo Menjalankan Laravel Backend...
start "Laravel Backend" /D "%~dp0backend" cmd /k php artisan serve

echo Menjalankan React Frontend...
start "React Frontend" /D "%~dp0frontend" cmd /k npm run dev

echo.
echo Menunggu server hidup...
timeout /t 5 /nobreak >nul

echo Membuka browser...
start "" "http://localhost:5173"

exit /b