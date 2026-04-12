#!/bin/bash
# Display current project version from my-portal/package.json
REPO_ROOT="$(git -C "$(dirname "$0")" rev-parse --show-toplevel 2>/dev/null || echo ".")"
PKGJSON="$REPO_ROOT/my-portal/package.json"

if [ ! -f "$PKGJSON" ]; then
  echo "Version: unknown (package.json not found)"
  exit 0
fi

VERSION=$(node -p "require('$PKGJSON').version" 2>/dev/null)
BRANCH=$(git -C "$REPO_ROOT" rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")

echo ""
echo "  AY3 Portal"
echo "  Version : v${VERSION}"
echo "  Branch  : ${BRANCH}"
echo ""
