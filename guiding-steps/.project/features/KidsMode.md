# Kids Mode -- Replace Parent Mode with Parent-First Default

## Executive Summary

Flip the app's access model: the parent is the primary user and always has full access to all configuration. A new **Kids Mode** toggle in Settings locks the interface down for child use. This removes the current Parent Mode unlock flow (hold-to-toggle lock icon, auto-lock timer, settings gate) and replaces it with a simpler, more honest model.

**Out of scope (deferred):**
- Child-proof protection for exiting Kids Mode (PIN, gesture gate, etc.)
- First-launch onboarding redesign

## Requirements

1. Remove the Parent Mode system entirely (lock icon, hold gesture, auto-lock timer, `parent-mode` CSS class gating)
2. All configuration UI is always visible by default (schedule controls, rewards controls, story edit/delete, settings sections, reset button)
3. Add a **Kids Mode** toggle in Settings that, when enabled:
   - Hides all editing/configuration controls (same elements currently hidden without Parent Mode)
   - Hides the Settings tab in the tab bar
   - Shows a minimal, child-safe interface
4. Kids Mode state persists in localStorage
5. To exit Kids Mode, the parent opens Settings -- but since Settings is hidden in Kids Mode, the parent taps the app header title area (a subtle, non-obvious entry point) to re-open Settings
6. Name the toggle exactly "Kids Mode" in the UI

## Architecture Overview

This is primarily a removal + rename. The CSS class `parent-mode` on `<body>` currently controls visibility. The new model inverts this:

- **Default (no class):** Everything visible -- parent has full access
- **`kids-mode` class on body:** Editing controls hidden, Settings tab hidden

### Current Parent Mode Touchpoints (to remove/change)

| Location | What | Lines | Action |
|----------|------|-------|--------|
| CSS | `.parent-mode-only` rule | 76-77 | Replace with `.parent-only` (hidden in kids-mode) |
| CSS | `#app-header.parent-active` styles | 60, 70-75 | Remove |
| CSS | `#btn-parent-lock` styles | 62-69 | Remove |
| CSS | `.parent-mode #rewards-parent-controls` | 620 | Invert: show by default, hide in kids-mode |
| CSS | `.parent-mode #schedule-parent-controls` | 1242 | Invert: show by default, hide in kids-mode |
| CSS | `.parent-mode .story-card-actions` | 1749 | Invert: show by default, hide in kids-mode |
| CSS | `.parent-mode #stories-parent-controls` | 1772 | Invert: show by default, hide in kids-mode |
| CSS | `.parent-mode #picker-lock` | 2125 | Remove (picker lock goes away) |
| HTML | `#btn-parent-lock` in header | 2199-2201 | Remove entirely |
| HTML | Settings: "Parent Mode" section with toggle button | 2555-2558 | Replace with "Kids Mode" toggle |
| HTML | `parent-mode-only` class on schedule settings section | 2575 | Remove class (always visible) |
| HTML | `parent-mode-only` class on reset button | 2595 | Remove class (always visible) |
| HTML | `#picker-lock` in template picker header | ~2540 | Remove lock icon |
| JS | `let parentMode = false` | 2768 | Replace with `let kidsMode = false` |
| JS | `parentAutoLockTimer` + `PARENT_AUTO_LOCK_MS` | 2770-2771 | Remove entirely |
| JS | `setParentMode()` function | 3038-3059 | Replace with `setKidsMode()` |
| JS | `resetParentAutoLock()` function | 3061-3064 | Remove |
| JS | Touch/click auto-lock listeners | 3067-3068 | Remove |
| JS | `btn-toggle-parent-mode` click handler | 3069 | Replace with kids-mode toggle |
| JS | Hold-to-toggle IIFE (lock icon) | 3071-3098 | Remove entirely |
| JS | Template picker: parentMode checks | 5208, 5235 | Remove gates (always allow editing) |
| JS | Picker lock hold-to-toggle IIFE | 5261-5279 | Remove entirely |

## Task Breakdown

### Task 1: CSS -- Remove parent-mode styles, add kids-mode styles

Remove:
- `#app-header.parent-active` and related styles (lines 60, 70-75, 78-79)
- `#btn-parent-lock` styles (lines 62-69)
- `.parent-mode-only` rules (lines 76-77)
- `.parent-mode #rewards-parent-controls` (line 620)
- `.parent-mode #schedule-parent-controls` (line 1242)
- `.parent-mode .story-card-actions` (line 1749)
- `.parent-mode #stories-parent-controls` (line 1772)
- `.parent-mode #picker-lock` (line 2125)

Add:
- Default display for controls: `#rewards-parent-controls`, `#schedule-parent-controls`, `#stories-parent-controls`, `.story-card-actions` all show by default (change their base `display: none` to `display: flex`)
- `.kids-mode #rewards-parent-controls { display: none !important; }`
- `.kids-mode #schedule-parent-controls { display: none !important; }`
- `.kids-mode .story-card-actions { display: none !important; }`
- `.kids-mode #stories-parent-controls { display: none !important; }`
- `.kids-mode #btn-parent-settings { display: none !important; }` (hide Settings tab)
- `.kids-mode .parent-only { display: none !important; }` (for reset button, schedule settings section)

### Task 2: HTML -- Remove lock icons, update settings panel

- Remove `#btn-parent-lock` from header (lines 2199-2201)
- Remove `#picker-lock` from template picker header
- In Settings panel: replace "Parent Mode" section with "Kids Mode" toggle:
  - Label: "Kids Mode"
  - Description: "Hides editing controls for child use"
  - Toggle switch (checkbox styled as toggle) instead of button
- Remove `parent-mode-only` class from schedule settings section (line 2575) -- replace with `parent-only`
- Remove `parent-mode-only` class from reset button (line 2595) -- replace with `parent-only`
- Add header title tap handler target (the `#app-header-title` element already exists)

### Task 3: JS -- Replace parent mode logic with kids mode

- Replace `let parentMode = false` with `let kidsMode` initialized from localStorage
- Remove `parentAutoLockTimer`, `PARENT_AUTO_LOCK_MS`
- Replace `setParentMode()` with `setKidsMode(enabled)`:
  - Toggles `kids-mode` class on body
  - Updates toggle state in settings
  - Saves to localStorage (`gs-kids-mode`)
  - No auto-lock timer
- Remove `resetParentAutoLock()` and its touch/click listeners
- Remove hold-to-toggle IIFE for header lock icon
- Remove hold-to-toggle IIFE for picker lock icon
- Remove parentMode gate on template picker click (line 5208) -- always allow `createStoryFromTemplate`
- Remove parentMode gate on "Create Story" scratch card (line 5235) -- always allow `openStoryEditor`
- Add header title tap to open Settings when in Kids Mode (subtle escape hatch)
- On app init: read `gs-kids-mode` from localStorage, call `setKidsMode()` if true

### Task 4: Settings tab behavior in Kids Mode

- When Kids Mode is on, the Settings tab button is hidden via CSS
- Tapping the app header title ("Guiding Steps") opens the settings overlay even in Kids Mode
- This is the parent's escape hatch to turn Kids Mode back off

## Acceptance Criteria

- [ ] App launches with full parent access by default (all controls visible)
- [ ] Kids Mode toggle in Settings enables/disables kids-mode
- [ ] In Kids Mode: schedule controls, rewards controls, story edit/delete actions, and Settings tab are all hidden
- [ ] In Kids Mode: tapping the header title opens Settings so parent can disable Kids Mode
- [ ] Kids Mode state persists across app reloads (localStorage)
- [ ] No remnants of old parent mode (no lock icons, no hold gestures, no auto-lock timer)
- [ ] Template picker always allows creating/editing stories (no parent mode gate)
- [ ] "Reset all to defaults" and schedule settings section visible by default, hidden in Kids Mode

## Dependencies

- None -- this is a standalone refactor of existing access control
