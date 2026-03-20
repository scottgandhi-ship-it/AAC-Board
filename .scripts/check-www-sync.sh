#!/usr/bin/env bash
# Checks that www/ and ios/App/App/public/ stay in sync with root files
# Covers both AAC-Board (repo root) and guiding-steps/ sub-app
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

ERRORS=0

check_sync() {
  local source="$1"
  local target="$2"
  local label="$3"

  if [ ! -f "$target" ]; then
    echo "SKIP: $target does not exist."
    return
  fi

  if diff -q "$source" "$target" > /dev/null 2>&1; then
    echo "OK: $label in sync."
  else
    echo "OUT OF SYNC: $label"
    echo "  source: $source"
    echo "  target: $target"
    ERRORS=$((ERRORS + 1))
  fi
}

echo "=== AAC-Board sync check ==="
check_sync "index.html" "www/index.html" "www/index.html vs root"
check_sync "manifest.json" "www/manifest.json" "www/manifest.json vs root"
check_sync "sw.js" "www/sw.js" "www/sw.js vs root"
check_sync "index.html" "ios/App/App/public/index.html" "ios public/index.html vs root"
check_sync "manifest.json" "ios/App/App/public/manifest.json" "ios public/manifest.json vs root"

echo ""
echo "=== AAC-Board CSS sync check ==="
for cssfile in css/*.css; do
  if [ -f "$cssfile" ]; then
    check_sync "$cssfile" "www/$cssfile" "www/$cssfile vs root"
  fi
done

echo ""
echo "=== AAC-Board JS sync check ==="
for jsfile in js/*.js; do
  if [ -f "$jsfile" ]; then
    check_sync "$jsfile" "www/$jsfile" "www/$jsfile vs root"
  fi
done

echo ""
echo "=== Guiding Steps sync check ==="
check_sync "guiding-steps/index.html" "guiding-steps/www/index.html" "guiding-steps www/index.html vs root"
check_sync "guiding-steps/manifest.json" "guiding-steps/www/manifest.json" "guiding-steps www/manifest.json vs root"
check_sync "guiding-steps/index.html" "guiding-steps/ios/App/App/public/index.html" "guiding-steps ios public/index.html vs root"
check_sync "guiding-steps/manifest.json" "guiding-steps/ios/App/App/public/manifest.json" "guiding-steps ios public/manifest.json vs root"

echo ""
if [ "$ERRORS" -gt 0 ]; then
  echo "FAIL: $ERRORS file(s) out of sync. Run '.scripts/sync-all.sh' to fix."
  exit 1
else
  echo "ALL CHECKS PASSED."
  exit 0
fi
