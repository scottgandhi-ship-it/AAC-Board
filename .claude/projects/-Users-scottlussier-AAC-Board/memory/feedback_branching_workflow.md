---
name: Branching workflow rules
description: Always develop in develop first, then push to master. Fastlane lanes need updating for Internal vs External TestFlight groups.
type: feedback
---

Always develop in `develop` first, then merge to `master` for releases. Never commit directly to `master`.

**Why:** Launch plan uses TestFlight groups -- Internal Testing builds from `develop`, External Testing and App Store builds from `master`. Keeping `master` clean ensures beta testers and App Store never see half-baked work.

**How to apply:**
- All code changes (QA fixes, tutorials, features) happen on `feature/*` branches off `develop`
- Merge features back to `develop` for Internal Testing
- Only merge `develop` -> `master` when ready for a release build
- Tag releases on `master` (`v1.0.0`, etc.)
- Fastlane needs separate lanes for develop (Internal) vs master (External) -- set up in Week 2
- Currently still on `master` for pre-launch prep. Branch strategy kicks in when code changes begin.
- Workflow:
  - `git checkout develop` -> `git checkout -b feature/x` -> work -> merge back to `develop`
  - When release-ready: `git checkout master` -> `git merge develop` -> `git tag v1.0.0`
