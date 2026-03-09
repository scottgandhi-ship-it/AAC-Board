# Quality Assurance - Full App QA Pass

## Executive Summary

Comprehensive quality assurance pass across the entire AAC Board application before launch. Covers functional testing, accessibility compliance (WCAG 2.1 AA), performance benchmarking, PWA validation, cross-device testing, and edge case coverage.

## QA Scope

The app is a single-file PWA (index.html, 11,600 lines, 894+ functions) with these major feature areas:

### Feature Areas Under Test

| # | Feature Area | Priority | Risk Level |
|---|-------------|----------|------------|
| 1 | Core Communication (grid, message bar, speech) | P0 | HIGH |
| 2 | Parent Mode (3-tap unlock, settings access) | P0 | HIGH |
| 3 | Grid Templates (3x3, 4x4, 6x6 switching) | P0 | HIGH |
| 4 | Word Prediction & Grammar Engine | P1 | MEDIUM |
| 5 | Activity Overlays (6 defaults + custom) | P1 | MEDIUM |
| 6 | Reward Tracker (steps, timer, celebration) | P1 | MEDIUM |
| 7 | Visual Schedules (create, complete steps) | P1 | MEDIUM |
| 8 | Sensory Preferences (3 toggles) | P1 | MEDIUM |
| 9 | Symbol Library (ARASAAC integration) | P1 | MEDIUM |
| 10 | Spanish Language Support | P1 | MEDIUM |
| 11 | Onboarding / Getting Started Guide | P1 | MEDIUM |
| 12 | Data/Usage Tracking & Insights | P2 | LOW |
| 13 | Export/Import Boards | P2 | LOW |
| 14 | Word Search | P2 | LOW |
| 15 | Quick Phrases | P2 | LOW |
| 16 | PWA (install, offline, service worker) | P0 | HIGH |
| 17 | Accessibility (keyboard, screen reader, contrast) | P0 | HIGH |
| 18 | Settings System (8 accordion sections) | P1 | MEDIUM |
| 19 | Edit Modal (word/folder editing) | P1 | MEDIUM |
| 20 | Folder Reorder (drag-to-reorder) | P2 | LOW |

---

## Test Categories

### A. Functional Tests (Automated - qa-tests.html)

Automated in-browser test suite that validates app logic without external dependencies.

**A.1 Core Communication**
- [ ] Core word strip renders 5 persistent words (I, want, don't want, more, help)
- [ ] Tapping a word adds it to message bar
- [ ] Message bar displays word chips in order
- [ ] Backspace removes last word from message bar
- [ ] Clear removes all words from message bar
- [ ] Speak button triggers speech synthesis
- [ ] Folder tap opens folder contents
- [ ] Back button returns from folder to home grid
- [ ] Words maintain position across views (motor planning)

**A.2 Grid Templates**
- [ ] 3x3 grid renders 9 cells correctly
- [ ] 4x4 grid renders 16 cells correctly
- [ ] 6x6 grid renders 36 cells correctly
- [ ] Switching grid size preserves vocabulary
- [ ] Core word strip visible in all grid sizes
- [ ] Grid cells are responsive to screen size

**A.3 Parent Mode**
- [ ] 3-tap unlock triggers PIN/access
- [ ] Parent mode reveals edit controls
- [ ] Exiting parent mode hides edit controls
- [ ] Settings only accessible in parent mode
- [ ] Edit modal opens for words in parent mode
- [ ] Edit modal opens for folders in parent mode

**A.4 Word Prediction**
- [ ] Prediction bar appears after first word tap
- [ ] Predictions are contextually relevant (bigram model)
- [ ] Tapping prediction adds word to message bar
- [ ] Prediction chain continues after selection
- [ ] Empty prediction bar when no suggestions available

**A.5 Grammar Engine**
- [ ] Pluralization works (e.g., "apple" -> "apples")
- [ ] Verb conjugation works (e.g., "I want" not "I wants")
- [ ] Article insertion works (e.g., "a apple" -> "an apple")
- [ ] Grammar applies to spoken output

**A.6 Activity Overlays**
- [ ] Default activities load (mealtime, bath, playground, etc.)
- [ ] Activating overlay shows activity-specific words
- [ ] Deactivating overlay restores normal grid
- [ ] Custom activities can be created
- [ ] Activity words follow Fitzgerald Key colors

**A.7 Reward Tracker**
- [ ] Reward tracks render with steps
- [ ] Completing a step advances progress
- [ ] Timer mode functions correctly
- [ ] Celebration triggers on completion
- [ ] Multiple tracks supported
- [ ] Data persists across sessions (IndexedDB)

**A.8 Visual Schedules**
- [ ] Schedule creation works
- [ ] Steps display in order
- [ ] Completing a step marks it done
- [ ] Schedule data persists (IndexedDB)

**A.9 Sensory Preferences**
- [ ] Reduced motion toggle disables animations
- [ ] High contrast toggle increases contrast
- [ ] Quiet mode toggle disables sounds
- [ ] Preferences persist across sessions
- [ ] OS prefers-reduced-motion respected on first load

**A.10 Spanish Language**
- [ ] Language toggle switches UI labels
- [ ] Spanish speech output works
- [ ] Word labels update to Spanish translations
- [ ] Bilingual mode shows both languages

**A.11 Data/Insights**
- [ ] Word usage frequency tracked
- [ ] Daily activity count incremented
- [ ] 7-day chart renders
- [ ] Top 10 words chart renders
- [ ] CSV export produces valid file
- [ ] Streak tracking works

**A.12 Export/Import**
- [ ] Board export generates valid JSON
- [ ] Board import restores vocabulary
- [ ] Import validates data structure
- [ ] Error handling for invalid imports

**A.13 Settings System**
- [ ] All 8 accordion sections open/close
- [ ] Grid size selector works
- [ ] Voice settings apply
- [ ] Language settings apply
- [ ] Sensory settings apply
- [ ] Settings persist after close

**A.14 Edit Modal**
- [ ] Word label editing works
- [ ] Word color/category changing works
- [ ] Symbol picker integration works
- [ ] Custom photo upload works
- [ ] New word creation works
- [ ] Word deletion works

**A.15 Search**
- [ ] Search input filters visible words
- [ ] Search results are tappable
- [ ] Empty search shows appropriate message
- [ ] Search clears properly

**A.16 Quick Phrases**
- [ ] Quick phrases folder accessible
- [ ] Tapping phrase speaks immediately
- [ ] All 15 default phrases present

**A.17 Onboarding**
- [ ] First-launch wizard triggers on fresh state
- [ ] Grid size selection works in wizard
- [ ] Coach marks display and dismiss
- [ ] Getting Started guide accordion works
- [ ] Onboarding does not re-trigger after completion

---

### B. Accessibility Audit (WCAG 2.1 AA)

**B.1 Touch Targets**
- [ ] All interactive elements >= 44x44px
- [ ] Adequate spacing between tap targets
- [ ] Grid cells meet minimum size at all grid densities

**B.2 Color Contrast**
- [ ] Text on Fitzgerald Key colors meets 4.5:1 ratio
- [ ] Button labels readable on all background colors
- [ ] High contrast mode achieves enhanced ratios
- [ ] Focus indicators visible on all interactive elements

**B.3 Keyboard Navigation**
- [ ] Tab order follows logical reading order
- [ ] All interactive elements focusable
- [ ] Enter/Space activates buttons
- [ ] Escape closes modals/overlays
- [ ] No keyboard traps

**B.4 Screen Reader**
- [ ] All buttons have accessible names (text or aria-label)
- [ ] Grid cells announce word name and category
- [ ] Modal dialogs have proper roles and labels
- [ ] Live regions announce speech output
- [ ] Form inputs have associated labels
- [ ] Status messages announced (toasts)

**B.5 Visual**
- [ ] App usable at 200% zoom
- [ ] No horizontal scroll at standard viewport widths
- [ ] Text resizable without loss of content
- [ ] No content conveyed by color alone

---

### C. Performance Benchmarks

- [ ] Lighthouse Performance score >= 90
- [ ] Lighthouse Accessibility score >= 90
- [ ] Lighthouse Best Practices score >= 90
- [ ] Lighthouse PWA score: all checks pass
- [ ] First Contentful Paint < 2s
- [ ] Time to Interactive < 3s
- [ ] DOM node count reasonable (< 3000 on home screen)
- [ ] No layout thrashing in grid rendering
- [ ] IndexedDB operations non-blocking

---

### D. PWA Validation

- [ ] manifest.json valid (name, icons, display, colors)
- [ ] Service worker registers successfully
- [ ] App installs on iOS (Add to Home Screen)
- [ ] App installs on Android (install prompt)
- [ ] Offline mode: app loads without network
- [ ] Offline mode: cached words/symbols available
- [ ] Cache version bump triggers update
- [ ] Network-first strategy confirmed (not cache-first)

---

### E. Edge Cases & Error Handling

- [ ] Empty message bar: speak button handles gracefully
- [ ] Rapid tapping: no duplicate words or crashes
- [ ] Very long sentences: message bar scrolls/handles overflow
- [ ] localStorage full: graceful error message
- [ ] IndexedDB unavailable: fallback behavior
- [ ] Speech API unavailable: user feedback shown
- [ ] Invalid symbol API response: error handled
- [ ] Orientation change: layout adapts correctly
- [ ] Safe area insets: content not behind notch/home bar
- [ ] Back button behavior: predictable navigation
- [ ] Multiple rapid view switches: no rendering artifacts

---

## Architecture

The automated test suite (qa-tests.html) will:

1. Load the app in an iframe
2. Access the app's DOM and JS state directly
3. Run tests programmatically (no external dependencies)
4. Output results with PASS/FAIL/SKIP status
5. Generate a summary report with counts and failure details

This keeps everything in our single-file, zero-dependency architecture.

---

## Acceptance Criteria

- [ ] All P0 functional tests pass
- [ ] All P1 functional tests pass (or documented exceptions)
- [ ] WCAG 2.1 AA audit completed with no critical failures
- [ ] Lighthouse 90+ in all categories
- [ ] PWA installs and works offline on iOS and Android
- [ ] Edge cases handled gracefully (no crashes, no silent failures)
- [ ] QA report generated with full results
