# Quality Assurance - Session Notes

## Status: IN PROGRESS

## Files Created
- .project/features/QualityAssurance.md -- Full QA plan (20 test categories, 100+ checks)
- qa-tests.html -- Automated in-browser test suite (zero dependencies)

## Test Suite Coverage (qa-tests.html)

| Section | Tests | Description |
|---------|-------|-------------|
| A.1 Core Communication | 11 | Message bar, word chips, folders, back button, speech |
| A.2 Grid Templates | 6 | Grid sizes 3/4/6, persistence, core strip visibility |
| A.3 Parent Mode | 6 | Enable/disable, classes, settings access, auto-lock |
| A.4 View Switching | 7 | Tab navigation, header updates, back button, single active |
| A.5 Activity Overlays | 7 | Start/end activity, banner, grid content, cleanup |
| A.6 Sensory Preferences | 3 | localStorage toggle values |
| A.7 Language Support | 3 | Language switching, persistence |
| A.8 Usage & Analytics | 5 | Recording, counts, streaks, frequencies, clearing |
| A.9 Word Search | 3 | Overlay, input, button existence |
| A.10 Data Integrity | 7 | Button properties, types, colors, uniqueness, positions |
| A.11 DOM & Accessibility | 7 | Lang attr, ARIA, tab roles, data attributes |
| A.12 PWA Validation | 5 | SW API, manifest, theme-color, meta tags, viewport |
| A.13 Edge Cases | 9 | Empty state handling, null inputs, rapid ops, invalid IDs |
| A.14 Accessibility | 5 | Tap targets, accessible names, alt attrs, focus styles |
| A.15 Prediction & Bigrams | 4 | Prediction bar, clearing, bigram recording |
| A.16 Export & Import | 1 | JSON serialization round-trip |
| A.17 Onboarding | 3 | Overlay existence checks |
| A.18 Reward Tracker | 4 | View, config, celebration, render |
| A.19 Visual Schedule | 3 | View, steps list, render |
| A.20 Toast System | 1 | showToast execution |
| **TOTAL** | **100** | |

## How to Run

1. Open qa-tests.html in a browser (must be served, not file://)
2. Click "Run All Tests"
3. The app loads in an iframe (bottom-right preview)
4. Results show pass/fail with timing and error details
5. Use "Failed" filter to focus on issues
6. Use "Re-run Failed" to retry after fixes

## Manual Testing Still Required

The automated suite covers functional logic and DOM structure. These areas require manual testing:

- [ ] Speech output quality and voice selection
- [ ] Touch interactions on real devices (long-press, swipe)
- [ ] PWA install flow on iOS and Android
- [ ] Offline mode after cache
- [ ] Screen reader navigation (VoiceOver, TalkBack)
- [ ] Landscape orientation handling
- [ ] Safe area insets (notch devices)
- [ ] ARASAAC symbol loading (network dependent)
- [ ] Custom photo upload
- [ ] Lighthouse audit scores
- [ ] Cross-browser (Safari, Chrome, Firefox)

## Session Log

### 2026-03-09
- Created QA plan document with 20 test categories
- Built automated test suite with 100 tests across 20 sections
- Test suite uses iframe-based approach (no external dependencies)
- Covers: core communication, grid templates, parent mode, views, activities, sensory, language, analytics, search, data integrity, DOM/a11y, PWA, edge cases, accessibility, predictions, export, onboarding, rewards, schedule, toasts
