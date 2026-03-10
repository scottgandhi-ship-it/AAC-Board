# Grid Dropdown Selector

**Author**: Noah (UI/UX Designer)
**Status**: PLANNING -- awaiting approval
**Date**: 2026-03-10

---

## Executive Summary

Replace the current card-carousel grid picker and Settings button row with a single, consistent **dropdown select** component. The dropdown is more intuitive: it takes less space, requires no scrolling, and presents the four options in a familiar, scannable format. Parents immediately understand how dropdowns work -- no learning curve, no hidden cards offscreen.

---

## Problem Statement

The current grid picker has usability friction:

1. **Card carousel on mobile** -- Options are partially hidden offscreen. Parents must swipe to discover all 4 sizes. Scroll dots help but add cognitive overhead.
2. **Two different UIs for the same setting** -- The first-run overlay uses visual cards; Settings uses a button row. Inconsistency creates confusion.
3. **Excessive visual weight** -- Full-screen overlay with grid previews is heavy for what is a simple 4-option choice.
4. **Mobile scroll issues** -- Horizontal scroll with snap points is finicky on some devices.

---

## Design Approach

### Dropdown Component Design

A styled native `<select>` element (not a custom dropdown) for maximum accessibility and platform consistency. On iOS, this triggers the native scroll picker. On Android, the native dropdown. Both are instantly familiar.

**Each option displays**:
- Label name: "Starter", "Growing", "Confident", "Talker"
- Grid dimensions: "3x3", "4x4", "5x5", "6x6"
- Description: "Learning to request", "Building sentences", etc.

**Option format in dropdown**: "Starter (3x3) -- Learning to request"

### Visual Treatment

- Rounded corners (12px border-radius) consistent with app style
- Soft border (#ddd), white background
- Font size 1rem for readability
- Padding 12px 16px for generous touch target (well above 44px minimum)
- Subtle down-arrow indicator
- Width: 100%, max-width 360px, centered

### Color and Typography

- Label text: #333 (dark, readable)
- Select border: #ccc default, #5C6BC0 (app primary) on focus
- Focus ring: 2px solid with 2px offset for accessibility
- Font: inherit from app (rounded, readable)

---

## Scope of Changes

### Location 1: First-Run Grid Picker Overlay (lines 4615-4675)

**Current**: Full-screen overlay with 4 visual card buttons, horizontal scroll, scroll dots
**New**: Simplified overlay with:
- Same heading "Choose a starting layout"
- Same description text
- Language toggle (keep as-is)
- Dropdown `<select>` replacing the card grid
- A "Continue" button below the dropdown (needed since dropdown selection alone is not an obvious commit action)
- Remove: `.grid-picker-options` cards, `.grid-picker-scroll-hint`, `.grid-picker-scroll-dots`

### Location 2: Settings Page Grid Size (lines 4242-4251)

**Current**: Row of 4 buttons ("Starter", "Growing", "Confident", "Talker")
**New**: Same dropdown component as Location 1
- Remove: `#grid-size-buttons` div with 4 buttons
- Add: `<select>` with same options
- Keep: Warning text about resetting to defaults

### Location 3: Onboarding Step 2 (lines 4595-4602)

**No change** -- This is just intro text that transitions to the grid picker overlay. Remains as-is.

---

## Implementation Plan

### Task 1: Add Dropdown CSS

Add styles for the new `.grid-size-select` class:
- Appearance reset (appearance: none; for cross-browser)
- Custom arrow indicator via background SVG
- Rounded corners, padding, border, focus states
- Responsive width (100%, max-width 360px)
- Touch-friendly sizing (min-height 48px)

### Task 2: Replace First-Run Grid Picker HTML

Replace the card-based `.grid-picker-options` section (lines 4623-4673) with:
- A `<select>` element with 4 `<option>` elements
- A "Continue" button below the select
- Keep language toggle above
- Keep heading and description text

### Task 3: Replace Settings Grid Size HTML

Replace `#grid-size-buttons` (lines 4244-4249) with:
- A `<select>` element matching the first-run dropdown
- Same option labels and values

### Task 4: Update JavaScript -- First-Run Picker

Update `showGridPicker()` (lines 6256-6300):
- Remove card click handlers
- Remove scroll dot logic
- Bind "Continue" button to read selected `<option>` value
- Call `setGridSize()` and `getTemplate()` as before
- Simpler, less code

### Task 5: Update JavaScript -- Settings Grid Size

Update Settings grid size handler (around line 8283):
- Replace button click delegation with `<select>` change event
- Highlight active option on page load (set `select.value`)
- Same `setGridSize()` / template reload logic

### Task 6: Clean Up Dead CSS

Remove unused styles:
- `.grid-picker-options` flex/scroll container
- `.grid-picker-card` card styles
- `.picker-grid-preview` visual preview grid
- `.picker-label`, `.picker-desc`
- `.grid-picker-scroll-hint`, `.grid-picker-scroll-dots`
- Related mobile media query overrides (lines 538-576)
- `.grid-size-opt` button styles if dedicated

### Task 7: Update Spanish Translations

Ensure dropdown option text has translations if the app is in Spanish/Both mode. Check existing translation keys for grid size labels.

---

## Accessibility Requirements

- Native `<select>` element provides built-in keyboard navigation, screen reader support, and platform-native interaction
- `<label>` element associated with each `<select>` via `for`/`id`
- Focus indicator visible (2px solid outline)
- Touch target exceeds 44px minimum height
- `aria-label` on the overlay dialog remains

---

## Acceptance Criteria

- [ ] First-run grid picker shows a dropdown instead of cards
- [ ] Settings grid size shows a dropdown instead of buttons
- [ ] Selecting a grid size from the dropdown works identically to the old cards/buttons
- [ ] Dropdown shows current selection on load (Settings)
- [ ] "Continue" button on first-run picker commits the selection
- [ ] Native platform picker triggers on iOS and Android
- [ ] Keyboard navigation works (desktop)
- [ ] Screen reader announces options correctly
- [ ] Spanish translations work in dropdown options
- [ ] All dead CSS and JS from old card picker is removed
- [ ] No visual regressions elsewhere in the app

---

## Risk Assessment

**Low risk** -- This is a UI simplification. No data model changes, no storage changes, no service worker changes. The `setGridSize()` and `getTemplate()` functions remain untouched. Only the input mechanism changes from cards/buttons to a dropdown.

**One consideration**: The visual grid preview (mini 3x3, 4x4 etc. grids) is lost. The text descriptions ("Learning to request", "Building sentences") carry the same information in a more scannable format. If visual previews are missed, a small inline preview could be added later -- but start simple.
