#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# Build NSIS Installer Script (macOS/Linux)
# Uses Docker with Wine to run NSIS
#
# ⚠️  WARNING: On Apple Silicon (M1/M2/M3), this is VERY SLOW due to x86 emulation.
#     For Apple Silicon, consider:
#     1. Use GitHub Actions (see .github/workflows/build-installer.yml)
#     2. Build on a Windows machine
#     3. Use a Windows VM
# ─────────────────────────────────────────────────────────────────────────────

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo "  ACMP Connector API - NSIS Installer Builder (macOS/Linux)"
echo "═══════════════════════════════════════════════════════════════════"
echo ""

# Detect Apple Silicon
if [[ "$(uname -m)" == "arm64" ]]; then
    echo "⚠️  WARNING: Running on Apple Silicon (ARM)"
    echo "   Building with x86 emulation is VERY SLOW (30+ minutes)."
    echo ""
    echo "   Recommended alternatives:"
    echo "   1. Use GitHub Actions: git push to trigger build"
    echo "   2. Build on a Windows machine"
    echo "   3. Copy .nsi file to Windows and run: makensis acmp-connector-installer.nsi"
    echo ""
    read -p "Continue anyway? (y/N): " confirm
    if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
        echo "Aborted."
        exit 0
    fi
    echo ""
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed!"
    echo ""
    echo "Please install Docker Desktop: https://www.docker.com/products/docker-desktop"
    echo ""
    exit 1
fi

echo "✓ Docker found"
echo ""

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running!"
    echo ""
    echo "Please start Docker Desktop and try again."
    echo ""
    exit 1
fi

echo "✓ Docker is running"
echo ""

# Check if NSIS Docker image exists, if not build it
if ! docker image inspect nsis-builder &> /dev/null; then
    echo "📦 Building NSIS Docker image (one-time setup)..."
    echo "   This may take 5-10 minutes (x86_64 emulation on ARM)..."
    echo ""
    
    cat > Dockerfile.nsis << 'EOF'
# Use x86_64 Ubuntu for Wine compatibility
FROM --platform=linux/amd64 ubuntu:22.04

# Avoid interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install Wine (minimal) and dependencies
RUN dpkg --add-architecture i386 && \
    apt-get update && \
    apt-get install -y --no-install-recommends \
    wine32 \
    wine64 \
    wget \
    unzip \
    ca-certificates \
    xvfb && \
    rm -rf /var/lib/apt/lists/*

# Set up Wine environment
ENV WINEPREFIX=/root/.wine
ENV WINEARCH=win32
ENV DISPLAY=:99

# Download and install NSIS
RUN mkdir -p /tmp/nsis && \
    cd /tmp/nsis && \
    wget -q https://sourceforge.net/projects/nsis/files/NSIS%203/3.09/nsis-3.09.zip/download -O nsis.zip && \
    unzip -q nsis.zip && \
    mv nsis-3.09 /opt/nsis && \
    rm -rf /tmp/nsis

# Set working directory
WORKDIR /workspace

# Default command
CMD ["/bin/bash"]
EOF

    docker build --platform linux/amd64 -f Dockerfile.nsis -t nsis-builder .
    rm -f Dockerfile.nsis
    
    echo ""
    echo "✓ NSIS Docker image built"
    echo ""
fi

# Build the installer
echo "🔨 Building installer..."
echo ""

# Mount the current directory and run makensis via Wine with virtual display
docker run --rm --platform linux/amd64 \
    -v "$SCRIPT_DIR:/workspace" \
    -w /workspace \
    nsis-builder \
    xvfb-run wine /opt/nsis/makensis.exe acmp-connector-installer.nsi

if [ $? -eq 0 ]; then
    echo ""
    echo "═══════════════════════════════════════════════════════════════════"
    echo "  ✓ Build successful!"
    echo "═══════════════════════════════════════════════════════════════════"
    echo ""
    echo "Installer created: acmp-connector-api-installer.exe"
    echo ""
    ls -lh acmp-connector-api-installer.exe 2>/dev/null || echo "Note: File should be in current directory"
    echo ""
else
    echo ""
    echo "═══════════════════════════════════════════════════════════════════"
    echo "  ❌ Build failed!"
    echo "═══════════════════════════════════════════════════════════════════"
    echo ""
    exit 1
fi

