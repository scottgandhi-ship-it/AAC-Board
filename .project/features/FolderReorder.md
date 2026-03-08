# Folder Reorder -- Implementation Plan

## Executive Summary

Add a parent-facing UI to reorder folders on the home grid via drag-and-drop. Parents can customize which folders appear first, prioritizing their child's most-used or most-urgent categories. Accessible from Settings -> Customize tab. Touch-friendly, works on all grid sizes.

## Requirements

1. Parent can reorder folders on the home grid via drag-and-drop
2. Reorder UI is parent-mode-only (behind existing parent gate)
3. Works on mobile (touch) and desktop (mouse) via pointer events
4. Custom order persists across sessions (saved to IndexedDB via saveButtons)
5. Core words strip is NOT reorderable (fixed by design)
6. Only home-grid folders reorder -- contents within folders keep their positions
7. "Reset to default" option to restore original template order
8. Visual feedback during drag (lifted card, drop target indicator)

## Architecture

### Entry Point
- New button in Settings -> Customize tab: "Reorder Home Grid"
- Opens a reorder overlay (follows existing overlay pattern like #edit-overlay)

### Reorder Overlay
- Full-screen overlay with header "Reorder Folders" + Done/Cancel buttons
- Displays all home-grid folders as a vertical sortable list (not the grid itself)
- Each row shows: drag handle icon + folder emoji + folder label
- Drag-and-drop via pointer events (touch + mouse compatible)
- "Reset to Default" button at bottom

### Why Vertical List Instead of Grid Drag
- Grid drag-and-drop is complex (2D positioning, row wrapping)
- Vertical list is simpler to implement, clearer for parents, more accessible
- Parent sees the exact order top-to-bottom = left-to-right, top-to-bottom on grid

### Data Flow
1. Open overlay -> read current folder positions from `buttons` array
2. Parent drags to reorder -> updates visual list in real-time
3. "Done" -> update each folder's `.position` value, call `saveButtons()`, call `renderGrid()`
4. "Cancel" -> discard changes
5. "Reset" -> restore positions from template array order

### Motor Planning Safety
- Only folder ORDER changes, not folder contents
- Words inside folders retain their exact positions
- Core words strip is excluded from reorder

## Task Breakdown

### Subphase 1: HTML Overlay Structure
- Add #reorder-overlay to DOM (hidden by default)
- Header with title + Done/Cancel buttons
- Scrollable list container
- Reset to Default button
- Add "Reorder Home Grid" button to Customize tab

### Subphase 2: CSS Styling
- Overlay full-screen positioning (matches existing overlay pattern)
- List item styling (drag handle, icon, label)
- Dragging state (elevated shadow, opacity change, scale)
- Drop target indicator (line or highlight between items)
- Transition animations for smooth reorder

### Subphase 3: JavaScript -- Overlay Open/Close
- openReorderOverlay(): populate list from current folder buttons
- closeReorderOverlay(save): if save, persist new positions
- Wire up Customize tab button

### Subphase 4: JavaScript -- Drag-and-Drop Engine
- Pointer events (pointerdown, pointermove, pointerup) on list items
- Touch-action: none on draggable items
- Track drag source and current drop target
- Visual feedback: clone element follows pointer
- Auto-scroll when dragging near edges
- Reorder list items in real-time during drag

### Subphase 5: JavaScript -- Persistence
- On "Done": map list order to position values, update buttons array, saveButtons()
- On "Reset": read default order from getTemplate(gridSize), restore positions
- renderGrid() after save to reflect new order immediately

### Subphase 6: Cache Bump
- Bump sw.js cache version

## Integration Points

- saveButtons() -- existing, no changes needed
- renderGrid() -- already sorts by position, no changes needed
- getTemplate() -- used for "Reset to Default" reference
- Parent mode -- reorder button only visible in parent mode (existing pattern)
- Settings overlay -- add button to Customize tab

## Accessibility

- Drag handle has aria-label "Drag to reorder"
- List items are focusable with keyboard arrow key reorder (stretch goal)
- Done/Cancel buttons are keyboard accessible
- Touch targets minimum 44px height per list item

## Acceptance Criteria

- [ ] Parent can open reorder overlay from Settings -> Customize
- [ ] Folders display as draggable vertical list with icons and labels
- [ ] Drag-and-drop works on touch (iOS Safari, Android Chrome) and mouse
- [ ] New order persists after closing and reopening the app
- [ ] "Reset to Default" restores original template order
- [ ] Core words strip is not affected
- [ ] Words inside folders do not change positions
- [ ] Overlay has Done and Cancel with correct behavior
- [ ] Visual feedback during drag (elevation, drop indicator)
