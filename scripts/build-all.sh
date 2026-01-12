#!/bin/bash

# Beijing Food Menu Image Tools - Build All Platforms
# Usage: ./build-all.sh [version]

VERSION=${1:-"2.0.0"}

echo "🚀 Building all platforms for version $VERSION"
echo ""

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

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
