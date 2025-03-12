#!/bin/bash

echo "🏗️  Starting build process..."

# Store the root directory
ROOT_DIR="$(pwd)"

# Function for error handling
handle_error() {
  echo "❌ Error: $1"
  exit 1
}

# Build interview-analysis-service
echo "🔧 Building interview-analysis-service..."
cd "$ROOT_DIR/src/interview-analysis-service" || handle_error "Could not navigate to interview-analysis-service directory"
if conda env create -f environment.yml; then
  echo "✅ Successfully created conda environment for interview-analysis-service"
else
  handle_error "Failed to create conda environment for interview-analysis-service"
fi

# Build posture-analysis-service
echo "🔧 Building posture-analysis-service..."
cd "$ROOT_DIR/src/posture-analysis-service" || handle_error "Could not navigate to posture-analysis-service directory"
if conda env create -f environment.yml; then
  echo "✅ Successfully created conda environment for posture-analysis-service"
else
  handle_error "Failed to create conda environment for posture-analysis-service"
fi

# Build client
echo "🔧 Building client..."
cd "$ROOT_DIR/src/client" || handle_error "Could not navigate to client directory"
if bun i; then
  echo "✅ Successfully installed client dependencies"
else
  handle_error "Failed to install client dependencies"
fi

if bun run build; then
  echo "✅ Successfully built client"
else
  handle_error "Failed to build client"
fi

echo "🎉 Build completed successfully! You can proceed with start script."
