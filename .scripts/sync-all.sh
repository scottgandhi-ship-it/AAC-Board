#!/usr/bin/env bash
# Syncs root files -> www/ -> ios/App/App/public/ for both AAC-Board and Guiding Steps
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

echo "=== Syncing AAC-Board ==="
npm run sync
echo ""

echo "=== Syncing Guiding Steps ==="
cd guiding-steps
npm run sync
cd ..
echo ""

echo "=== Verifying sync ==="
bash .scripts/check-www-sync.sh
