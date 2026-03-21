# Parental Gate + Grid-Size Switching Safeguard

**Status**: APPROVED (Steve-reviewed, revised)
**Target**: Apple Kids category compliance for App Store launch (2026-05-18)

---

## Context

Both AAC Board and Guiding Steps need Apple Kids category compliance. Apple requires settings and features that could disrupt a child's experience to be behind a parental gate. Currently any child can tap the settings gear. Additionally, switching grid sizes calls `clearAllData()` which permanently destroys all custom words, images, and edits with only a `confirm()` dialog.

---

## Feature 1: Parental Gate (Tap+Hold)

### Approach

Replace the simple tap on the settings gear with a 2-second press-and-hold. A progress ring animates around the gear during the hold. First-time users see a "Hold for settings" tooltip.

### Files to Modify

- `index.html` -- settings button HTML (~line 255), three click handlers (~lines 3324, 3671, 4481)
- `css/app-chrome.css` -- settings button styles (~line 57)
- `guiding-steps/index.html` -- settings button (~line 2911), click handler (~line 3282)

### Implementation

**HTML** -- Add progress ring SVG overlay to `#btn-parent-settings`:
- Circle SVG with `r="18"`, `stroke-dasharray="113"`, `stroke-dashoffset="113"` (fully hidden)
- Positioned absolute over the gear icon, `pointer-events: none`
- Add tooltip span: `<span class="gate-hint">Hold for settings</span>`

**CSS** -- Add to `css/app-chrome.css`:
- `.parental-gate-ring` -- absolute positioned, opacity 0, transitions
- `.parental-gate-ring.active` -- opacity 1, circle animation fills over 2s
- `.gate-hint` -- tooltip above gear, auto-shown on first visit
- `@media (prefers-reduced-motion)` -- skip ring animation, instant fill at completion

**JavaScript** -- Create `openSettingsPanel()` and `initParentalGate()`:

CRITICAL (Steve review item 1): AAC Board has THREE separate click listeners on `btn-parent-settings`:
- Line 3324: opens overlay, updates accordion summaries, updates grid select
- Line 3671: populates child name input, hides status
- Line 4481: renders activity cards

All three MUST be consolidated into a single `openSettingsPanel()` function. The gate calls this function on successful 2s hold.

Gate mechanics:
- `pointerdown` starts 2-second timer, adds `.active` to ring
- `pointerup`/`pointercancel`/`pointerleave` cancels timer, resets ring
- Timer completion calls `openSettingsPanel()`
- First successful gate: set `localStorage('aac-gate-hint-shown', 'true')`, hide tooltip
- Keyboard support: `keydown` Enter/Space starts timer, `keyup` cancels
- Haptic feedback: guard with `if (navigator.vibrate)` -- NOT available on iOS Safari/WKWebView (Steve review item 2)

**Guiding Steps** -- Same pattern:
- Replace click listener at line 3282
- Use `gs-gate-hint-shown` localStorage key
- GS `openSettingsPanel()` calls its own summary update functions (`updateSensorySummary`, `updateScheduleSummary`, `updateVoiceSummary`)

### Acceptance Criteria

- Quick tap does nothing
- 2-second hold opens settings with ring animation
- Early release cancels and resets
- First-time tooltip shown, dismissed after first success
- Works on touch and keyboard
- Touch target stays 44x44px minimum
- Reduced motion respected
- No crash on iOS (vibrate guarded)

---

## Feature 2: Safeguard Grid-Size Switching

### Approach

Auto-save board data to a new IndexedDB object store before any grid switch. When switching to a grid size that has a previous backup, offer to restore it.

### Files to Modify

- `js/storage.js` -- DB schema (lines 4, 7, 12-19), new functions
- `index.html` -- grid-size change handler (~line 3348)

### Implementation

**Step 1: IndexedDB Schema** (`js/storage.js`):
- `DB_VERSION` 3 -> 4
- Add `STORE_BACKUPS = 'backups'` constant
- In `onupgradeneeded`: `if (!db.objectStoreNames.contains('backups')) db.createObjectStore('backups')`
- CRITICAL (Steve review item 3): Use same `if (!db.objectStoreNames.contains(...))` guard pattern as existing stores. Existing `buttons`/`images` stores must not be touched during upgrade.

**Step 2: New functions** (`js/storage.js`):

`saveGridBackup(gridSize)`:
- CRITICAL (Steve review item 4): Save the in-memory `buttons` array directly, NOT `loadButtons()` from IndexedDB. The in-memory array may have unsaved edits.
- Load all images from STORE_IMAGES
- Gather settings from EXPORTED_SETTINGS_KEYS in localStorage
- Store as `{ gridSize, buttons, images, settings, savedAt }` keyed by grid size

`loadGridBackup(gridSize)`:
- Read from STORE_BACKUPS, return backup object or null

`hasGridBackup(gridSize)`:
- Count check, return boolean

`restoreGridBackup(gridSize)`:
- Load backup, clear STORE_BUTTONS + STORE_IMAGES, write backup data back
- CRITICAL (Steve review item 5): Restore all settings EXCEPT `aac-grid-size` to avoid circular restore

`deleteGridBackup(gridSize)`:
- Remove backup for given grid size

**Step 3: New grid-switch flow** (`index.html`):

Replace the `confirm()` dialog with:

1. Auto-save current grid: `await saveGridBackup(currentGridSize)`
2. Check for backup at new size: `const backup = await loadGridBackup(newSize)`
3. Show styled modal (reuse `export-import-panel` pattern):
   - If backup exists: "Restore My Board" / "Start Fresh" / "Cancel"
   - If no backup: "Your board will be saved. Switch to [name]?" / "Switch" / "Cancel"
4. "Restore" calls `restoreGridBackup(newSize)` then reloads board
5. "Start Fresh" calls `clearAllData()` then loads template defaults
6. "Cancel" resets select value, returns
7. Toast feedback after each outcome

**Edge cases**:
- Early learner grids (1, 21, 2) skip backup logic (no IndexedDB data to save)
- If `saveGridBackup()` fails, warn but allow switch
- If `restoreGridBackup()` fails, fall back to defaults with error toast

### Acceptance Criteria

- Switching 3x3 -> 4x4 auto-saves 3x3 data silently
- Switching 4x4 -> 3x3 offers "Restore My Board" option
- Restore fully recovers buttons, images, and settings (except grid size)
- "Start Fresh" loads defaults (current behavior)
- Cancel returns without changes
- Native `confirm()` replaced with styled modal
- Early learner grids unaffected
- IndexedDB upgrade is backward-compatible
- Error states show user-facing feedback

---

## Execution Order

1. Parental Gate on AAC Board -- pure UI, no data changes
2. Parental Gate on Guiding Steps -- copy pattern
3. Grid safeguard storage layer -- new IndexedDB store + functions
4. Grid safeguard UI -- new modal, replace confirm()

## Verification

- Test parental gate: quick tap (nothing), 2s hold (opens settings), early release (cancels)
- Test gate tooltip: clear localStorage, verify tooltip shows, verify it hides after first success
- Test grid switch: customize a 3x3 board, switch to 4x4, switch back, restore, verify all customizations preserved
- Test fresh start: switch grids, choose "Start Fresh", verify defaults load
- Test cancel: switch grids, cancel, verify nothing changed
- Test early learner: switch between 1x1/2x1/2x2, verify no backup dialog
- Build to device and test touch interactions
