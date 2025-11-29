#Requires -Version 5.1
<#
.SYNOPSIS
    ACMP Connector API Installer

.DESCRIPTION
    Installs the ACMP Connector API service on the local machine.
    - Downloads/copies the executable to %LOCALAPPDATA%\ACMPConnector
    - Creates configuration files
    - Sets up auto-start on Windows login
    - Optionally installs Caddy reverse proxy for port 80/443
    - Starts the service
    - Opens browser to health check endpoint

.PARAMETER DownloadUrl
    URL to download the executable from. If not provided, looks for local executable.

.PARAMETER ApiKey
    API key for authentication. If not provided, prompts the user.

.PARAMETER Port
    Internal port for the API to listen on. Default: 3000

.PARAMETER InstallProxy
    Install Caddy reverse proxy to expose API on port 80/443.

.PARAMETER ProxyDomain
    Domain name for the proxy (enables HTTPS). Use 'localhost' for HTTP only.

.PARAMETER ProxyPath
    Path prefix for routing (e.g., '/acmp-connector'). Use empty string for root path.
    Default: '/acmp-connector' when proxy is installed.

.PARAMETER SkipAutoStart
    Skip setting up auto-start on Windows login.

.PARAMETER Silent
    Run in silent mode (no prompts, uses defaults).

.EXAMPLE
    .\install.ps1
    
.EXAMPLE
    .\install.ps1 -ApiKey "my-secret-key" -Port 3080

.EXAMPLE
    .\install.ps1 -InstallProxy -ProxyDomain "acmp.mycompany.local"

.EXAMPLE
    .\install.ps1 -InstallProxy -ProxyDomain "localhost" -ProxyPath "/acmp-connector"
#>

param(
    [string]$DownloadUrl = "",
    [string]$ApiKey = "",
    [int]$Port = 3000,
    [switch]$InstallProxy,
    [string]$ProxyDomain = "",
    [string]$ProxyPath = "",
    [switch]$SkipAutoStart,
    [switch]$Silent
)

# ─────────────────────────────────────────────────────────────────────────────
# Configuration
# ─────────────────────────────────────────────────────────────────────────────

$AppName = "ACMPConnector"
$ExeName = "acmp-connector-api.exe"
$CaddyExeName = "caddy.exe"
$InstallDir = Join-Path $env:LOCALAPPDATA $AppName
$StartupDir = [Environment]::GetFolderPath("Startup")
$CaddyDownloadUrl = "https://github.com/caddyserver/caddy/releases/download/v2.8.4/caddy_2.8.4_windows_amd64.zip"

# ─────────────────────────────────────────────────────────────────────────────
# Helper Functions
# ─────────────────────────────────────────────────────────────────────────────

function Write-Banner {
    Write-Host ""
    Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║                                                               ║" -ForegroundColor Cyan
    Write-Host "║           ACMP Connector API Installer v1.0.0                 ║" -ForegroundColor Cyan
    Write-Host "║                                                               ║" -ForegroundColor Cyan
    Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
}

function Write-Step {
    param([string]$Message)
    Write-Host "[" -NoNewline
    Write-Host "•" -ForegroundColor Green -NoNewline
    Write-Host "] $Message"
}

function Write-Error-Custom {
    param([string]$Message)
    Write-Host "[" -NoNewline
    Write-Host "✗" -ForegroundColor Red -NoNewline
    Write-Host "] $Message" -ForegroundColor Red
}

function Write-Success {
    param([string]$Message)
    Write-Host "[" -NoNewline
    Write-Host "✓" -ForegroundColor Green -NoNewline
    Write-Host "] $Message" -ForegroundColor Green
}

function Write-Warning-Custom {
    param([string]$Message)
    Write-Host "[" -NoNewline
    Write-Host "!" -ForegroundColor Yellow -NoNewline
    Write-Host "] $Message" -ForegroundColor Yellow
}

function Test-Administrator {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Stop-ExistingProcess {
    param([string]$ProcessName)
    $process = Get-Process -Name $ProcessName -ErrorAction SilentlyContinue
    if ($process) {
        Write-Step "Stopping existing $ProcessName process..."
        Stop-Process -Name $ProcessName -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
    }
}

function Find-LocalExecutable {
    # Look for executable in common locations
    $searchPaths = @(
        (Join-Path $PSScriptRoot $ExeName),
        (Join-Path $PSScriptRoot "release\$ExeName"),
        (Join-Path $PSScriptRoot "..\release\$ExeName"),
        (Join-Path $PSScriptRoot "..\apps\fastify\api\release\$ExeName")
    )
    
    foreach ($path in $searchPaths) {
        if (Test-Path $path) {
            return (Resolve-Path $path).Path
        }
    }
    
    return $null
}

function Install-Caddy {
    param(
        [string]$InstallPath,
        [string]$Domain,
        [int]$BackendPort,
        [string]$ProxyPath = ""
    )
    
    $caddyPath = Join-Path $InstallPath $CaddyExeName
    $caddyZipPath = Join-Path $env:TEMP "caddy.zip"
    
    # Download Caddy
    Write-Step "Downloading Caddy..."
    try {
        Invoke-WebRequest -Uri $CaddyDownloadUrl -OutFile $caddyZipPath -UseBasicParsing
        Write-Success "Caddy downloaded!"
    }
    catch {
        Write-Error-Custom "Failed to download Caddy: $_"
        return $false
    }
    
    # Extract Caddy
    Write-Step "Extracting Caddy..."
    try {
        Expand-Archive -Path $caddyZipPath -DestinationPath $env:TEMP\caddy_extract -Force
        $extractedCaddy = Get-ChildItem -Path $env:TEMP\caddy_extract -Filter "caddy.exe" -Recurse | Select-Object -First 1
        if ($extractedCaddy) {
            Copy-Item -Path $extractedCaddy.FullName -Destination $caddyPath -Force
        }
        Remove-Item -Path $caddyZipPath -Force -ErrorAction SilentlyContinue
        Remove-Item -Path $env:TEMP\caddy_extract -Recurse -Force -ErrorAction SilentlyContinue
        Write-Success "Caddy extracted!"
    }
    catch {
        Write-Error-Custom "Failed to extract Caddy: $_"
        return $false
    }
    
    # Create Caddyfile
    Write-Step "Creating Caddy configuration..."
    
    # Normalize proxy path (ensure it starts with / and doesn't end with /)
    if ($ProxyPath -and -not $ProxyPath.StartsWith("/")) {
        $ProxyPath = "/" + $ProxyPath
    }
    if ($ProxyPath -and $ProxyPath.EndsWith("/")) {
        $ProxyPath = $ProxyPath.TrimEnd("/")
    }
    
    # Build reverse proxy directive based on path prefix
    if ($ProxyPath) {
        # Path-based routing: strip prefix before forwarding
        $reverseProxyBlock = @"
    # Route $ProxyPath/* to the API (prefix is stripped)
    handle_path $ProxyPath/* {
        reverse_proxy localhost:$BackendPort
        
        # Pass real client IP
        header_up X-Real-IP {remote_host}
        header_up X-Forwarded-For {remote_host}
        header_up X-Forwarded-Proto {scheme}
    }
    
    # Everything else returns 404 (or can be handled by other services)
    handle {
        respond "Not Found" 404
    }
"@
    }
    else {
        # Root path routing: forward everything
        $reverseProxyBlock = @"
    reverse_proxy localhost:$BackendPort
    
    # Pass real client IP
    header_up X-Real-IP {remote_host}
    header_up X-Forwarded-For {remote_host}
    header_up X-Forwarded-Proto {scheme}
"@
    }
    
    if ($Domain -eq "localhost" -or $Domain -eq "") {
        # HTTP only configuration
        $caddyConfig = @"
{
    # Disable automatic HTTPS for localhost
    auto_https off
}

:80 {
$reverseProxyBlock
    
    # Logging
    log {
        output file caddy-access.log
        format console
    }
}
"@
    }
    else {
        # HTTPS configuration with domain
        $caddyConfig = @"
{
    # Email for Let's Encrypt (optional)
    # email admin@$Domain
}

$Domain {
$reverseProxyBlock
    
    # Logging
    log {
        output file caddy-access.log
        format console
    }
}

# Also listen on HTTP and redirect to HTTPS
http://$Domain {
    redir https://{host}{uri} permanent
}
"@
    }
    
    $caddyfilePath = Join-Path $InstallPath "Caddyfile"
    Set-Content -Path $caddyfilePath -Value $caddyConfig -Encoding UTF8
    Write-Success "Caddyfile created!"
    
    # Create Caddy start/stop scripts
    $caddyStartBat = @"
@echo off
cd /d "%~dp0"
echo Starting Caddy reverse proxy...
start /B $CaddyExeName run --config Caddyfile > caddy.log 2>&1
echo Caddy started!
timeout /t 2 >nul
"@
    Set-Content -Path (Join-Path $InstallPath "caddy-start.bat") -Value $caddyStartBat -Encoding ASCII
    
    $caddyStopBat = @"
@echo off
taskkill /F /IM $CaddyExeName 2>nul
if %errorlevel%==0 (
    echo Caddy stopped.
) else (
    echo Caddy is not running.
)
timeout /t 2 >nul
"@
    Set-Content -Path (Join-Path $InstallPath "caddy-stop.bat") -Value $caddyStopBat -Encoding ASCII
    
    return $true
}

# ─────────────────────────────────────────────────────────────────────────────
# Main Installation
# ─────────────────────────────────────────────────────────────────────────────

try {
    Write-Banner

    # Check for admin rights if installing proxy
    if ($InstallProxy) {
        if (-not (Test-Administrator)) {
            Write-Warning-Custom "Installing the reverse proxy requires administrator rights."
            Write-Warning-Custom "Port 80/443 binding needs elevated privileges."
            Write-Host ""
            Write-Host "Please right-click 'Install-ACMPConnector.bat' and select 'Run as administrator'" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "Or run without -InstallProxy to install API only (port $Port)" -ForegroundColor Gray
            Write-Host ""
            Write-Host "Press any key to exit..." -ForegroundColor Gray
            $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
            exit 1
        }
    }

    # Step 1: Stop existing processes
    Stop-ExistingProcess -ProcessName "acmp-connector-api"
    if ($InstallProxy) {
        Stop-ExistingProcess -ProcessName "caddy"
    }

    # Step 2: Create installation directory
    Write-Step "Creating installation directory: $InstallDir"
    if (-not (Test-Path $InstallDir)) {
        New-Item -ItemType Directory -Path $InstallDir -Force | Out-Null
    }

    # Step 3: Get the executable
    $sourcePath = $null
    
    if ($DownloadUrl) {
        Write-Step "Downloading executable from: $DownloadUrl"
        $destPath = Join-Path $InstallDir $ExeName
        try {
            Invoke-WebRequest -Uri $DownloadUrl -OutFile $destPath -UseBasicParsing
            Write-Success "Download complete!"
        }
        catch {
            Write-Error-Custom "Failed to download: $_"
            exit 1
        }
    }
    else {
        $sourcePath = Find-LocalExecutable
        if ($sourcePath) {
            Write-Step "Found local executable: $sourcePath"
            $destPath = Join-Path $InstallDir $ExeName
            Copy-Item -Path $sourcePath -Destination $destPath -Force
            Write-Success "Executable copied!"
        }
        else {
            Write-Error-Custom "No executable found! Please provide -DownloadUrl or place $ExeName in the same directory."
            exit 1
        }
    }

    # Step 4: Prompt for configuration if not silent
    if (-not $Silent) {
        Write-Host ""
        
        if (-not $ApiKey) {
            $ApiKey = Read-Host "Enter your API key (press Enter to skip)"
        }
        
        if (-not $InstallProxy) {
            $proxyChoice = Read-Host "Install reverse proxy for port 80 access? (y/N)"
            if ($proxyChoice -eq "y" -or $proxyChoice -eq "Y") {
                if (-not (Test-Administrator)) {
                    Write-Warning-Custom "Proxy installation requires admin rights. Skipping..."
                }
                else {
                    $InstallProxy = $true
                }
            }
        }
        
        if ($InstallProxy -and -not $ProxyDomain) {
            Write-Host ""
            Write-Host "Proxy domain options:" -ForegroundColor Cyan
            Write-Host "  1. localhost    - HTTP only on port 80 (internal use)"
            Write-Host "  2. domain.local - HTTP only with custom domain"
            Write-Host "  3. domain.com   - HTTPS with Let's Encrypt (public domain required)"
            Write-Host ""
            $ProxyDomain = Read-Host "Enter domain (default: localhost)"
            if (-not $ProxyDomain) {
                $ProxyDomain = "localhost"
            }
        }
        
        if ($InstallProxy -and -not $ProxyPath) {
            Write-Host ""
            Write-Host "Path prefix options:" -ForegroundColor Cyan
            Write-Host "  /acmp-connector - Route via /acmp-connector/* (recommended for shared servers)"
            Write-Host "  (empty)         - Route from root /* (may interfere with other services)"
            Write-Host ""
            $pathInput = Read-Host "Enter path prefix (default: /acmp-connector)"
            if ($pathInput) {
                $ProxyPath = $pathInput
            }
            else {
                $ProxyPath = "/acmp-connector"
            }
        }
    }

    # Step 5: Create .env file
    Write-Step "Creating configuration file..."
    $envContent = @"
# ACMP Connector API Configuration
# Generated by installer on $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

# Server Configuration
PORT=$Port
HOST=0.0.0.0

# API Key Authentication
API_KEY=$ApiKey

# Database Configuration (MSSQL)
# Update these values with your ACMP database connection details
MSSQL_SERVER=localhost
MSSQL_DATABASE=ACMP
MSSQL_USER=
MSSQL_PASSWORD=
MSSQL_PORT=1433
MSSQL_ENCRYPT=false
MSSQL_TRUST_SERVER_CERTIFICATE=true

# SICS API Configuration (Optional)
SICS_API_URL=http://localhost:8080
SICS_API_USERNAME=
SICS_API_PASSWORD=
"@

    $envPath = Join-Path $InstallDir ".env"
    if (-not (Test-Path $envPath)) {
        Set-Content -Path $envPath -Value $envContent -Encoding UTF8
        Write-Success "Configuration file created: $envPath"
    }
    else {
        Write-Step "Configuration file already exists, skipping..."
    }

    # Step 6: Set default proxy path if not provided
    if ($InstallProxy -and -not $ProxyPath) {
        $ProxyPath = "/acmp-connector"
    }

    # Step 7: Install Caddy if requested
    if ($InstallProxy) {
        Write-Host ""
        Write-Step "Installing Caddy reverse proxy..."
        $caddyInstalled = Install-Caddy -InstallPath $InstallDir -Domain $ProxyDomain -BackendPort $Port -ProxyPath $ProxyPath
        if (-not $caddyInstalled) {
            Write-Warning-Custom "Caddy installation failed. Continuing without proxy..."
            $InstallProxy = $false
        }
    }

    # Step 8: Create helper scripts
    Write-Step "Creating helper scripts..."

    # Determine URLs based on proxy
    if ($InstallProxy) {
        # Build base URL with path prefix
        $basePath = if ($ProxyPath) { $ProxyPath } else { "" }
        
        if ($ProxyDomain -eq "localhost") {
            $PublicUrl = "http://localhost$basePath"
            $HealthEndpoint = "http://localhost$basePath/health"
        }
        else {
            $PublicUrl = "https://$ProxyDomain$basePath"
            $HealthEndpoint = "https://$ProxyDomain$basePath/health"
        }
    }
    else {
        $PublicUrl = "http://localhost:$Port"
        $HealthEndpoint = "http://localhost:$Port/health"
    }

    # start.bat - starts both API and Caddy if installed
    if ($InstallProxy) {
        $startBat = @"
@echo off
cd /d "%~dp0"
echo Starting ACMP Connector API...
start /B $ExeName > api.log 2>&1
timeout /t 2 >nul
echo Starting Caddy reverse proxy...
start /B $CaddyExeName run --config Caddyfile > caddy.log 2>&1
echo.
echo ═══════════════════════════════════════════════════════════════════
echo ACMP Connector started!
echo.
echo Internal API: http://localhost:$Port
echo Public URL:   $PublicUrl
echo Health check: $HealthEndpoint
echo.
echo Logs: %~dp0api.log, %~dp0caddy.log
echo ═══════════════════════════════════════════════════════════════════
timeout /t 3 >nul
"@
    }
    else {
        $startBat = @"
@echo off
cd /d "%~dp0"
echo Starting ACMP Connector API on port $Port...
start /B $ExeName > api.log 2>&1
echo.
echo ACMP Connector API started!
echo Health check: $HealthEndpoint
echo Logs: %~dp0api.log
echo.
timeout /t 3 >nul
"@
    }
    Set-Content -Path (Join-Path $InstallDir "start.bat") -Value $startBat -Encoding ASCII

    # start-visible.bat (for debugging)
    $startVisibleBat = @"
@echo off
cd /d "%~dp0"
echo Starting ACMP Connector API (visible mode)...
echo Press Ctrl+C to stop.
echo.
$ExeName
"@
    Set-Content -Path (Join-Path $InstallDir "start-visible.bat") -Value $startVisibleBat -Encoding ASCII

    # stop.bat
    if ($InstallProxy) {
        $stopBat = @"
@echo off
echo Stopping ACMP Connector services...
taskkill /F /IM $ExeName 2>nul
taskkill /F /IM $CaddyExeName 2>nul
echo Services stopped.
timeout /t 2 >nul
"@
    }
    else {
        $stopBat = @"
@echo off
taskkill /F /IM $ExeName 2>nul
if %errorlevel%==0 (
    echo ACMP Connector API stopped.
) else (
    echo ACMP Connector API is not running.
)
timeout /t 2 >nul
"@
    }
    Set-Content -Path (Join-Path $InstallDir "stop.bat") -Value $stopBat -Encoding ASCII

    # restart.bat
    $restartBat = @"
@echo off
cd /d "%~dp0"
echo Restarting ACMP Connector...
call stop.bat
timeout /t 2 >nul
call start.bat
"@
    Set-Content -Path (Join-Path $InstallDir "restart.bat") -Value $restartBat -Encoding ASCII

    # status.bat
    if ($InstallProxy) {
        $statusBat = @"
@echo off
echo ═══════════════════════════════════════════════════════════════════
echo ACMP Connector Status
echo ═══════════════════════════════════════════════════════════════════
echo.
echo API Process:
tasklist /FI "IMAGENAME eq $ExeName" 2>nul | find /I "$ExeName" >nul
if %errorlevel%==0 (
    echo   Status: RUNNING
) else (
    echo   Status: NOT RUNNING
)
echo.
echo Caddy Process:
tasklist /FI "IMAGENAME eq $CaddyExeName" 2>nul | find /I "$CaddyExeName" >nul
if %errorlevel%==0 (
    echo   Status: RUNNING
) else (
    echo   Status: NOT RUNNING
)
echo.
echo Health Check ($HealthEndpoint):
curl -s $HealthEndpoint 2>nul
echo.
echo ═══════════════════════════════════════════════════════════════════
pause
"@
    }
    else {
        $statusBat = @"
@echo off
echo Checking ACMP Connector API status...
echo.
tasklist /FI "IMAGENAME eq $ExeName" 2>nul | find /I "$ExeName" >nul
if %errorlevel%==0 (
    echo Status: RUNNING
    echo.
    echo Checking health endpoint...
    curl -s $HealthEndpoint 2>nul
    echo.
) else (
    echo Status: NOT RUNNING
)
echo.
pause
"@
    }
    Set-Content -Path (Join-Path $InstallDir "status.bat") -Value $statusBat -Encoding ASCII

    # uninstall.bat
    if ($InstallProxy) {
        $uninstallBat = @"
@echo off
echo Uninstalling ACMP Connector...
echo.

:: Stop the processes
taskkill /F /IM $ExeName 2>nul
taskkill /F /IM $CaddyExeName 2>nul

:: Remove from startup
del "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\ACMPConnector.lnk" 2>nul

:: Ask before removing files
echo.
set /p confirm="Remove all files including configuration? (y/N): "
if /i "%confirm%"=="y" (
    cd /d "%USERPROFILE%"
    rmdir /s /q "%LOCALAPPDATA%\$AppName"
    echo Uninstall complete!
) else (
    echo Files kept at: %LOCALAPPDATA%\$AppName
)
echo.
pause
"@
    }
    else {
        $uninstallBat = @"
@echo off
echo Uninstalling ACMP Connector API...
echo.

:: Stop the process
taskkill /F /IM $ExeName 2>nul

:: Remove from startup
del "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\ACMPConnector.lnk" 2>nul

:: Ask before removing files
echo.
set /p confirm="Remove all files including configuration? (y/N): "
if /i "%confirm%"=="y" (
    cd /d "%USERPROFILE%"
    rmdir /s /q "%LOCALAPPDATA%\$AppName"
    echo Uninstall complete!
) else (
    echo Files kept at: %LOCALAPPDATA%\$AppName
)
echo.
pause
"@
    }
    Set-Content -Path (Join-Path $InstallDir "uninstall.bat") -Value $uninstallBat -Encoding ASCII

    Write-Success "Helper scripts created!"

    # Step 8: Set up auto-start (via shortcut in Startup folder)
    if (-not $SkipAutoStart) {
        Write-Step "Setting up auto-start on Windows login..."
        
        $shortcutPath = Join-Path $StartupDir "ACMPConnector.lnk"
        $targetPath = Join-Path $InstallDir "start.bat"
        
        $shell = New-Object -ComObject WScript.Shell
        $shortcut = $shell.CreateShortcut($shortcutPath)
        $shortcut.TargetPath = $targetPath
        $shortcut.WorkingDirectory = $InstallDir
        $shortcut.WindowStyle = 7  # Minimized
        $shortcut.Description = "ACMP Connector API Auto-Start"
        $shortcut.Save()
        
        Write-Success "Auto-start configured!"
    }

    # Step 9: Create Start Menu shortcuts
    Write-Step "Creating Start Menu shortcuts..."
    
    $startMenuDir = Join-Path ([Environment]::GetFolderPath("StartMenu")) "Programs\ACMP Connector"
    if (-not (Test-Path $startMenuDir)) {
        New-Item -ItemType Directory -Path $startMenuDir -Force | Out-Null
    }
    
    $shell = New-Object -ComObject WScript.Shell
    
    # Start shortcut
    $shortcut = $shell.CreateShortcut((Join-Path $startMenuDir "Start ACMP Connector.lnk"))
    $shortcut.TargetPath = Join-Path $InstallDir "start.bat"
    $shortcut.WorkingDirectory = $InstallDir
    $shortcut.Save()
    
    # Stop shortcut
    $shortcut = $shell.CreateShortcut((Join-Path $startMenuDir "Stop ACMP Connector.lnk"))
    $shortcut.TargetPath = Join-Path $InstallDir "stop.bat"
    $shortcut.WorkingDirectory = $InstallDir
    $shortcut.Save()
    
    # Open folder shortcut
    $shortcut = $shell.CreateShortcut((Join-Path $startMenuDir "Open Installation Folder.lnk"))
    $shortcut.TargetPath = $InstallDir
    $shortcut.Save()
    
    Write-Success "Start Menu shortcuts created!"

    # Step 10: Open firewall ports if admin and proxy installed
    if ($InstallProxy -and (Test-Administrator)) {
        Write-Step "Configuring Windows Firewall..."
        try {
            # Allow port 80
            $rule80 = Get-NetFirewallRule -DisplayName "ACMP Connector HTTP" -ErrorAction SilentlyContinue
            if (-not $rule80) {
                New-NetFirewallRule -DisplayName "ACMP Connector HTTP" -Direction Inbound -Protocol TCP -LocalPort 80 -Action Allow | Out-Null
            }
            
            # Allow port 443 if using HTTPS
            if ($ProxyDomain -ne "localhost") {
                $rule443 = Get-NetFirewallRule -DisplayName "ACMP Connector HTTPS" -ErrorAction SilentlyContinue
                if (-not $rule443) {
                    New-NetFirewallRule -DisplayName "ACMP Connector HTTPS" -Direction Inbound -Protocol TCP -LocalPort 443 -Action Allow | Out-Null
                }
            }
            Write-Success "Firewall rules configured!"
        }
        catch {
            Write-Warning-Custom "Could not configure firewall: $_"
        }
    }

    # Step 11: Start the services
    Write-Step "Starting ACMP Connector..."
    
    $exePath = Join-Path $InstallDir $ExeName
    Start-Process -FilePath $exePath -WorkingDirectory $InstallDir -WindowStyle Hidden
    
    if ($InstallProxy) {
        Start-Sleep -Seconds 2
        $caddyPath = Join-Path $InstallDir $CaddyExeName
        Start-Process -FilePath $caddyPath -ArgumentList "run", "--config", "Caddyfile" -WorkingDirectory $InstallDir -WindowStyle Hidden
    }
    
    # Wait for startup
    Write-Host "   Waiting for services to start..." -ForegroundColor Gray
    Start-Sleep -Seconds 4

    # Step 12: Health check
    Write-Step "Performing health check..."
    
    $maxRetries = 5
    $retryCount = 0
    $healthy = $false
    
    while ($retryCount -lt $maxRetries -and -not $healthy) {
        try {
            $response = Invoke-WebRequest -Uri $HealthEndpoint -UseBasicParsing -TimeoutSec 5
            if ($response.StatusCode -eq 200) {
                $healthy = $true
            }
        }
        catch {
            $retryCount++
            if ($retryCount -lt $maxRetries) {
                Write-Host "   Retry $retryCount of $maxRetries..." -ForegroundColor Gray
                Start-Sleep -Seconds 2
            }
        }
    }

    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    
    if ($healthy) {
        Write-Success "Installation complete! Service is healthy."
    }
    else {
        Write-Host "[" -NoNewline
        Write-Host "!" -ForegroundColor Yellow -NoNewline
        Write-Host "] Installation complete, but health check failed."
        Write-Host "   Please check the configuration in: $envPath" -ForegroundColor Yellow
    }

    Write-Host ""
    Write-Host "Installation Directory: " -NoNewline
    Write-Host $InstallDir -ForegroundColor Yellow
    Write-Host ""
    
    if ($InstallProxy) {
        Write-Host "Endpoints:" -ForegroundColor Cyan
        Write-Host "  Internal API:  " -NoNewline
        Write-Host "http://localhost:$Port" -ForegroundColor Gray
        Write-Host "  Public URL:    " -NoNewline
        Write-Host $PublicUrl -ForegroundColor Green
        Write-Host "  Health check:  " -NoNewline
        Write-Host $HealthEndpoint -ForegroundColor Green
    }
    else {
        Write-Host "Health Endpoint: " -NoNewline
        Write-Host $HealthEndpoint -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "Quick Commands:" -ForegroundColor Cyan
    Write-Host "  Start:   " -NoNewline
    Write-Host "$InstallDir\start.bat" -ForegroundColor Gray
    Write-Host "  Stop:    " -NoNewline
    Write-Host "$InstallDir\stop.bat" -ForegroundColor Gray
    Write-Host "  Status:  " -NoNewline
    Write-Host "$InstallDir\status.bat" -ForegroundColor Gray
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""

    # Step 13: Open browser
    Write-Step "Opening browser to health endpoint..."
    Start-Process $HealthEndpoint

    Write-Host ""
    Write-Host "Press any key to exit..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}
catch {
    Write-Host ""
    Write-Error-Custom "Installation failed: $_"
    Write-Host ""
    Write-Host "Press any key to exit..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}
