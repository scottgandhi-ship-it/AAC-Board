# iOS App Conversion -- Notes

## Current Status
PLANNING -- plan updated with Steve/Robert review feedback, awaiting developer approval

## Review Feedback Incorporated
- [x] Steve: webDir changed from "." to "www/" with sync script (prevents bundle bloat)
- [x] Steve: .gitignore update moved to A0 (first task, before any npm work)
- [x] Steve: Service worker handling moved into Phase A/B (was separate Phase C)
- [x] Steve: SW detection uses isNativePlatform() + unregister pattern (not just skip)
- [x] Steve: Apple Developer provisioning added as explicit tasks (A6, B6)
- [x] Steve: Viewport/safe-area CSS audit added as explicit tasks (A2, B2)
- [x] Steve: ARASAAC network testing added to Phase C3
- [x] Robert: Capacitor confirmed as correct framework choice
- [x] Robert: Data migration gap documented with export/import as mitigation
- [x] Robert: PrivacyInfo.xcprivacy promoted to mandatory task in A5/B5
- [x] Robert: TTS risk elevated with dedicated testing phase (C2)
- [x] Robert: Native haptics added (A7, B7) to reduce App Store rejection risk
- [x] Robert: Storage eviction risk documented in architecture decisions
- [x] Robert: guiding-steps/sw.js confirmed to exist (Robert's subagent false alarm)

## Dev Tooling Status
- [x] Homebrew installed
- [x] Node.js v25.8.1 installed
- [x] npm 11.11.0 installed
- [x] CocoaPods 1.16.2 installed
- [x] Xcode license accepted
- [ ] Apple Developer account confirmed

## Implementation Checklist

### Phase A: Repo Prep and AAC Board Capacitor Setup
- [ ] A0: Update .gitignore (FIRST)
- [ ] A1: Service worker detection in AAC Board index.html
- [ ] A2: Viewport and safe area CSS audit
- [ ] A3: Initialize npm and Capacitor (pin version, webDir: "www")
- [ ] A4: Add iOS platform, sync, verify www/ contents
- [ ] A5: Configure iOS project + PrivacyInfo.xcprivacy (mandatory)
- [ ] A6: Apple Developer provisioning (App ID, profiles, signing)
- [ ] A7: Native haptic feedback (@capacitor/haptics)
- [ ] A8: App icons (generate from SVG, all sizes)
- [ ] A9: Splash screen (purple theme)

### Phase B: Guiding Steps Capacitor Setup
- [ ] B1: Service worker detection in Guiding Steps index.html
- [ ] B2: Viewport and safe area CSS audit
- [ ] B3: Initialize npm and Capacitor
- [ ] B4: Add iOS platform, sync, verify
- [ ] B5: Configure iOS project + PrivacyInfo.xcprivacy
- [ ] B6: Apple Developer provisioning
- [ ] B7: Native haptic feedback
- [ ] B8: App icons
- [ ] B9: Splash screen

### Phase C: Build and Test
- [ ] C1: Simulator testing (iPhone + iPad, both apps)
- [ ] C2: TTS deep testing (cold launch, voices, Spanish, iOS 16/17)
- [ ] C3: ARASAAC network testing (CORS, IndexedDB caching without SW)
- [ ] C4: Physical device testing
- [ ] C5: Pre-submission checklist

## Issues and Resolutions
(none yet)

## Validation Progress
(pending implementation)
