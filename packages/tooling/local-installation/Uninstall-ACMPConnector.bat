@echo off
:: ═══════════════════════════════════════════════════════════════════════════
:: ACMP Connector API Uninstaller
:: ═══════════════════════════════════════════════════════════════════════════

title ACMP Connector API Uninstaller

echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║           ACMP Connector API Uninstaller                      ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

:: Check if installed
if not exist "%LOCALAPPDATA%\ACMPConnector" (
    echo ACMP Connector is not installed.
    pause
    exit /b 0
)

:: Confirm uninstall
echo This will:
echo   - Stop the ACMP Connector service
echo   - Remove auto-start from Windows login
echo   - Remove Start Menu shortcuts
echo   - Optionally delete all files and configuration
echo.
set /p confirm="Are you sure you want to uninstall? (y/N): "
if /i not "%confirm%"=="y" (
    echo Uninstall cancelled.
    pause
    exit /b 0
)

echo.
echo Uninstalling ACMP Connector API...
echo.

:: Stop the process
echo [*] Stopping service...
taskkill /F /IM acmp-connector-api.exe 2>nul
if %errorlevel%==0 (
    echo     Service stopped.
) else (
    echo     Service was not running.
)

:: Remove from startup
echo [*] Removing auto-start...
del "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\ACMPConnector.lnk" 2>nul
echo     Auto-start removed.

:: Remove Start Menu shortcuts
echo [*] Removing Start Menu shortcuts...
rmdir /s /q "%APPDATA%\Microsoft\Windows\Start Menu\Programs\ACMP Connector" 2>nul
echo     Shortcuts removed.

:: Ask before removing files
echo.
set /p removeFiles="Remove all files including configuration? (y/N): "
if /i "%removeFiles%"=="y" (
    echo [*] Removing installation files...
    cd /d "%USERPROFILE%"
    rmdir /s /q "%LOCALAPPDATA%\ACMPConnector"
    echo     Files removed.
) else (
    echo     Files kept at: %LOCALAPPDATA%\ACMPConnector
)

echo.
echo ═══════════════════════════════════════════════════════════════════
echo Uninstall complete!
echo ═══════════════════════════════════════════════════════════════════
echo.
pause

