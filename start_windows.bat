@echo off
cd /d "%~dp0"

echo ============================
echo   Run Flask Application 
echo ============================
echo.
echo 1. Run locally (localhost:5000) 
echo 2. Run on local network (0.0.0.0:5000) 
echo.

set /p choice=Choose an option (1 or 2):

if "%choice%"=="1" (
    echo Running locally...
    flask --app main run
) else if "%choice%"=="2" (
    echo Running on local network...
    flask --app main run --host=0.0.0.0
) else (
    echo Invalid choice. Exiting...
)

pause