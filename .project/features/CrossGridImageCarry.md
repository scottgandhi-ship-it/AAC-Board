# Cross-Grid Custom Image Carry-Over

**Status**: APPROVED (Steve-reviewed, revised)
**Depends on**: ParentalGate_GridSafeguard (completed)

---

## Problem

When a parent customizes button images (e.g., replaces the Feelings folder icon, updates "Need a Break" with a photo their child understands), those customizations are lost on grid switch. Since button IDs are identical across all grid sizes (`folder-feelings`, `t-break`, etc.), there's no technical reason images can't carry forward.

## Scope

- Images only (not labels, colors, or custom-added buttons)
- Carry forward on "Start Fresh" switches (the common case)
- Silently skip images for buttons that don't exist in the target grid (e.g., 4x4 -> 3x3 may drop some folders)
- "Restore My Board" is unaffected (it already restores everything from backup)

## Current Flow (Start Fresh)

1. `saveGridBackup(currentSize, buttons)` -- saves current board to IndexedDB backups
2. `clearAllData()` -- wipes STORE_BUTTONS and STORE_IMAGES
3. `getTemplate(newSize)` -- loads default template
4. `saveButtons()` -- writes template to IndexedDB
5. `renderGrid()` -- renders with no custom images

## Proposed Flow (Start Fresh with Image Carry-Over)

1. `saveGridBackup(currentSize, buttons)` -- same as before
2. Collect custom images: read all entries from STORE_IMAGES where `isCustomImage(id)` is true
3. Build a map: `{ buttonId: dataURL }` for all custom images
4. `clearAllData()` -- wipes both stores
5. `getTemplate(newSize)` -- loads default template
6. `saveButtons()` -- writes template to IndexedDB
7. Determine which button IDs exist in the new template
8. For each custom image where the button ID exists in the new template: `saveImage(id, dataURL)`
9. Preserve the `aac-custom-images` localStorage entry (only keep IDs that exist in new template)
10. `renderGrid()` -- renders with carried-over custom images

## Files to Modify

- `js/storage.js` -- new `collectCustomImages()` function
- `index.html` -- update `doFresh()` in `showGridSwitchModal()` to carry images forward

## Implementation

### js/storage.js -- new function

`collectAllImages()`:
- Open read transaction on STORE_IMAGES
- Iterate ALL entries with cursor (Steve review: don't rely on custom image cache, collect everything)
- Return map of `{ buttonId: dataURL }`

### index.html -- update doFresh()

In `showGridSwitchModal()`, the `doFresh()` function currently:
1. Calls `clearAllData()`
2. Loads template
3. Saves buttons
4. Renders

Change to:
1. Collect ALL images via `collectAllImages()`
2. Call `clearAllData()`
3. Load template
4. Save buttons
5. Build set of button IDs in new template
6. For each image where ID exists in the new template set: call `saveImage(id, dataURL)`
7. Rebuild `aac-custom-images` localStorage from only the IDs that were actually carried over (Steve review: fixes pre-existing stale cache bug)
8. Render grid

### Edge Cases

- No custom images exist: loop runs zero times, no impact
- All custom images match new template: all carry over
- Some don't match (going to smaller grid): silently skipped
- Image save fails: skip that image, don't block the switch
- Early learner grids: already skip the entire backup/modal flow, unaffected

## Acceptance Criteria

- Customize Feelings folder image on 3x3, switch to 4x4 Start Fresh -> Feelings still has custom image
- Customize a button inside Feelings on 3x3, switch to 4x4 -> custom image preserved
- Switch from 4x4 to 3x3 with images on buttons that don't exist in 3x3 -> silently skipped, no errors
- "Restore My Board" still works as before (full backup restore)
- No custom images -> switch works exactly as before
- Early learner grid switches unaffected
