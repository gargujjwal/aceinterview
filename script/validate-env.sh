#!/bin/bash

echo "🔍 Validating environment..."

# Check if bun is installed
if command -v bun &>/dev/null; then
  echo "✅ Bun is installed."
  BUN_VERSION=$(bun --version)
  echo "   Version: $BUN_VERSION"
else
  echo "❌ Bun is not installed or not in PATH."
  echo "   Please install Bun from https://bun.sh and add it to your PATH."
  exit 1
fi

# Check if conda is installed
if command -v conda &>/dev/null; then
  echo "✅ Conda is installed."
  CONDA_VERSION=$(conda --version)
  echo "   Version: $CONDA_VERSION"
else
  echo "❌ Conda is not installed or not in PATH."
  echo "   Please install Conda from https://docs.conda.io/en/latest/miniconda.html and add it to your PATH."
  exit 1
fi

echo "🎉 All required tools are installed! You can proceed with the build script."
