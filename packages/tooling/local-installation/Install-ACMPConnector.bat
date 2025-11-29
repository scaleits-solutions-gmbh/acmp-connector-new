@echo off
:: ═══════════════════════════════════════════════════════════════════════════
:: ACMP Connector API Installer
:: Double-click this file to install
:: ═══════════════════════════════════════════════════════════════════════════

title ACMP Connector API Installer

:: Check for PowerShell
where powershell >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: PowerShell is not installed or not in PATH
    echo Please install PowerShell and try again.
    pause
    exit /b 1
)

:: Run the PowerShell installer
powershell -ExecutionPolicy Bypass -File "%~dp0install.ps1"

exit /b %errorlevel%

