#!/usr/bin/env bash
# Validates JS syntax inside <script> tags and checks for unmatched tag pairs
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

errors=0

check_file() {
  local file="$1"
  if [ ! -f "$file" ]; then
    return
  fi

  echo "Checking $file..."

  # Check for unmatched <script>/<style> tags
  local script_open script_close style_open style_close
  script_open=$(grep -c '<script>' "$file" || true)
  script_close=$(grep -c '</script>' "$file" || true)
  style_open=$(grep -c '<style>' "$file" || true)
  style_close=$(grep -c '</style>' "$file" || true)

  if [ "$script_open" -ne "$script_close" ]; then
    echo "ERROR: Unmatched <script> tags in $file (open: $script_open, close: $script_close)"
    errors=1
  fi

  if [ "$style_open" -ne "$style_close" ]; then
    echo "ERROR: Unmatched <style> tags in $file (open: $style_open, close: $style_close)"
    errors=1
  fi

  # Extract JS from <script> tags and check syntax via Node.js
  node -e "
    const fs = require('fs');
    const html = fs.readFileSync('$file', 'utf8');
    const scriptRegex = /<script>([\s\S]*?)<\/script>/g;
    let match;
    let blockIndex = 0;
    let hasError = false;

    while ((match = scriptRegex.exec(html)) !== null) {
      blockIndex++;
      const js = match[1];
      if (!js.trim()) continue;

      // Find the line number where this script block starts
      const beforeScript = html.substring(0, match.index);
      const startLine = beforeScript.split('\n').length;

      try {
        new Function(js);
      } catch (e) {
        hasError = true;
        // Extract line number from error if available
        const errMatch = e.message.match(/\\(?(\\d+):(\\d+)\\)?/);
        const jsLines = js.split('\n');
        let errLine = errMatch ? parseInt(errMatch[1]) : null;

        console.log('ERROR: JS syntax error in $file, <script> block #' + blockIndex + ':');
        console.log('  ' + e.message);

        if (errLine !== null) {
          const fileLine = startLine + errLine - 1;
          console.log('  Near line ' + fileLine + ' in file');
          console.log('  Context:');
          const start = Math.max(0, errLine - 4);
          const end = Math.min(jsLines.length, errLine + 2);
          for (let i = start; i < end; i++) {
            const marker = (i === errLine - 1) ? '>>> ' : '    ';
            console.log('    ' + marker + (startLine + i) + ': ' + jsLines[i]);
          }
        }
      }
    }

    if (blockIndex === 0) {
      console.log('WARNING: No <script> blocks found in $file');
    }

    if (hasError) process.exit(1);
  " || errors=1
}

check_file "index.html"
check_file "guiding-steps/index.html"

if [ "$errors" -ne 0 ]; then
  exit 1
fi

echo "OK: All JS syntax checks passed."
exit 0
