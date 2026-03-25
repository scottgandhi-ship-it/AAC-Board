# Launch Plan -- Implementation Notes

## Status: APPROVED -- execution begins 2026-03-23

## Created: 2026-03-20
## Expert reviews completed: 2026-03-20 (pre-schedule)
## Review findings: LaunchPlan_ReviewFindings.md

## Implementation Checklist

### Stream 1: Branding & Identity
- [x] App names finalized -- Yappie (AAC) + Guiding Steps
- [ ] Icons reviewed and approved
- [ ] App Store copy written (both apps)
- [ ] Screenshots created (both apps)

### Stream 2: Pricing Strategy
- [x] Pricing model decided -- paid upfront, no IAP
- [x] Price points set -- AAC Board $9.99, Guiding Steps $4.99

### Stream 3: Git Branching
- [x] Create develop branch
- [x] Fastlane TestFlight pipeline automated (external group distribution)
- [ ] Push develop to remote

### Stream 4: Quality Assurance
- [ ] Create hands-on device testing plan for Scott (iPhone + iPad)
- [ ] Full QA pass -- AAC Board
- [ ] Full QA pass -- Guiding Steps
- [ ] Accessibility audit -- Tony (both apps)

### Stream 5: Expert Reviews
- [x] Marci review -- both apps (completed 2026-03-20)
- [x] Reggie review -- both apps (completed 2026-03-20)
- [x] Scott decisions on all findings (completed 2026-03-20)

### Stream 5B: Review Fixes -- AAC Board (v1.0)
- [x] Parental gate -- tap+hold, obvious to parents (Apple Kids requirement) (2026-03-21)
- [x] Default grid 3x3 if onboarding skipped (2026-03-20)
- [x] Add stop/yes/no to core word strip for 3x3+ grids (2026-03-20)
- [x] Removed duplicates from 4x4 and 6x6 grids (2026-03-20)
- [x] Fix Fitzgerald Key color consistency -- stop, all done, no all red (2026-03-20)
- [x] Rephrase auto-speak setting in plain language (2026-03-20)
- [x] Parent mode auto-lock 30min -> 5min (2026-03-20)
- [x] Safeguard grid-size switching (auto-backup before switch, reversible) (2026-03-21)
- [x] Grammar Assistance plain language ("articles" -> "add 'a' and 'the'") (2026-03-20)
- [x] Car Ride activity sensory vocabulary (too fast, too loud, too bright, scary) (2026-03-20)
- [x] Spanish accent marks -- 30+ words fixed across i18n.js + vocabulary.js (2026-03-20)
- [x] Toileting vocabulary (wet, wipe, pull up added to My Body) (2026-03-20)
- [x] Privacy statement visible in app (2026-03-20)
- [x] Session export for SLP documentation (2026-03-21) -- combined with #26 as SLP Progress Report
- [ ] Use child's name more throughout (deferred to v1.1)
- [x] Therapist sharing features -- board/folder export already exists; SLP report added (2026-03-21)
- [x] Search finds core words and folders (2026-03-21)

### Stream 5C: Review Fixes -- Guiding Steps (v1.0)
- [x] Parental gate -- tap+hold, same solution as AAC Board (2026-03-21)
- [x] Pre-load sample schedule, reward track at first boot (2026-03-21)
- [x] Surface story templates on Stories tab at first boot + Create Story card (2026-03-21)
- [x] Auto-assign sentence types in story editor (2026-03-21)
- [x] Rename "Start Schedule" to "Set Up a Schedule" (2026-03-21)
- [x] Rename "track" to "chart" throughout reward system (2026-03-21)
- [x] Reward creation contextual labels (2026-03-21)
- [x] Add confirmation dialog to "Reset all to defaults" (already existed, verified 2026-03-21)
- [ ] Guide users through pre-loaded sample on first use (PRIORITY)
- [x] Schedule empty state clarification text (2026-03-21)
- [x] Privacy statement visible in app (2026-03-21)
- [ ] Communication log / narrative summary
- [ ] Auto-read for social stories -- play all, page by page
- [ ] Reorder steps in active schedule without restarting

### Stream 5D: Cross-App (when naming decided)
- [ ] Cross-promote each other within apps
- [ ] Visual branding connecting both apps as family

### Stream 6: Activities Tutorialization
- [ ] AAC Board Activities tab tutorial
- [ ] Guiding Steps Schedule tab tutorial
- [ ] Guiding Steps Rewards tab tutorial
- [ ] Guiding Steps Stories tab tutorial

### Stream 7: Marketing Website
- [x] Website built and deployed (yappieapp.com)
- [ ] PayPal donate button integrated (placeholder in footer)
- [ ] Privacy Policy page (link exists, page needed)
- [ ] Terms of Service page (link exists, page needed)

### Stream 8: Marketing Plan
- [ ] Social media content (existing accounts: IG, FB, Twitter)
- [ ] Launch content prepared
- [ ] Beta tester outreach (10 personal + recruitment)
- [ ] Influencer/blogger outreach list

### Stream 9: SEO & ASO
- [ ] Keyword research complete
- [ ] App Store listing optimized
- [ ] Website SEO implemented

### Stream 10: Legal & Compliance
- [ ] Privacy Policy written
- [ ] Terms of Service written
- [ ] COPPA compliance verified
- [x] Kids category -- YES, listing in Kids category

### Stream 11: Pre-Launch Infrastructure
- [x] Support email set up (support@yappieapp.com)
- [ ] Firebase Crashlytics configured (COPPA-compliant)
- [ ] Data persistence safeguards (version flags, locked contract, migration framework)
- [x] TestFlight beta program launched (both apps, external links live on website)
- [x] Steve pre-commit hook configured

### Stream 12: Launch
- [ ] Final QA pass
- [ ] App Store submission
- [ ] Launch day execution

### Agent Setup
- [x] Define Summer, Sean, Lo, Hunter personas in CLAUDE.md
- [x] Define Steve expanded persona and authority in CLAUDE.md
- [x] Configure Steve pre-commit hook in settings.json
- [x] Update cross-persona rules and phase workflow

## Pre-Schedule Completed (2026-03-20)
- develop branch created
- CLAUDE.md strategic decisions updated
- Agent personas defined (Summer, Sean, Lo, Hunter, Steve expanded)
- Steve pre-commit hook configured
- Marci + Reggie reviews completed and triaged
- All review decisions documented in LaunchPlan_ReviewFindings.md

## Issues and Resolutions
(none yet)

## Deviations from Plan
- Expert reviews (Stream 5) completed pre-schedule on 2026-03-20, ahead of Week 1 timeline
- Several v1.1 items promoted to v1.0 based on review findings (session export, child name personalization, therapist sharing, search improvements, communication log, auto-read stories, schedule step reorder)
