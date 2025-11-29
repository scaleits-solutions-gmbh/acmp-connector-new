@echo off
:: ═══════════════════════════════════════════════════════════════════════════
:: ACMP Connector API Installer (with Caddy Proxy)
:: This version runs as administrator for port 80/443 binding
:: ═══════════════════════════════════════════════════════════════════════════

title ACMP Connector API Installer (Admin)

:: Check if running as admin
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo Requesting administrator privileges...
    powershell -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
    exit /b
)

:: Check for PowerShell
where powershell >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: PowerShell is not installed or not in PATH
    echo Please install PowerShell and try again.
    pause
    exit /b 1
)

:: Run the PowerShell installer with proxy flag
powershell -ExecutionPolicy Bypass -File "%~dp0install.ps1" -InstallProxy

exit /b %errorlevel%

