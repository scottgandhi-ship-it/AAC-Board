# Launch Plan -- Implementation Notes

## Status: APPROVED -- execution begins 2026-03-23

## Created: 2026-03-20
## Expert reviews completed: 2026-03-20 (pre-schedule)
## Review findings: LaunchPlan_ReviewFindings.md

## Implementation Checklist

### Stream 1: Branding & Identity
- [ ] App names finalized (deferred to Week 6-7)
- [ ] Icons reviewed and approved
- [ ] App Store copy written (both apps)
- [ ] Screenshots created (both apps)

### Stream 2: Pricing Strategy
- [x] Pricing model decided -- paid upfront, no IAP
- [x] Price points set -- AAC Board $9.99, Guiding Steps $4.99

### Stream 3: Git Branching
- [x] Create develop branch
- [ ] Update Fastlane for Internal/External TestFlight groups
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
- [ ] Session export for SLP documentation (promoted from v1.1)
- [ ] Use child's name more throughout (promoted from v1.1)
- [ ] Therapist sharing features -- export reports, import boards (promoted from v1.1)
- [ ] Search finds core words and folders (promoted from v1.1)

### Stream 5C: Review Fixes -- Guiding Steps (v1.0)
- [x] Parental gate -- tap+hold, same solution as AAC Board (2026-03-21)
- [ ] Pre-load sample schedule, reward track at first boot
- [ ] Surface first 4 social story templates on Stories tab at first boot
- [ ] Auto-assign sentence types in quick-create story flow
- [ ] Rename "Start Schedule" to clarify (e.g., "Set Up a Schedule")
- [ ] Rename "track" to "chart" throughout reward system
- [ ] Reward creation contextual labels (Task -> "What is your child working on?")
- [ ] Add confirmation dialog to "Reset all to defaults"
- [ ] Guide users through pre-loaded sample on first use
- [ ] Schedule empty state clarification text
- [ ] Privacy statement visible in app
- [ ] Communication log / narrative summary (promoted from v1.1)
- [ ] Auto-read for social stories -- play all, page by page (promoted from v1.1)
- [ ] Reorder steps in active schedule without restarting (promoted from v1.1)

### Stream 5D: Cross-App (when naming decided)
- [ ] Cross-promote each other within apps
- [ ] Visual branding connecting both apps as family

### Stream 6: Activities Tutorialization
- [ ] AAC Board Activities tab tutorial
- [ ] Guiding Steps Schedule tab tutorial
- [ ] Guiding Steps Rewards tab tutorial
- [ ] Guiding Steps Stories tab tutorial

### Stream 7: Marketing Website
- [ ] Website built and deployed
- [ ] PayPal donate button integrated
- [ ] Privacy Policy page
- [ ] Terms of Service page

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
- [ ] Support email set up
- [ ] Firebase Crashlytics configured (COPPA-compliant)
- [ ] Data persistence safeguards (version flags, locked contract, migration framework)
- [ ] TestFlight beta program launched
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
