#!/bin/bash
set -e  # exit on first error

echo "🔹 Updating apt packages..."
sudo apt-get update

echo "🔹 Installing required system packages..."
sudo apt-get install -y python3 python3-pip python3-venv curl wget unzip git

# Docker CLI is available via Docker Desktop and socket mount; no Docker install here

# Check Docker CLI availability
if ! command -v docker &> /dev/null; then
  echo "⚠️ Docker not found in PATH, please check installation."
else
  echo "✅ Docker installed: $(docker --version)"
fi

# Create Python virtual environment in home directory to avoid mount issues
VENV_PATH="/home/vscode/.venv"
if [ ! -d "$VENV_PATH" ]; then
  echo "🔹 Creating Python virtual environment at $VENV_PATH..."
  python3 -m venv "$VENV_PATH"
else
  echo "✅ Python venv already exists at $VENV_PATH"
fi

echo "🔹 Upgrading pip..."
"$VENV_PATH/bin/pip" install --upgrade pip

# Install Python dependencies from requirements.txt if it exists, else fallback defaults
REQ_FILE="/workspaces/sih25/requirements.txt"
if [ -f "$REQ_FILE" ]; then
  echo "🔹 Installing Python packages from requirements.txt..."
  "$VENV_PATH/bin/pip" install -r "$REQ_FILE"
else
  echo "🔹 Installing default Python packages (uvicorn, qrcode, Pillow)..."
  "$VENV_PATH/bin/pip" install uvicorn qrcode Pillow
fi

# Install Hyperledger Fabric binaries and samples if not already installed
if [ ! -d fabric-samples ]; then
  echo "🔹 Installing Hyperledger Fabric binaries and samples..."
  curl -sSL https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh | bash
else
  echo "✅ Hyperledger Fabric already installed, skipping."
fi

echo "🎉 Setup complete! To use Python, run:"
echo "    source $VENV_PATH/bin/activate"
