@echo off
REM ─────────────────────────────────────────────────────────────────────────────
REM Build NSIS Installer Script
REM ─────────────────────────────────────────────────────────────────────────────

title ACMP Connector API Installer Builder

echo.
echo ═══════════════════════════════════════════════════════════════════
echo   ACMP Connector API - NSIS Installer Builder
echo ═══════════════════════════════════════════════════════════════════
echo.
echo [ℹ] Note: The installer will download acmp-connector-api.exe during installation.
echo.

REM Check for NSIS
where makensis >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] NSIS (makensis) not found in PATH!
    echo.
    echo Please install NSIS from: https://nsis.sourceforge.io/Download
    echo Or add NSIS to your PATH.
    echo.
    echo Common NSIS installation paths:
    echo   C:\Program Files (x86)\NSIS\makensis.exe
    echo   C:\Program Files\NSIS\makensis.exe
    echo.
    pause
    exit /b 1
)

echo [✓] Found NSIS compiler
echo.

REM Build the installer
echo Building installer...
echo.

makensis acmp-connector-installer.nsi

if %errorlevel%==0 (
    echo.
    echo ═══════════════════════════════════════════════════════════════════
    echo   Build successful!
    echo ═══════════════════════════════════════════════════════════════════
    echo.
    echo Installer created: acmp-connector-api-installer.exe
    echo.
) else (
    echo.
    echo ═══════════════════════════════════════════════════════════════════
    echo   Build failed!
    echo ═══════════════════════════════════════════════════════════════════
    echo.
    exit /b 1
)

pause

