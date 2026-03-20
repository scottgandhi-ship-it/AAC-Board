#!/usr/bin/env bash
# Verifies that all CSS/JS files on disk are listed in sw.js ASSETS
# and that all ASSETS entries point to files that exist.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

errors=0

# Extract the ASSETS array entries from sw.js (lines matching './' patterns)
sw_entries=$(grep -oE "'\./[^']+'" sw.js | tr -d "'" || true)

# --- Check 1: Files on disk that are missing from sw.js ---
echo "--- Checking for files missing from sw.js ASSETS ---"

for file in $(find css js -name '*.css' -o -name '*.js' 2>/dev/null); do
  if [ ! -f "$file" ]; then
    continue
  fi
  entry="./$file"
  if ! echo "$sw_entries" | grep -qF "$entry"; then
    echo "ERROR: $file exists on disk but is NOT in sw.js ASSETS"
    errors=1
  fi
done

# --- Check 2: ASSETS entries that point to missing files ---
echo "--- Checking for stale entries in sw.js ASSETS ---"

for entry in $sw_entries; do
  # Skip ./ (root) entry
  if [ "$entry" = "./" ]; then
    continue
  fi
  # Strip leading ./
  file="${entry#./}"
  if [ ! -f "$file" ]; then
    echo "ERROR: sw.js ASSETS references '$entry' but file does not exist"
    errors=1
  fi
done

echo ""
if [ "$errors" -ne 0 ]; then
  echo "FAIL: sw.js ASSETS out of sync with files on disk."
  exit 1
else
  echo "OK: sw.js ASSETS matches files on disk."
  exit 0
fi
