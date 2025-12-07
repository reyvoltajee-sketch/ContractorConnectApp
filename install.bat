@echo off
cd /d "%~dp0"
echo Installing dependencies...
call npm install --legacy-peer-deps
if %errorlevel% equ 0 (
    echo.
    echo Installation completed successfully!
    pause
) else (
    echo.
    echo Installation failed. Check the error messages above.
    pause
)

