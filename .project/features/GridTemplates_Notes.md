# Grid Templates - Implementation Notes

## Current Status: Phase 2 IMPLEMENTATION -- Task 5 (Validation) in progress

## Checklist

### Task 1: Vocabulary Data (Composition Pattern)
- [x] Define HOME_GRID_3X3 const (9 core words)
- [x] Define HOME_GRID_6X6 const (20 core words + 16 folders)
- [x] Create getTemplate(size) function (composes arrays, extracts folder contents from DEFAULT_BUTTONS)
- [x] Add BUTTON_ICONS entries for s-* and t-* prefixed IDs
- [x] Validate: unique IDs, correct Fitzgerald Key colors

### Task 2: Grid Size State + Dynamic Rendering
- [x] Add getGridSize() / setGridSize(n) helpers (localStorage)
- [x] Replace hardcoded repeat(4, 1fr) with CSS custom property --grid-cols
- [x] Set --grid-cols in init() and on grid size change
- [x] Update init() decision tree (load IDB -> seed from getTemplate if empty)
- [x] Update renderGrid() row calculation to use getGridSize()
- [x] Add CSS font-size adjustments for 6x6 mode (body.grid-3, body.grid-6 classes)

### Task 3: First-Run Grid Size Picker
- [x] Add overlay HTML markup (hidden by default)
- [x] Add overlay CSS (full-screen, three tappable cards)
- [x] Show/hide logic in init() (no IDB data AND no localStorage)
- [x] Wire selection to setGridSize(), getTemplate(), seed, dismiss
- [x] Verify picker never shows for returning users

### Task 4: Settings Panel Grid Size Selector
- [x] Add Grid Size section to settings-panel HTML
- [x] Style grid size buttons with active state
- [x] Add confirmation dialog for grid size change
- [x] Wire reset logic (clear IDB buttons, seed from getTemplate, re-render)

### Task 5: Validation
- [ ] Test 3x3 on 375px viewport
- [ ] Test 4x4 on 375px viewport
- [x] Test 6x6 on 375px viewport -- PASSED (51x94px cells, all 36 buttons render)
- [x] Verify 44px minimum touch targets at 6x6 -- PASSED (51x94px on mobile, 144x104px desktop)
- [ ] Test folder navigation at each size (3x3 has no folders)
- [ ] Test grid size switching via settings panel
- [ ] Test "Add button" in 3x3 mode
- [ ] Screen reader testing
- [ ] Focus management after grid size change
- [ ] Test reload persistence (grid survives page refresh)

## Issues and Resolutions

1. **Missing saveButtons() function**: Codebase only had saveButton() (singular). Created new saveButtons() for bulk save (clear IDB store + put all).
2. **Fragile CSS attribute selectors**: Changed from :root[style*="--grid-cols: 6"] to body class approach (body.grid-3, body.grid-6) for reliability.
3. **npx not available**: Changed launch.json from npx serve to python3 -m http.server 3000.

## Deviations from Plan
- Used body classes (body.grid-3, body.grid-6) instead of attribute selectors per Robert's recommendation
- Created saveButtons() bulk function (not in original plan but necessary)

## Validation Results

### First-Run Picker
- PASSED: Shows on fresh install (no IDB, no localStorage)
- PASSED: Three cards display with correct labels (3x3 Starter, 4x4 Growing, 6x6 Talker)

### 6x6 Talker
- PASSED: 36 buttons render in 6 columns
- PASSED: 20 core words + 16 folders with correct Fitzgerald Key colors
- PASSED: Touch targets 51x94px on mobile (375px), 144x104px on desktop
- PASSED: Folder navigation works (General folder tested)

### Remaining
- 3x3 and 4x4 validation pending
- Settings panel grid switching pending
- Reload persistence pending
- Screen reader testing pending
