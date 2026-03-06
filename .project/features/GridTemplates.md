# Grid Templates by Communication Level

## Executive Summary

Add configurable grid sizes (3x3, 4x4, 6x6) so the AAC board matches the child's communication level. Currently the app is hardcoded to a 4x4 home grid. A beginning communicator seeing 16 folders is overwhelming; an advanced communicator may want 36 buttons for faster access. Grid size is the single fastest way to make the app feel personalized.

## Requirements

1. Three grid templates: 3x3 (9 cells), 4x4 (16 cells, current default), 6x6 (36 cells)
2. Each template has its own curated default vocabulary appropriate to that communication level
3. Grid size preference persisted locally (survives reload, works offline)
4. Grid size selector accessible in parent mode Settings only (child cannot change it)
5. Changing grid size resets vocabulary to that template's defaults (with confirmation)
6. Folder sub-grids adapt to the chosen column count (not hardcoded to 4)
7. Touch targets remain large enough at every size (especially 6x6 on phones)
8. First-time users see a one-time grid size picker before the board loads

## Architecture Overview

### Storage

- **Grid size preference**: localStorage key `aac-grid-size`, values: `3`, `4`, `6`. Default: `4` (preserves current behavior for existing users).
- **No IndexedDB schema changes** -- buttons store stays the same. Grid size only affects which template is seeded and how CSS renders.

### Vocabulary Data: Composition Pattern

To avoid duplicating ~300 button objects across template arrays, use a composition approach:

- **DEFAULT_BUTTONS** stays unchanged (the existing const). It serves as the 4x4 template directly.
- **FOLDER_CONTENTS** -- extracted at runtime from DEFAULT_BUTTONS: all items where folderId is not null. Shared by 4x4 and 6x6 templates.
- **HOME_GRID_3X3** -- small const array of 9 core word objects (flat, no folders).
- **HOME_GRID_6X6** -- small const array of 20 core word objects + 16 folder objects.
- **Template builder functions** compose final arrays at runtime:
  - getTemplate(3) -> HOME_GRID_3X3 (no folder contents -- 3x3 is flat)
  - getTemplate(4) -> DEFAULT_BUTTONS (returned by reference, no copy)
  - getTemplate(6) -> HOME_GRID_6X6.concat(FOLDER_CONTENTS)

This means folder content (food items, people, actions, etc.) is defined once. Adding a new food item is a single edit, not updating two arrays.

### CSS: Custom Property Approach

Instead of setting inline styles in JS, use a CSS custom property:

JS (set once on init and on grid size change):

    document.documentElement.style.setProperty('--grid-cols', gridSize);

CSS:

    #grid { grid-template-columns: repeat(var(--grid-cols, 4), 1fr); }

This keeps layout in CSS. Folder sub-grids automatically pick up the same variable without extra JS in renderGrid().

### Folder Sub-Grid Columns

When inside a folder, the grid column count matches the chosen grid size via the CSS custom property. A 3x3 user sees 3 columns inside folders too (consistent motor planning). A 6x6 user sees 6 columns inside folders.

NOTE: 3x3 Starter has no folders. If a parent adds buttons via Settings, they go to the flat home grid. No folder navigation exists at this level.

### Touch Target Validation

Minimum 44x44px per WCAG. At each grid size on a 375px-wide phone (smallest common target):
- 3x3: ~115px cells -- very comfortable
- 4x4: ~83px cells -- good (current)
- 6x6: ~52px cells -- tight but above 44px minimum. Font size may need to shrink. Test carefully.

### First-Run Experience

On first launch (no buttons in IndexedDB AND no `aac-grid-size` in localStorage):
1. Show a full-screen overlay with three visual options
2. Each option shows the grid pattern with a label: "3x3 Starter", "4x4 Growing", "6x6 Talker"
3. Brief helper text under each (e.g., "Learning to request" / "Building sentences" / "Combining words fluently")
4. Tapping an option sets the grid size, seeds the matching defaults, dismisses the overlay
5. Overlay does NOT appear for returning users (they already have data in IndexedDB)

NOTE: init() must detect the first-run condition and show the picker BEFORE seeding buttons. The flow is:
1. Read gridSize from localStorage (default 4)
2. Load buttons from IDB
3. If buttons exist -> use them, skip picker, render
4. If buttons empty AND no aac-grid-size in localStorage -> show picker, await selection
5. After selection (or if gridSize was already set): seed from getTemplate(gridSize)
6. Set --grid-cols CSS property
7. Render

### Settings Integration

Add a "Grid Size" section to the Settings panel (parent mode only):
- Three buttons: "3x3 Starter", "4x4 Growing", "6x6 Talker"
- Active size highlighted
- Changing size shows confirmation: "This will reset your buttons to the [size] defaults. Custom buttons will be lost. Continue?"
- On confirm: clear IndexedDB buttons, seed new defaults, update localStorage, set --grid-cols, re-render

## Task Breakdown

### Task 1: Vocabulary Data (Composition Pattern)
- Define HOME_GRID_3X3 const (9 core word objects, folderId: null, type: core)
- Define HOME_GRID_6X6 const (20 core words + 16 folder objects, positions 0-35)
- Keep DEFAULT_BUTTONS unchanged -- it IS the 4x4 template
- Create getTemplate(size) function that composes arrays:
  - size 3: returns HOME_GRID_3X3
  - size 4: returns deep copy of DEFAULT_BUTTONS
  - size 6: returns HOME_GRID_6X6 concat with folder contents extracted from DEFAULT_BUTTONS
- Add BUTTON_ICONS entries for new 3x3 and 6x6 core word IDs (s-* and t-* prefixed)
- Acceptance: Each template produces valid button array, unique IDs, correct Fitzgerald Key colors

### Task 2: Grid Size State + Dynamic Rendering
- Add getGridSize() / setGridSize(n) helpers using localStorage key `aac-grid-size`
- Replace hardcoded `repeat(4, 1fr)` in CSS with `repeat(var(--grid-cols, 4), 1fr)`
- Set --grid-cols CSS custom property in init() and on grid size change
- Update init() decision tree:
  - Read gridSize -> load IDB -> if buttons exist, use them -> else seed from getTemplate(gridSize)
- Update renderGrid() row calculation: totalCells / getGridSize() instead of hardcoded / 4
- Adjust cell font sizes for 6x6 (smaller labels via CSS when --grid-cols is 6)
- Acceptance: All three sizes render correct columns. Folders match. Reload preserves choice.

### Task 3: First-Run Grid Size Picker
- Add overlay HTML (hidden by default)
- Show on init() when: no IndexedDB data AND no aac-grid-size in localStorage
- Three large tappable cards with grid pattern preview and label
- On selection: setGridSize(), seed from getTemplate(), save to IndexedDB, dismiss overlay, renderGrid()
- init() awaits picker selection before proceeding to render
- Acceptance: Fresh install shows picker. Returning users never see it. Selection persists.

### Task 4: Settings Panel Grid Size Selector
- Add "Grid Size" section to #settings-panel HTML
- Three buttons showing current selection (active state highlighted)
- Confirmation dialog before resetting: "This will reset your buttons to [size] defaults. Custom buttons will be lost. Continue?"
- On confirm: clear buttons from IndexedDB, seed from getTemplate(newSize), setGridSize(), renderGrid()
- Parent mode only (settings already require parent mode)
- Acceptance: Can switch grid sizes in settings. Data resets correctly. Confirmation prevents accidents.

### Task 5: Validation
- Test all three sizes on 375px viewport
- Verify 44px minimum touch targets at 6x6
- Adjust padding/font for 6x6 if needed
- Test folder navigation at each size (including: 3x3 has no folders)
- Test "Add button" in 3x3 mode (adds to flat home grid)
- Test screen reader announces grid context
- Focus management after grid size change
- Acceptance: All sizes pass WCAG touch target minimums. Readable at every size.

## Dependencies

- Task 1 must complete before Tasks 2-4
- Task 2 must complete before Tasks 3-4
- Tasks 3 and 4 can run in parallel after Tasks 1-2
- Task 5 depends on all above

## Accessibility Considerations

- Grid size picker must be keyboard accessible
- All options need clear labels (not just visual grid patterns)
- 6x6 font sizes must maintain 4.5:1 contrast ratio
- Screen reader should announce grid size context ("3 by 3 grid, 9 buttons")
- Focus management after grid size change (return focus to grid)

## Risk: Existing User Data Migration

Existing users already have buttons in IndexedDB. When they update:
- They keep their current 4x4 layout (gridSize defaults to 4)
- They never see the first-run picker (they have data)
- They CAN switch grid size via Settings (which resets to defaults)
- No data migration needed -- this is purely additive

## Resolved Decisions

1. **3x3 is strictly flat** -- no folders, no folder navigation. Every tap speaks a word. (CONFIRMED)
2. **6x6 home grid** -- all 16 existing folders + 20 core words on home grid. Core words use existing vocabulary from current DEFAULT_BUTTONS. (CONFIRMED)
3. **Grid size change resets vocabulary** -- no reflow. Reset-only for v1. (CONFIRMED)
4. **Naming: "Starter / Growing / Talker"** (CONFIRMED)

## Architecture Review Notes (Robert)

Incorporated into plan above:
- Composition pattern for vocabulary data (avoid duplicating ~300 button objects)
- Keep DEFAULT_BUTTONS unchanged -- no rename risk
- CSS custom property for grid columns instead of inline JS styles
- Merged Task 2 (state) and Task 3 (CSS) into single Task 2
- Explicit init() decision tree documented in First-Run Experience section
- Noted 3x3 "Add button" edge case (adds to flat home grid, no folders available)

## Concrete Vocabulary Templates

### 3x3 Starter (9 flat core words, no folders)

| Position | ID | Label | Color | Type |
|----------|----|-------|-------|------|
| 0 | s-i | I | yellow | core |
| 1 | s-want | want | green | core |
| 2 | s-more | more | blue | core |
| 3 | s-help | help | green | core |
| 4 | s-stop | stop | red | core |
| 5 | s-yes | yes | green | core |
| 6 | s-no | no | red | core |
| 7 | s-eat | eat | green | core |
| 8 | s-drink | drink | green | core |

All have folderId: null, type: core. No folder buttons, no fringe buttons.

### 4x4 Growing (16 folders -- current DEFAULT_BUTTONS)

Unchanged. All 16 category folders + all folder contents exactly as they exist today.

### 6x6 Talker (36 home cells: 20 core words + 16 folders)

Home grid core words (positions 0-19, folderId: null, type: core):

| Pos | ID | Label | Color | Category |
|-----|----|-------|-------|----------|
| 0 | t-i | I | yellow | Pronoun |
| 1 | t-you | you | yellow | Pronoun |
| 2 | t-my | my | yellow | Pronoun |
| 3 | t-it | it | yellow | Pronoun |
| 4 | t-want | want | green | Verb |
| 5 | t-need | need | green | Verb |
| 6 | t-like | like | green | Verb |
| 7 | t-go | go | green | Verb |
| 8 | t-help | help | green | Verb |
| 9 | t-is | is | green | Verb |
| 10 | t-yes | yes | green | Affirmation |
| 11 | t-please | please | pink | Social |
| 12 | t-hi | hi | pink | Social |
| 13 | t-bye | bye | pink | Social |
| 14 | t-more | more | blue | Descriptor |
| 15 | t-big | big | blue | Descriptor |
| 16 | t-little | little | blue | Descriptor |
| 17 | t-no | no | red | Negation |
| 18 | t-stop | stop | red | Negation |
| 19 | t-dont | don't | red | Negation |

Same 16 folders at positions 20-35, plus all existing folder contents (shared via composition from DEFAULT_BUTTONS).
