# ACMP Connector API - Local Installation

## Quick Install

### Option 1: API Only (No Admin Required)
1. **Copy the executable** (`acmp-connector-api.exe`) to this folder
2. **Double-click** `Install-ACMPConnector.bat`
3. Follow the prompts

API will be available at: `http://localhost:3000`

### Option 2: API + Reverse Proxy (Requires Admin)
1. **Copy the executable** (`acmp-connector-api.exe`) to this folder
2. **Right-click** `Install-ACMPConnector-WithProxy.bat` → **Run as administrator**
3. Follow the prompts (default path prefix: `/acmp-connector`)

API will be available at: `http://localhost/acmp-connector` (port 80)

## Installation Modes

| Mode | Port | Path Prefix | Admin Required | Use Case |
|------|------|------------|----------------|----------|
| API Only | 3000 | N/A | No | Internal testing, development |
| API + Caddy Proxy | 80/443 | `/acmp-connector` (default) | Yes | Production, shared servers |
| API + Caddy Proxy | 80/443 | `/` (root) | Yes | Dedicated server, no conflicts |

## What the installer does

1. ✅ Creates installation directory at `%LOCALAPPDATA%\ACMPConnector`
2. ✅ Copies the executable
3. ✅ Creates `.env` configuration file
4. ✅ Creates helper scripts (start, stop, restart, status)
5. ✅ Sets up auto-start on Windows login
6. ✅ Creates Start Menu shortcuts
7. ✅ **[With Proxy]** Downloads and configures Caddy reverse proxy
8. ✅ **[With Proxy]** Configures Windows Firewall rules
9. ✅ Starts the service(s)
10. ✅ Opens browser to health check endpoint

## Installation Options

### Basic Install (GUI)
```batch
:: API only (port 3000)
Double-click Install-ACMPConnector.bat

:: API + Proxy (port 80) - requires admin
Right-click Install-ACMPConnector-WithProxy.bat → Run as administrator
```

### Command Line Install
```powershell
# API only
powershell -ExecutionPolicy Bypass -File install.ps1

# API + Proxy with path prefix (recommended for shared servers)
powershell -ExecutionPolicy Bypass -File install.ps1 -InstallProxy -ProxyDomain "localhost" -ProxyPath "/acmp-connector"

# API + Proxy at root path (dedicated server)
powershell -ExecutionPolicy Bypass -File install.ps1 -InstallProxy -ProxyDomain "localhost" -ProxyPath ""

# API + Proxy with custom internal domain (HTTP)
powershell -ExecutionPolicy Bypass -File install.ps1 -InstallProxy -ProxyDomain "acmp.mycompany.local" -ProxyPath "/acmp-connector"

# API + Proxy with public domain (HTTPS with Let's Encrypt)
powershell -ExecutionPolicy Bypass -File install.ps1 -InstallProxy -ProxyDomain "acmp.example.com" -ProxyPath "/acmp-connector"
```

### All Parameters
```powershell
powershell -ExecutionPolicy Bypass -File install.ps1 `
    -Port 3000 `           # Internal API port (default: 3000)
    -ApiKey "my-key" `     # API authentication key
    -InstallProxy `        # Install Caddy reverse proxy
    -ProxyDomain "localhost" ` # Domain for proxy (localhost = HTTP, domain = HTTPS)
    -ProxyPath "/acmp-connector" ` # Path prefix for routing (default: /acmp-connector)
    -SkipAutoStart `       # Don't start on Windows login
    -Silent                # No interactive prompts
```

## Proxy Domain Options

| Domain | Protocol | Certificate | Use Case |
|--------|----------|-------------|----------|
| `localhost` | HTTP | None | Internal/local access |
| `acmp.internal` | HTTP | None | Internal network with custom domain |
| `acmp.example.com` | HTTPS | Auto (Let's Encrypt) | Public-facing with valid domain |

> **Note**: For HTTPS with Let's Encrypt, the domain must be publicly accessible and DNS must be configured.

## Path Prefix Routing

When installing with Caddy proxy, you can specify a path prefix to avoid conflicts with other services on port 80.

### Examples

| Path Prefix | URL Pattern | Use Case |
|-------------|-------------|----------|
| `/acmp-connector` (default) | `http://server/acmp-connector/*` | **Recommended** - Shared servers with IIS/Apache |
| `/` (empty) | `http://server/*` | Dedicated server, no other services |

### How It Works

With path prefix `/acmp-connector`:
- Request: `http://server/acmp-connector/api/clients`
- Caddy strips prefix: `/api/clients`
- Forwards to: `localhost:3000/api/clients`

**Benefits:**
- ✅ Doesn't interfere with IIS, Apache, or other services
- ✅ Multiple APIs can share port 80 with different prefixes
- ✅ Clean separation: `/acmp-connector`, `/other-app`, etc.

## Post-Installation

### Configuration
Edit the configuration file at:
```
%LOCALAPPDATA%\ACMPConnector\.env
```

Required settings:
- `API_KEY` - Your API key for authentication
- `MSSQL_SERVER` - ACMP database server
- `MSSQL_DATABASE` - Database name (usually "ACMP")
- `MSSQL_USER` - Database username
- `MSSQL_PASSWORD` - Database password

### Managing the Service

After installation, use these commands:

| Action  | Location |
|---------|----------|
| Start   | `%LOCALAPPDATA%\ACMPConnector\start.bat` |
| Stop    | `%LOCALAPPDATA%\ACMPConnector\stop.bat` |
| Restart | `%LOCALAPPDATA%\ACMPConnector\restart.bat` |
| Status  | `%LOCALAPPDATA%\ACMPConnector\status.bat` |

Or use Start Menu: **ACMP Connector** → Start/Stop

### Logs
Logs are written to:
```
%LOCALAPPDATA%\ACMPConnector\api.log      # API logs
%LOCALAPPDATA%\ACMPConnector\caddy.log    # Proxy logs (if installed)
%LOCALAPPDATA%\ACMPConnector\caddy-access.log  # Access logs (if proxy installed)
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Request                          │
│         http://server/acmp-connector/api/clients            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Caddy Reverse Proxy                       │
│                    (Port 80 / 443)                          │
│                                                             │
│  • Path prefix routing (/acmp-connector/*)                 │
│  • Strips prefix before forwarding                          │
│  • SSL termination (if HTTPS)                               │
│  • Request forwarding                                       │
│  • Access logging                                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ (strips /acmp-connector prefix)
┌─────────────────────────────────────────────────────────────┐
│                  ACMP Connector API                         │
│                     (Port 3000)                             │
│                                                             │
│  • Receives: /api/clients                                  │
│  • API key authentication                                   │
│  • Business logic                                           │
│  • Database queries                                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    ACMP Database                            │
│                      (MSSQL)                                │
└─────────────────────────────────────────────────────────────┘
```

## Uninstall

Run the uninstaller:
```
%LOCALAPPDATA%\ACMPConnector\uninstall.bat
```

Or double-click `Uninstall-ACMPConnector.bat` in this folder.

## Troubleshooting

### Service won't start
1. Check the log file: `%LOCALAPPDATA%\ACMPConnector\api.log`
2. Verify `.env` configuration is correct
3. Run `start-visible.bat` to see error messages

### Health check fails
1. Ensure the service is running: `status.bat`
2. Check if port is in use: `netstat -an | findstr :3000`
3. Verify firewall allows the port

### Port 80 already in use
1. Check what's using port 80: `netstat -ano | findstr :80`
2. Common culprits: IIS, Apache, Skype
3. Stop conflicting service or use a different port

### Caddy won't start
1. Check Caddy log: `%LOCALAPPDATA%\ACMPConnector\caddy.log`
2. Verify Caddyfile syntax: `caddy validate --config Caddyfile`
3. Ensure port 80 is available

### Database connection issues
1. Verify MSSQL settings in `.env`
2. Ensure SQL Server is accessible from this machine
3. Check SQL Server authentication mode

### HTTPS certificate issues
1. Ensure domain points to this server (DNS)
2. Port 80 and 443 must be accessible from internet
3. Check Caddy logs for certificate errors

## Requirements

- Windows 10/11 or Windows Server 2016+
- PowerShell 5.1+
- Network access to ACMP MSSQL database
- **[For Proxy]** Administrator rights
- **[For Proxy]** Ports 80/443 available
- **[For HTTPS]** Valid domain with DNS pointing to server

## Files

```
local-installation/
├── Install-ACMPConnector.bat          # Basic installer (no admin)
├── Install-ACMPConnector-WithProxy.bat # Installer with proxy (admin)
├── Uninstall-ACMPConnector.bat        # Uninstaller
├── install.ps1                        # PowerShell installer script
├── README.md                          # This file
└── acmp-connector-api.exe             # (You must add this)
```
