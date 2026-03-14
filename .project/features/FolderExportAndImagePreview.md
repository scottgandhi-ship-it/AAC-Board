# Folder Export with Images & Tile Image Preview

## Executive Summary

Parents spend significant time customizing AAC folders with meaningful images -- real photos of TV shows, YouTube characters, family members -- that their child recognizes. Currently, export is all-or-nothing (full board backup). This feature enables parents to export individual or multiple folders (with embedded images) to share with family, friends, and SLPs, ensuring motor planning consistency across all the child's devices. Additionally, a long-press-to-enlarge interaction lets parents and children view custom tile images at a larger size, since grid cells (even 3x3) are too small to clearly see uploaded photos.

## Requirements

### R1: Single Folder Export
- From parent mode, a parent can export any individual folder
- The export includes all buttons in that folder AND their custom images
- Export produces a .aacboard file (same format, new exportMode: "folder")
- Uses Web Share API when available, falls back to file download

### R2: Multi-Folder Bulk Export
- Parent can enter a "select mode" and tap multiple folders to select them
- Visual selection indicator (checkmark overlay or highlight border)
- "Export Selected" action produces a single .aacboard file containing all selected folders and their images
- exportMode: "folders" (plural) to distinguish from single folder

### R3: Folder Import (Merge)
- Importing a folder/folders file adds the folders to the existing board (does not replace)
- If a folder with the same ID already exists, show conflict resolution: "Replace", "Keep Both", or "Skip"
- Import preview shows folder names, word counts, and image counts per folder
- Minimal clicks: preview -> confirm -> done

### R4: Tile Image Preview (Long-Press to Enlarge)
- In kid mode: long-press (500ms) on any tile with a custom image opens an enlarged view
- Enlarged view: overlay/modal showing the image at near-full-screen size with the button label below
- Tap anywhere or wait 3 seconds to auto-dismiss
- In parent mode: same behavior (long-press already used for quick-swap in early learner grids -- must not conflict)
- Only activates on tiles that have a custom image (isCustomImage check)

## Architecture Overview

### Export Format Extension

Current .aacboard format (version 1):

    {
      format: "aac-board",
      version: 2,
      exportMode: "folder" | "folders" | "template" | "backup",
      exportDate: ISO string,
      boardName: string,
      folders: [
        {
          folderId: string,
          folderLabel: string,
          buttons: [button objects]
        }
      ],
      images: { buttonId: "data:image/..." },
      settings: {} (empty for folder exports)
    }

Key changes from v1:
- version bumped to 2
- New "folders" array groups buttons by folder
- exportMode "folder" (single) and "folders" (multi)
- v1 imports still supported (backward compatible)
- Settings object empty for folder exports (folders don't carry global settings)

### Data Flow

**Export (single folder)**:
1. Parent opens folder in parent mode
2. Taps export button (new UI element in folder header or context menu)
3. System collects all buttons where folderId matches
4. System collects custom images for those buttons
5. Compresses images (existing compressImage function, 512px JPEG 80%)
6. Packages into .aacboard JSON
7. Triggers share/download

**Export (multi-folder bulk)**:
1. Parent enters folder selection mode from Settings or Export section
2. Taps folders to toggle selection (visual feedback)
3. Taps "Export Selected" button
4. System iterates selected folders, collecting buttons + images for each
5. Packages all into single .aacboard file
6. Triggers share/download

**Import (folder merge)**:
1. Parent opens import (existing flow)
2. System detects exportMode "folder" or "folders"
3. Shows folder-level preview (not full board replace warning)
4. On confirm: writes new buttons to IndexedDB, saves images, updates caches
5. If folder ID collision: prompt per folder (Replace / Keep Both / Skip)
6. reloadBoard() to refresh grid

### Long-Press Image Preview

**Interaction model**:
- touchstart/mousedown starts a 500ms timer
- If finger lifts before 500ms: normal tap (speak word)
- If 500ms elapses without lift: show enlarged image overlay
- touchend/mouseup on overlay dismisses it
- 3-second auto-dismiss timer as fallback
- Prevent default on long-press to avoid context menu on mobile

**Conflict avoidance**:
- Early learner grids use long-press for quick-swap in parent mode
- Image preview long-press only fires on tiles with custom images
- In parent mode on early learner grids: long-press triggers quick-swap (existing), NOT image preview
- Image preview available in kid mode on all grid sizes, and in parent mode on standard grids

## Task Breakdown

### Phase A: Tile Image Preview (Long-Press to Enlarge)
**Standalone feature, no export dependency**

- A1: Create overlay/modal markup and CSS for enlarged image view
  - Full-screen semi-transparent backdrop
  - Centered image container (max 90vw x 70vh, object-fit contain)
  - Label text below image
  - Smooth fade-in animation (reduced-motion aware)
- A2: Implement long-press detection on grid tiles
  - 500ms threshold timer
  - Touch and mouse event handling
  - Distinguish from tap (speak) and drag (scroll)
  - Only activate when isCustomImage(buttonId) returns true
- A3: Wire up overlay display and dismissal
  - Load image blob from IndexedDB on long-press trigger
  - Display in overlay with label
  - Dismiss on tap/click anywhere, or 3-second auto-dismiss
  - Clean up blob URL on dismiss
- A4: Handle conflict with early learner quick-swap
  - In parent mode + early learner grid: long-press = quick-swap (existing)
  - In kid mode (any grid) or parent mode (standard grid): long-press = image preview
  - Test both paths

**Acceptance criteria**:
- Long-press on custom image tile shows enlarged image
- Normal tap still speaks the word
- Auto-dismisses after 3 seconds
- Works on mobile touch and desktop mouse
- No conflict with quick-swap in early learner parent mode
- Respects reduced-motion preference (no animation if enabled)

### Phase B: Single Folder Export
**Depends on: existing export infrastructure**

- B1: Add export button to folder view header (parent mode only)
  - Icon button (share/export icon) visible when inside a folder
  - ARIA label: "Export this folder"
- B2: Implement buildFolderExportData(folderId) function
  - Filter buttons by folderId
  - Include the folder button itself (the tile on home screen)
  - Collect custom images for matching buttons
  - Compress images using existing compressImage()
  - Return v2 format object with exportMode "folder"
- B3: Wire export button to download/share flow
  - Reuse existing triggerDownload / navigator.share logic
  - Filename: folderLabel_YYYY-MM-DD.aacboard

**Acceptance criteria**:
- Export button visible in folder header (parent mode only)
- Exported file contains only that folder's buttons and images
- File opens correctly in a text editor (valid JSON)
- Images are embedded as base64

### Phase C: Multi-Folder Bulk Export
**Depends on: Phase B**

- C1: Add "Export Folders" entry point in Settings > Export section
  - Button: "Select Folders to Export"
  - Opens folder selection view
- C2: Build folder selection UI
  - Grid/list of all folders with tap-to-select
  - Visual selection state (highlighted border or checkmark badge)
  - "Select All" / "Clear" convenience buttons
  - Selected count indicator
  - "Export Selected (N)" action button
- C3: Implement buildMultiFolderExportData(folderIds[]) function
  - Iterate folders, collect buttons + images for each
  - Group into folders array in export object
  - exportMode: "folders"
  - Progress indicator for image compression
- C4: Wire to download/share flow
  - Filename: MyAAC_folders_YYYY-MM-DD.aacboard or custom name

**Acceptance criteria**:
- Can select 1 or more folders visually
- Single .aacboard file contains all selected folders with images
- Progress shown during image compression
- Works with Web Share API and fallback download

### Phase D: Folder Import (Merge)
**Depends on: Phase B format**

- D1: Update import detection to recognize v2 format
  - Check exportMode for "folder" or "folders"
  - Route to folder merge flow (not full board replace)
  - Maintain backward compatibility with v1 "backup" and "template" imports
- D2: Build folder import preview UI
  - Show each folder: name, word count, image count
  - If folder ID already exists: show conflict indicator
  - Conflict options per folder: Replace / Keep Both / Skip
  - "Keep Both" appends suffix to folder ID and label (e.g., "TV Shows (2)")
- D3: Implement applyFolderImport(data, conflictResolutions) function
  - For each folder in import data:
    - If Skip: do nothing
    - If Replace: delete existing folder buttons + images, write new ones
    - If Keep Both: assign new IDs, write alongside existing
    - Write images to IndexedDB, rebuild customImageCache
  - Call reloadBoard() when complete
- D4: Success feedback
  - Toast: "Added N folders (X words, Y images)"
  - Navigate to home screen showing new folders

**Acceptance criteria**:
- Importing a folder file adds folders without replacing existing board
- Conflict resolution works for all three options
- Images load correctly after import
- Existing board data untouched for non-conflicting folders
- v1 format imports still work exactly as before

## Integration Points

- **IndexedDB**: STORE_BUTTONS, STORE_IMAGES (existing stores, no schema change)
- **customImageCache**: Rebuilt on import (existing pattern)
- **Service Worker**: Cache version bump after deploy
- **Settings UI**: New export entry point for bulk export
- **Folder header**: New export button (parent mode)
- **Grid tiles**: New long-press handler (image preview)

## Accessibility Considerations

- Export/import buttons need ARIA labels
- Folder selection checkboxes need keyboard support (Enter/Space to toggle)
- Image preview overlay needs focus trap and Escape key dismiss
- Screen reader announcement on image preview open: "Enlarged image of [label]"
- All touch targets 44x44px minimum
- Conflict resolution radio buttons need proper label associations

## Mobile-First Considerations

- Folder selection UI must work well on small screens (card-based, not table)
- Image preview sized for portrait mobile (90vw max)
- Web Share API preferred on mobile for native share sheet
- Long-press must not trigger browser context menu (preventDefault)
- Export progress must not block UI (show inline progress)

## Context-Safe Batches

This feature can be implemented across multiple sessions:
- **Session 1**: Phase A (image preview) -- fully independent
- **Session 2**: Phase B (single folder export)
- **Session 3**: Phase C (bulk export) + Phase D (folder import)

Each phase produces a working, testable increment.
