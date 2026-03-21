---
name: deploy
description: Deploy AAC Board and/or Guiding Steps to TestFlight. Runs full validation first, syncs files, then kicks off Fastlane. Use when the user wants to push a build to TestFlight.
argument-hint: [aacboard|guidingsteps|both]
---

# Deploy to TestFlight

Deploy one or both apps to TestFlight via Fastlane. Runs pre-flight validation to catch issues before building.

## Arguments

- `aacboard` — deploy AAC Board only
- `guidingsteps` — deploy Guiding Steps only
- `both` or no argument — deploy both apps

## Steps

### 1. Pre-flight validation
Run all three validation checks (console.log, JS syntax, sync). Use the same checks as the `/validate` skill:

```
bash .scripts/check-console-logs.sh
bash .scripts/check-html-syntax.sh
bash .scripts/check-www-sync.sh
```

If **any check fails**, stop and report the failures. Do NOT proceed to deploy. Suggest fixes and ask the user if they want to fix and retry.

### 2. Sync
If sync check passed but the user hasn't synced recently, run `npm run sync` from the repo root to ensure www/ and ios/ are current. For Guiding Steps, also run sync from the guiding-steps/ directory.

### 3. Deploy
Run the appropriate deploy command from the repo root (`/Users/scottlussier/AAC-Board`):

- **aacboard**: `npm run deploy:aacboard`
- **guidingsteps**: `npm run deploy:guidingsteps`
- **both**: `npm run deploy:all`

These commands handle Ruby PATH setup and call Fastlane, which auto-increments the build number, archives, and uploads to TestFlight.

### 4. Post-deploy
Report the result:
- On success: confirm which app(s) were uploaded and note that TestFlight processing takes a few minutes before the build appears
- On failure: show the Fastlane error output and suggest next steps

## Important notes
- Requires macOS with Xcode installed
- Requires App Store Connect API key at `.keys/AuthKey.p8`
- Requires Ruby and Fastlane (`bundle install` if missing)
- Builds are local — no CI/CD involved
