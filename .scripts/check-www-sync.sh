#!/usr/bin/env bash
# Warns if www/index.html is out of sync with root index.html
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

if [ ! -f "www/index.html" ]; then
  echo "OK: www/index.html does not exist, skipping sync check."
  exit 0
fi

if diff -q "index.html" "www/index.html" > /dev/null 2>&1; then
  echo "OK: www/index.html is in sync with index.html."
  exit 0
else
  echo "WARNING: www/index.html is out of sync with index.html!"
  echo ""
  echo "Differences:"
  diff --brief "index.html" "www/index.html" || true
  echo ""
  echo "Run 'npm run sync' or copy index.html to www/index.html to fix."
  exit 1
fi
