#!/usr/bin/env bash
# Fails if console.log is found in index.html or guiding-steps/index.html
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

found=0

for file in index.html guiding-steps/index.html js/*.js; do
  if [ -f "$file" ]; then
    matches=$(grep -n 'console\.log' "$file" || true)
    if [ -n "$matches" ]; then
      echo "ERROR: console.log found in $file:"
      echo "$matches"
      found=1
    fi
  fi
done

if [ "$found" -eq 1 ]; then
  echo ""
  echo "Remove all console.log statements before committing."
  exit 1
fi

echo "OK: No console.log statements found."
exit 0
