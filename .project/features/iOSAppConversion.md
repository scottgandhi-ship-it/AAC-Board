# iOS App Conversion -- AAC Board & Guiding Steps

## Executive Summary

Convert both single-file PWAs (AAC Board and Guiding Steps) into native iOS apps using Capacitor, enabling App Store readiness. Both apps retain their existing web codebases -- Capacitor wraps them in a native iOS shell with access to native APIs for haptics, status bar control, and future in-app purchases. This plan delivers two buildable, testable Xcode projects. App Store submission (screenshots, descriptions, review process) is a follow-on phase.

## Requirements

1. Both apps must build and run on iOS 16+ via Xcode
2. Each app gets its own Capacitor project and Xcode workspace
3. Existing web code (index.html, manifest.json, sw.js) stays untouched except for service worker detection
4. Apps must work fully offline (assets are bundled in native app)
5. Native iOS app icons (1024x1024 + all required sizes)
6. Proper iOS status bar and safe area handling
7. Native haptic feedback on button taps for native feel
8. PrivacyInfo.xcprivacy manifest included (required for App Store)
9. Both apps submitted to App Store under the same developer account (future phase)

## Architecture Overview

**Current State:**
- AAC Board: index.html (10,498 lines) + manifest.json + sw.js
- Guiding Steps: guiding-steps/index.html (6,376 lines) + manifest.json + sw.js
- Both are single-file PWAs served via GitHub Pages
- localStorage and IndexedDB for persistence
- Network-first service worker caching

**Target State:**
- Each app has a Capacitor project with a dedicated www/ output directory
- Capacitor copies only web assets (index.html, manifest.json) into the native iOS app bundle
- WKWebView renders the app natively on iOS
- Native splash screens, app icons, and haptic feedback
- Status bar and safe area insets handled via Capacitor config + CSS env() variables
- Service worker disabled and unregistered inside Capacitor (native app bundle is already local)
- PrivacyInfo.xcprivacy declares API usage for App Store compliance

**Key Architecture Decisions:**

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Wrapper framework | Capacitor 7.x (pinned) | Best PWA-to-native bridge, maintained by Ionic, no rewrite needed |
| Project structure | Two separate Capacitor projects | Each app has its own bundle ID, icon, and App Store listing |
| Web asset delivery | Dedicated www/ directory per app | Prevents cap sync from copying node_modules, .project/, or sibling app files into the bundle |
| Service worker in iOS | Disabled + unregistered | Capacitor serves from local bundle; SW is unnecessary and causes caching conflicts |
| Storage | localStorage + IndexedDB (unchanged) | WKWebView supports both; data persists across app updates. NOTE: iOS can evict WKWebView data under extreme storage pressure |
| TTS | Web Speech API (unchanged) | iOS WKWebView supports speechSynthesis; requires user gesture for first utterance |
| Native feel | Capacitor Haptics plugin | Haptic feedback on button taps differentiates from web; reduces App Store rejection risk |
| Privacy | PrivacyInfo.xcprivacy | Mandatory for App Store; declares NSPrivacyAccessedAPICategoryUserDefaults (localStorage) |

## Repo Structure (Post-Conversion)

    AAC-Board/
      .gitignore              (UPDATED -- node_modules, ios, DerivedData, etc.)
      index.html              (existing -- AAC Board web app, SW detection added)
      manifest.json           (existing)
      sw.js                   (existing)
      package.json            (NEW -- Capacitor dependencies)
      capacitor.config.ts     (NEW -- webDir: "www")
      www/                    (NEW -- clean copy of web assets for cap sync)
        index.html
        manifest.json
      ios/                    (NEW -- Xcode project for AAC Board)
      guiding-steps/
        index.html            (existing -- Guiding Steps web app, SW detection added)
        manifest.json         (existing)
        sw.js                 (existing)
        package.json          (NEW -- Capacitor dependencies)
        capacitor.config.ts   (NEW -- webDir: "www")
        www/                  (NEW -- clean copy of web assets for cap sync)
          index.html
          manifest.json
        ios/                  (NEW -- Xcode project for Guiding Steps)

NOTE: The www/ directories are build artifacts populated by an npm sync script. They contain only the files needed for the iOS bundle. This prevents cap sync from copying node_modules, .project/, ROADMAP.md, or sibling directories.

## Data Migration -- Existing PWA Users

**Known limitation**: The Capacitor app runs on a different origin (capacitor://localhost) than the GitHub Pages web PWA. This means localStorage and IndexedDB data from the web version is NOT available in the native app. Users who install the iOS app start fresh.

**Mitigation**: The Export/Share Boards feature (already shipped, Milestone 4.4) allows users to export their board configuration as JSON. This serves as a manual migration path. The export includes vocabulary, grid layout, and customizations.

**Recommended messaging**: The App Store description and onboarding flow should mention that web PWA users can export their boards and import them into the native app.

**Future**: iCloud sync or cloud backup will provide automatic migration. This is scoped separately.

## Task Breakdown

### Phase A: Repo Prep and AAC Board Capacitor Setup

**A0. Update .gitignore (FIRST -- before any npm/Capacitor work)**
- Add to .gitignore:
  - node_modules/
  - ios/
  - www/
  - guiding-steps/node_modules/
  - guiding-steps/ios/
  - guiding-steps/www/
  - .DS_Store
  - DerivedData/
  - *.xcworkspace/xcuserdata/
  - *.xcodeproj/xcuserdata/
  - Pods/

**A1. Service Worker Detection in AAC Board index.html**
- Add Capacitor detection at the service worker registration point
- If Capacitor is detected: unregister any existing service workers, skip registration
- If not Capacitor: register service worker normally (existing behavior preserved)
- Detection pattern uses both window.Capacitor?.isNativePlatform() and capacitor:// URL scheme for reliability

Implementation pattern:

    if (window.Capacitor?.isNativePlatform()) {
      navigator.serviceWorker?.getRegistrations().then(regs =>
        regs.forEach(r => r.unregister())
      );
    } else if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js');
    }

**A2. Viewport and Safe Area CSS Audit**
- Verify index.html meta viewport tag includes viewport-fit=cover
- Audit CSS for safe area inset handling: add env(safe-area-inset-top), env(safe-area-inset-bottom) padding to relevant containers (app header, tab bar, fixed-position elements)
- Test that existing layout is not broken by safe area padding on standard (non-notched) devices

**A3. Initialize npm and Capacitor**
- Run npm init in AAC-Board root
- Install @capacitor/core and @capacitor/cli (pin exact version)
- Install @capacitor/ios
- Install @capacitor/haptics (native haptic feedback)
- Run npx cap init with appId "com.lussier.aacboard" and appName "AAC Board"
- Configure capacitor.config.ts: webDir set to "www" (NOT ".")
- Add npm sync script that copies index.html and manifest.json to www/

**A4. Add iOS Platform**
- Run npx cap add ios
- Run the sync script to populate www/, then npx cap sync
- Inspect ios/App/App/public/ to verify ONLY index.html and manifest.json were copied (no node_modules, no guiding-steps, no .project)
- Verify Xcode project opens: npx cap open ios

**A5. Configure iOS Project and Privacy Manifest**
- Set deployment target to iOS 16.0
- Set bundle identifier: com.lussier.aacboard
- Set display name: "AAC Board"
- Configure status bar style (light content on purple theme)
- Configure Xcode signing (automatic signing with development team)
- Create PrivacyInfo.xcprivacy with NSPrivacyAccessedAPICategoryUserDefaults declaration (required -- localStorage usage)
- Add any other required privacy declarations based on API usage audit

**A6. Apple Developer Provisioning**
- Register App ID com.lussier.aacboard in Apple Developer portal
- Create development provisioning profile
- Configure Xcode signing with the development team
- Verify device can be registered for testing (if physical device testing in this phase)

**A7. Native Haptic Feedback**
- Add Capacitor Haptics plugin initialization
- Add haptic feedback (light impact) on AAC button taps when running in Capacitor
- No-op when running in browser (graceful fallback)

**A8. App Icons**
- Generate 1024x1024 PNG app icon from existing SVG design (purple rounded rect with speech bubble)
- Generate all required iOS icon sizes (20, 29, 40, 60, 76, 83.5 @1x/2x/3x)
- Add to ios/App/App/Assets.xcassets/AppIcon.appiconset/

**A9. Splash Screen**
- Configure launch screen storyboard with purple background (#7C74FF) and white logo
- Match existing theme_color from manifest.json

**Acceptance Criteria (Phase A):**
- [ ] .gitignore updated before any npm artifacts created
- [ ] Service worker detection works: skips + unregisters in Capacitor, registers normally in browser
- [ ] www/ contains only index.html and manifest.json (verified after cap sync)
- [ ] Xcode project builds without errors
- [ ] App launches in iOS Simulator
- [ ] All AAC Board features work (grid, core words, predictions, TTS, folders)
- [ ] TTS works on first tap after cold launch (user gesture requirement met)
- [ ] Haptic feedback fires on button taps in Simulator/device
- [ ] Data persists after app restart (localStorage, IndexedDB)
- [ ] App icon displays correctly on home screen
- [ ] Status bar and safe areas render properly (including notched devices)
- [ ] viewport-fit=cover in meta tag, env(safe-area-inset-*) in CSS
- [ ] PrivacyInfo.xcprivacy present and declares UserDefaults usage
- [ ] Offline: app works with airplane mode (assets are bundled)
- [ ] ARASAAC symbol download works from WKWebView (no CORS issues)

### Phase B: Guiding Steps -- Capacitor Setup

**B1. Service Worker Detection in Guiding Steps index.html**
- Same Capacitor detection pattern as A1
- Unregister existing SWs in Capacitor, register normally in browser

**B2. Viewport and Safe Area CSS Audit**
- Same viewport-fit=cover and env(safe-area-inset-*) audit as A2
- Guiding Steps has different layout containers -- audit tab bar, schedule view, reward view

**B3. Initialize npm and Capacitor**
- Run npm init in guiding-steps/
- Install Capacitor packages (same pinned versions as AAC Board)
- Install @capacitor/haptics
- Run npx cap init with appId "com.lussier.guidingsteps" and appName "Guiding Steps"
- Configure capacitor.config.ts: webDir set to "www"
- Add npm sync script

**B4. Add iOS Platform**
- Run npx cap add ios
- Sync and verify ios/App/App/public/ contains only intended files
- Verify Xcode project opens

**B5. Configure iOS Project and Privacy Manifest**
- Same config as A5 but with bundle ID com.lussier.guidingsteps
- Display name: "Guiding Steps"
- PrivacyInfo.xcprivacy with same declarations

**B6. Apple Developer Provisioning**
- Register App ID com.lussier.guidingsteps
- Create development provisioning profile

**B7. Native Haptic Feedback**
- Same haptic integration as A7 for Guiding Steps interactions

**B8. App Icons**
- Generate 1024x1024 PNG from existing SVG (purple rounded rect with list/dots icon)
- Generate all required sizes
- Add to Assets.xcassets

**B9. Splash Screen**
- Same approach as AAC Board -- purple background with white logo

**Acceptance Criteria (Phase B):**
- [ ] Service worker detection works correctly
- [ ] www/ contains only intended files
- [ ] Xcode project builds without errors
- [ ] App launches in iOS Simulator
- [ ] Visual schedules, reward tracker, and social stories all function
- [ ] Haptic feedback on interactions
- [ ] Data persists after app restart
- [ ] App icon and splash screen display correctly
- [ ] PrivacyInfo.xcprivacy present
- [ ] Safe areas render correctly

### Phase C: Build and Test

**C1. Simulator Testing**
- Test AAC Board on iPhone 15 simulator (iOS 17)
- Test AAC Board on iPad simulator
- Test Guiding Steps on iPhone 15 simulator
- Test Guiding Steps on iPad simulator
- Verify all features in each app
- Test orientation changes (portrait + landscape)

**C2. TTS Deep Testing**
- Verify speech works on first tap after cold launch in both apps
- Verify voice list from speechSynthesis.getVoices() matches expectations
- Test Spanish TTS in AAC Board
- Test on iOS 16 simulator (minimum target) and iOS 17+
- Verify the "I" pronunciation fix (SPEAK_OVERRIDES) works in WKWebView

**C3. ARASAAC Network Testing**
- Trigger ARASAAC symbol downloads from within the Capacitor app
- Verify no CORS errors in WKWebView
- Verify IndexedDB caching of downloaded symbols works without service worker
- Test with airplane mode after initial download (symbols should load from IndexedDB)

**C4. Device Testing**
- Build and run both apps on physical iOS device
- Verify TTS works on real device
- Verify haptic feedback on real device
- Verify touch targets and gesture interactions
- Test offline behavior (airplane mode)

**C5. Pre-Submission Checklist**
- App icons at all required sizes
- Launch screen configured
- No crashes or console errors
- PrivacyInfo.xcprivacy present with correct declarations
- Provisioning profiles valid
- No console.log debug output in production builds

**Acceptance Criteria (Phase C):**
- [ ] Both apps run on simulator without issues (iPhone + iPad)
- [ ] Both apps run on physical device without issues
- [ ] TTS works on physical device, including first-tap-after-launch
- [ ] Spanish TTS works in AAC Board
- [ ] ARASAAC symbols download and cache correctly
- [ ] Haptic feedback works on physical device
- [ ] No crashes after 10 minutes of use per app
- [ ] Orientation changes handled gracefully
- [ ] PrivacyInfo.xcprivacy validated

## Integration Points

| System | Impact | Action Needed |
|--------|--------|---------------|
| localStorage | WKWebView supports it; different origin than web PWA | No code changes; document data silo for users |
| IndexedDB | WKWebView supports it; same origin caveat | No code changes; test transaction stability on device |
| Web Speech API (TTS) | Works in WKWebView but requires user gesture for first utterance | Test thoroughly; verify voice availability |
| ARASAAC API | Network requests from WKWebView; stricter CORS behavior possible | Test symbol downloads; verify IndexedDB caching without SW |
| Service worker | Must be disabled + unregistered inside Capacitor | Add detection in A1/B1 |
| manifest.json | Ignored by Capacitor (uses native config) | No changes |
| Haptics | New native capability | Add @capacitor/haptics plugin |
| Privacy | Apple requires PrivacyInfo.xcprivacy | Create in A5/B5 |

## Risks and Mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| WKWebView TTS requires user gesture | High | Verify all speech is triggered by tap events, not programmatic |
| WKWebView voice list differs from Safari | Medium | Test getVoices() output, add fallback voice selection |
| cap sync copies unintended files | High if webDir is wrong | Use www/ directory, verify after first sync |
| App Store rejection for "wrapped web app" | Medium | Add native haptics, proper icons/splash, privacy manifest |
| ARASAAC CORS in WKWebView | Low-Medium | Test in Phase C3; fallback to Capacitor HTTP plugin if needed |
| Existing PWA users lose data | Certain | Document limitation; existing export/import feature covers migration |
| iOS storage eviction under pressure | Low | Rare; affects apps not used recently; no mitigation needed now |
| IndexedDB transaction bugs in WKWebView | Low | Test on real devices in Phase C4 |

## Future Phases (Not in This Plan)

- In-app purchase ($9.99 one-time) via StoreKit / Capacitor Purchases plugin
- App Store submission (screenshots, descriptions, review process)
- Push notifications / local notifications for schedule reminders
- iCloud backup/restore for board data
- Android conversion (same Capacitor approach, separate plan)
- Capacitor bridge module extraction (capacitor-bridge.js) for cleaner plugin initialization

## Dependencies

- Node.js v25.8.1 -- INSTALLED
- npm 11.11.0 -- INSTALLED
- CocoaPods 1.16.2 -- INSTALLED
- Xcode -- INSTALLED
- Apple Developer account -- REQUIRED for device testing and App Store submission
- Capacitor 7.x -- to be installed via npm (pin exact version)
- @capacitor/haptics -- to be installed via npm
