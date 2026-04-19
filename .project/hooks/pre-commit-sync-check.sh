#!/usr/bin/env bash
# Pre-commit guard that blocks the commit if an app's source index.html
# was edited but the built artifacts in www/ and ios/App/App/public/ are
# stale. Catches the "ran npm run sync from the wrong directory" bug.
#
# Install locally (per clone):
#   ln -sf ../../.project/hooks/pre-commit-sync-check.sh .git/hooks/pre-commit
#   chmod +x .git/hooks/pre-commit

set -e

check_app() {
  local app_dir="$1"
  local source="$app_dir/index.html"
  local www="$app_dir/www/index.html"
  local ios="$app_dir/ios/App/App/public/index.html"

  # Only check if source is in this commit's staged changes
  if ! git diff --cached --name-only | grep -qE "^$source$"; then
    return 0
  fi

  [[ -f "$source" ]] || return 0
  [[ -f "$www" ]] || return 0

  if ! diff -q "$source" "$www" >/dev/null 2>&1; then
    echo "BLOCK: $source is modified but $www is stale." >&2
    echo "       cd $app_dir && npm run sync" >&2
    return 1
  fi

  if [[ -f "$ios" ]] && ! diff -q "$www" "$ios" >/dev/null 2>&1; then
    echo "BLOCK: $www and $ios are out of sync." >&2
    echo "       cd $app_dir && npm run sync" >&2
    return 1
  fi

  return 0
}

rc=0
for app in guiding-steps .; do
  check_app "$app" || rc=1
done

exit $rc
