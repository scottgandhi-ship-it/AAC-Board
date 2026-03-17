#!/usr/bin/env bash
# Copies the pre-commit hook into .git/hooks/ and makes it executable
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

cp .scripts/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit

echo "Git pre-commit hook installed successfully."
echo "The hook will run validation checks when you commit changes to index.html."
