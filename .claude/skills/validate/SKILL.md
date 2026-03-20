---
name: validate
description: Run all pre-commit checks — console.log scan, JS syntax validation, HTML tag matching, and www/ios sync verification — without committing. Use when the user wants to check code health, before deploying, or mid-development.
argument-hint: [aacboard|guidingsteps|all]
---

# Validate

Run the full validation suite for the AAC Board project. This catches issues before they reach a commit or deploy.

## Steps

Run the following checks **sequentially** from the repo root (`/Users/scottlussier/AAC-Board`), reporting results for each. If an argument is provided, scope to that app; otherwise validate both.

### 1. Console.log scan
Run `bash .scripts/check-console-logs.sh` and report the result. If console.log statements are found, list each one with file and line number.

### 2. SW cache integrity check
Run `bash .scripts/check-sw-cache.sh` and report the result. If files are missing from sw.js ASSETS or stale entries are found, list each discrepancy.

### 3. JS syntax validation
Run `bash .scripts/check-html-syntax.sh` and report the result. If syntax errors are found, show the error details and affected line numbers.

### 4. Sync check
Run `bash .scripts/check-www-sync.sh` and report the result. If files are out of sync, list which pairs diverge.

### 5. Summary
Print a clear summary:
- If all checks pass: confirm all clear, safe to commit/deploy
- If any checks fail: list failures with suggested fixes (e.g., "Run `npm run sync` to fix sync issues", "Remove console.log on line X")

Do NOT auto-fix anything. Just report. The user decides what to act on.
