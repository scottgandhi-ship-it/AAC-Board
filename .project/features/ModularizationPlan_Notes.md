# Modularization Plan -- Implementation Notes

## Status: IN PROGRESS -- Phase 0 complete, ready for Phase 1

## Current Session
- Plan created: 2026-03-19
- Plan approved: 2026-03-19
- Rollback tag: pre-modularization (commit b475d31)

## Implementation Checklist

### Phase 0: Tooling Adaptation
- [x] Create rollback tag (pre-modularization)
- [x] Create .scripts/check-sw-cache.sh (SW cache integrity validator)
- [x] Update /validate skill with SW cache check (Step 2)
- [x] Update pre-commit hook to trigger on js/, css/, sw.js changes
- [x] Add SW cache check to pre-commit hook (blocks commit on mismatch)
- [x] Install updated pre-commit hook to .git/hooks/
- [x] Smoke test: verified script catches missing files and stale entries

### Phase 1: CSS Extraction
- [x] Create css/ directory
- [x] Extract css/tokens.css (105 lines -- root variables, resets, body)
- [x] Extract css/app-chrome.css (221 lines -- header, tab bar, views, FAB)
- [x] Extract css/grid.css (340 lines -- grid, cells, folders, predictions, core strip)
- [x] Extract css/message-bar.css (85 lines -- message bar, bar buttons)
- [x] Extract css/modals.css (701 lines -- word picker, edit, add show, search, symbol, reorder)
- [x] Extract css/settings.css (561 lines -- settings panel, accordion, export/import, PWA banner)
- [x] Extract css/activities.css (533 lines -- activity banner, cards, preview, create, walkthrough, guided)
- [x] Extract css/onboarding.css (253 lines -- onboarding steps, grid picker, coach marks)
- [x] Extract css/insights.css (182 lines -- insights view)
- [x] Extract css/responsive.css (114 lines -- media queries, landscape, safe areas, sensory)
- [x] Extract css/ui-shared.css (21 lines -- toast)
- [x] Update sw.js cache list (11 CSS files added)
- [x] Bump cache version (v58 -> v59)
- [x] Update npm run sync to copy css/ directory
- [x] Update check-www-sync.sh to verify css/ files
- [x] SW cache check: PASSED
- [x] Console.log check: PASSED
- [x] JS syntax check: PASSED
- [x] Browser testing -- PASSED (verified by developer)
- [ ] Verify offline mode

### Phase 2: Data Modules
- [x] Create js/ directory
- [x] Extract js/state.js (59 lines -- 31 global state variables)
- [x] Extract js/vocabulary.js (2,341 lines -- all vocab data, grid templates, word pools, icons)
- [x] Update sw.js cache list (v59 -> v60)
- [x] Update npm run sync to copy js/ directory
- [x] Update check-www-sync.sh to verify js/ files
- [x] Update check-console-logs.sh to scan js/*.js
- [x] Update check-html-syntax.sh for external script tags
- [x] SW cache check: PASSED
- [x] JS syntax check: PASSED
- [x] Console.log check: PASSED
- [x] Browser testing -- PASSED (verified by developer)

### Phase 3: Core Infrastructure
- [ ] Extract js/ui-shared.js (showToast, escapeHtml)
- [ ] Extract js/storage.js (IndexedDB, buttons, images, grid helpers)
- [ ] Extract js/i18n.js (language system, translations)
- [ ] Extract js/grammar.js (grammar engine EN + ES)
- [ ] Extract js/tts.js (TTS, voices, speak, haptic)
- [ ] Update sw.js cache list
- [ ] Bump cache version
- [ ] Verify language switching
- [ ] Verify TTS works
- [ ] Verify grammar features
- [ ] Verify offline mode

### Phase 4: Feature Modules
- [ ] Extract js/predictions.js
- [ ] Extract js/usage.js
- [ ] Extract js/grid.js
- [ ] Extract js/message-bar.js
- [ ] Extract js/word-picker.js
- [ ] Extract js/insights.js
- [ ] Extract js/navigation.js
- [ ] Extract js/settings.js
- [ ] Extract js/activities.js
- [ ] Extract js/guided-vocab.js
- [ ] Extract js/create-activity.js
- [ ] Extract js/routines.js
- [ ] Extract js/edit-modal.js
- [ ] Extract js/folder-reorder.js
- [ ] Extract js/export-import.js
- [ ] Extract js/onboarding.js
- [ ] Extract js/pwa.js
- [ ] Extract js/app.js (init, entry point)
- [ ] Update sw.js cache list (final)
- [ ] Bump cache version

### Phase 5: Cleanup and Validation
- [ ] Remove inline style tag from index.html
- [ ] Remove inline script tag from index.html
- [ ] Update Capacitor www/ sync script
- [ ] Verify Capacitor build
- [ ] iOS simulator testing
- [ ] Lighthouse audit (target 90+ all categories)
- [ ] Full offline mode test
- [ ] Cross-browser testing (Chrome, Safari, Firefox)

## Issues and Resolutions
(none yet)

## Deviations from Plan
(none yet)

## Validation Results
(pending implementation)
