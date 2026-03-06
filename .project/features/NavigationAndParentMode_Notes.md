# Navigation & Parent Mode - Implementation Notes

## Current Status: Implemented -- awaiting developer validation

## Checklist

### Task 0.1: Create #app-header
- [x] Header bar with view title and lock icon (Done)

### Task 0.2: Create #tab-bar
- [x] Replace #bottom-bar with 3-tab navigation (Done)
- [x] SVG icons for Talk (speech bubble), Schedule (list), Rewards (star)
- [x] ARIA roles: tablist, tab, aria-selected, aria-controls

### Task 0.3: Wrap AAC board in #view-talk
- [x] Move message-bar and grid-container into #view-talk (Done)

### Task 0.4: Create placeholder views
- [x] #view-schedule and #view-rewards with placeholder content (Done)
- [x] Both have role="tabpanel" and aria-labelledby

### Task 0.5: Implement parent mode toggle
- [x] Lock icon with 3-tap unlock within 2 seconds (Done)
- [x] Auto-lock after 5 minutes of inactivity (Done)
- [x] Visual indicator: orange header border + open lock icon (Done)
- [x] Single tap to re-lock when already unlocked (Done)

### Task 0.6: Retrofit AAC board to use parent mode
- [x] Replaced editMode with parentMode globally (Done)
- [x] Settings gear in header only visible in parent mode + Talk tab (Done)
- [x] Removed old edit-mode toggle button from settings panel (Done)
- [x] Add button opens edit modal directly (no intermediate editMode toggle)

### Task 0.7: Verify and test
- [x] Code review: HTML structure, JS references, CSS consistency (Done)
- [x] Fixed CSS specificity bug (.parent-mode rule vs JS display control)
- [ ] Developer manual testing on device (Pending)

## Issues and Resolutions
- Fixed: CSS rule `.parent-mode #btn-parent-settings` would have overridden JS-based hiding on non-Talk tabs. Removed the CSS rule; JS `updateParentModeUI()` handles all visibility logic.

## Deviations from Plan
- Merged settings button into header (gear icon, left side) instead of a 4th tab or per-view settings
- Removed the old "Edit Buttons" toggle entirely; parent mode replaces it (tap any button to edit while parent mode is active)
- Single tap to re-lock (more intuitive than requiring another 3-tap sequence)
