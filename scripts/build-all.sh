#!/bin/bash

# Beijing Food Menu Image Tools - Build All Platforms
set -e

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR/.."

# Read version from config.json
if command -v jq &> /dev/null; then
    VERSION=$(jq -r '.version' "$SCRIPT_DIR/config.json")
else
    VERSION="1.1.0"
fi

echo "🚀 Building all platforms for version $VERSION"
echo ""

# Build Chrome
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
"$SCRIPT_DIR/build.sh" chrome "$VERSION"
echo ""

# Build Edge
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
"$SCRIPT_DIR/build.sh" edge "$VERSION"
echo ""

echo "✨ All platforms built successfully!"
echo ""
echo "📦 Generated packages:"
ls -lh "$(dirname "$SCRIPT_DIR")/build"/*.zip
