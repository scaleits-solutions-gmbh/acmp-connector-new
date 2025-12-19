# ACMP Connector API - NSIS Installer

Simple NSIS installer for the ACMP Connector API.

## Prerequisites

### For Windows:

1. **NSIS** (Nullsoft Scriptable Install System)
   - Download from: https://nsis.sourceforge.io/Download
   - Install NSIS on your Windows machine
   - Add NSIS to PATH (or use full path to `makensis.exe`)

### For macOS/Linux:

1. **Docker Desktop**
   - Download from: https://www.docker.com/products/docker-desktop
   - Ensure Docker is running

**Note:** The installer downloads `acmp-connector-api.exe` during installation from the URL defined in the script.

## Building the Installer

### Windows

#### Option 1: Using NSIS GUI

1. Open NSIS (makensisw.exe)
2. File → Load Script
3. Select `acmp-connector-installer.nsi`
4. Compile → Compile NSIS Script

#### Option 2: Using Command Line

```batch
makensis acmp-connector-installer.nsi
```

#### Option 3: Using Build Script

```batch
build-installer.bat
```

### macOS/Linux

#### ⚠️ Apple Silicon (M1/M2/M3) Warning

Building on Apple Silicon requires x86 emulation and is **extremely slow** (30+ minutes).

**Recommended alternatives for Apple Silicon:**

1. **GitHub Actions** - Push to trigger automated build (see below)
2. **Windows machine** - Copy files and run `makensis` directly
3. **Windows VM** - Use Parallels, VMware, or UTM

#### Using Docker Build Script

```bash
./build-installer.sh
```

This works but is slow on ARM Macs due to x86 emulation.

#### Using GitHub Actions (Recommended)

```bash
# Push to trigger automated build
git push origin main

# Or manually trigger via GitHub Actions UI
# Go to Actions → Build NSIS Installer → Run workflow
```

The workflow at `.github/workflows/build-installer.yml` builds the installer on a Windows runner.

## Output

The installer will be created as:

```
acmp-connector-api-installer.exe
```

## Installation Features

- ✅ Installs executable to `%LOCALAPPDATA%\ACMPConnector`
- ✅ Creates `.env` configuration file
- ✅ Creates helper scripts (start.bat, stop.bat, status.bat)
- ✅ Optional Start Menu shortcuts
- ✅ Optional auto-start on Windows login
- ✅ Optional start service immediately
- ✅ Opens browser to health endpoint after installation
- ✅ Adds entry to Windows Add/Remove Programs

## Customization

### Change Download URL

Edit line ~23 in `acmp-connector-installer.nsi`:

```nsis
!define DOWNLOAD_URL "https://your-server.com/releases/v1.0.0/acmp-connector-api.exe"
```

**Current mock URL:** `https://example.com/releases/v1.0.0/acmp-connector-api.exe`

### Change Default Port

Edit line in `.nsi` file:

```nsis
StrCpy $Port "3000"  ; Change to your desired port
```

### Change Default API Key

Edit line in `.nsi` file:

```nsis
StrCpy $ApiKey "your-default-key"  ; Or leave empty to prompt user
```

## Testing

1. Build the installer
2. Run `acmp-connector-api-installer.exe` on a Windows machine
3. Follow the installation wizard
4. Verify installation at `%LOCALAPPDATA%\ACMPConnector`
5. Test the service: `http://localhost:3000/health`

## Uninstallation

Users can uninstall via:

- Windows Settings → Apps → ACMP Connector API → Uninstall
- Or run `%LOCALAPPDATA%\ACMPConnector\uninstall.exe`

## Troubleshooting

### macOS/Linux Build Issues

**Docker build fails:**

- Ensure Docker Desktop is running
- Check Docker has enough resources allocated (Settings → Resources)
- Try: `docker system prune` to free up space

**Wine errors during build:**

- The first Wine initialization may take time
- If Wine fails, try rebuilding the Docker image: `docker rmi nsis-builder && ./build-installer.sh`

**Build succeeds but installer doesn't work:**

- NSIS installers built with Wine may have compatibility issues
- For production, build on a Windows machine or use CI/CD

### Alternative: Build on Windows

If Wine builds are problematic, you can:

1. Copy the `.nsi` file to a Windows machine
2. Install NSIS on Windows
3. Run `makensis acmp-connector-installer.nsi`
