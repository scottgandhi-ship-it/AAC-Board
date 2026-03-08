# Export/Share Boards

## Status: APPROVED
## Priority: P3 (Milestone 4.4)
## Dependencies: None -- can proceed on current architecture

---

## Executive Summary

File-based board export and import system with two modes: Template (structure only, no images) and Full Backup (complete board with compressed custom images). Enables the SLP-to-family handoff workflow that is critical for clinical adoption. Uses a custom .aacboard file extension. No cloud infrastructure required -- file download and file picker only.

**Primary use case**: SLP builds a board during evaluation, exports it, sends the file to the family via text/email. Family imports it on their device and customizes with personal photos.

**Secondary use case**: Family backs up their customized board before switching devices or as a safety net.

---

## Requirements

### Export

1. Two export modes accessible from Settings (parent mode only):
   - **Share as Template**: Structure only, no custom images. Small file (under 100KB). For SLPs sharing with families.
   - **Full Backup**: Everything including custom images compressed to 512x512px max. For device migration and backup. Target file size under 4MB for a fully customized board (accounting for base64 overhead).

2. Export triggers a browser file download with .aacboard extension

3. File format is JSON (internally) with .aacboard extension (externally)

### Import

4. Import accessible from Settings (parent mode only)
5. File picker accepts .aacboard files (also accept .json as fallback)
6. Max file size: 10MB (reject larger with toast)
7. Preview screen before applying: board name, word count, grid size, template vs full backup indicator
8. Single "Use This Board" action -- full replace, no merge
9. If the user has existing data, warn before replacing with "Back Up First" and "Replace My Board" buttons
10. If importing onto a fresh install (no existing buttons), skip the replace warning

### Data Included in Export

11. **Always included (both modes)**:
    - All button objects from IndexedDB as-is (raw objects, not a redesigned schema)
    - Grid size setting
    - Export metadata: format, version, exportMode, exportDate, boardName

12. **Settings (explicit localStorage keys)**:

    EXPORTED_SETTINGS_KEYS:
    - aac-grid-size
    - aac-voice
    - aac-pitch
    - aac-voice-rate (if exists)
    - aac-language
    - aac-grammar-plurals
    - aac-grammar-verbs
    - aac-grammar-articles
    - aac-auto-speak
    - aac-sensory-reduced-motion
    - aac-sensory-high-contrast
    - aac-sensory-quiet
    - aac-custom-es-labels
    - aac-bigram-counts

13. **Full Backup only**:
    - Custom images from IndexedDB images store
    - Only images whose keys match button IDs in the exported buttons array AND where hasCustomImage(buttonId) returns true
    - Images compressed to 512x512px max, JPEG at 80% quality
    - Images base64-encoded in the JSON under an "images" key
    - Note: base64 adds ~33% size overhead (50KB JPEG becomes ~67KB in JSON)

### Data Excluded from Export (both modes)

14. Usage data: aac-usage-log, aac-usage-summary (privacy / HIPAA)
15. Onboarding state: aac-onboarding
16. Custom image cache flag: aac-custom-images (rebuilt from imported images)
17. Reward tracker data (IndexedDB rewardTracks store)
18. Visual schedule data (IndexedDB scheduleTemplates and activeSchedule stores)
19. ARASAAC downloaded symbol cache (re-downloads automatically)

---

## Architecture Overview

### File Format (.aacboard)

The .aacboard file is a JSON file. Buttons are exported as raw IndexedDB objects wrapped in metadata:

    {
      "format": "aac-board",
      "version": 1,
      "exportMode": "template" | "backup",
      "exportDate": "2026-03-07T12:00:00Z",
      "boardName": "Emma's Board",

      "buttons": [
        raw button objects from IndexedDB as-is
      ],

      "settings": {
        "aac-grid-size": "4",
        "aac-voice": "Samantha",
        "aac-pitch": "1.0",
        ...all EXPORTED_SETTINGS_KEYS with their values
      },

      "images": {
        "soc-hello": "data:image/jpeg;base64,/9j/4AAQ..."
      }
    }

Notes:
- "buttons" contains the raw button objects exactly as stored in IndexedDB (preserves id, label, folderId, position, color, type, and any other fields)
- "images" key is empty object {} for template exports
- "images" key contains base64-encoded compressed images for full backup exports
- "version" field enables future schema migrations
- "format" field identifies the file type for validation on import
- On import, version must be <= app's current supported version

### Export Flow

1. User taps "Export Board" in Settings (parent mode)
2. Modal presents two options:
   - "Share as Template" -- description: "Board structure without personal photos. Best for sharing with others."
   - "Full Backup" -- description: "Complete board with all your custom photos. Best for moving to a new device."
3. Optional: user can edit the board name before export (defaults to "My AAC Board" or last-used name)
4. App builds the JSON object from current state:
   - Reads all buttons from IndexedDB (raw objects)
   - Reads EXPORTED_SETTINGS_KEYS from localStorage
   - If Full Backup: reads custom images from IndexedDB images store, compresses sequentially (not all in parallel -- prevents memory spike on low-end tablets), base64-encodes
5. Creates a Blob, generates a download URL, triggers download
6. Filename: "{boardName}_{date}.aacboard" (e.g., "Emmas_Board_2026-03-07.aacboard")
7. Toast: "Board exported!"

### Import Flow

1. User taps "Import Board" in Settings (parent mode)
2. File picker opens (accept=".aacboard,.json")
3. App reads the file via FileReader with try-catch
4. Reject files over 10MB with toast: "File is too large. Maximum size is 10MB."
5. Validation:
   - Check "format" === "aac-board"
   - Check "version" <= CURRENT_EXPORT_VERSION (currently 1)
   - Check required fields exist (buttons array, settings object)
   - If validation fails: toast "This file doesn't appear to be a valid AAC board."
6. Preview screen shows:
   - Board name
   - Export date
   - Export mode (Template or Full Backup)
   - Grid size (from settings["aac-grid-size"])
   - Word count (buttons.filter(b => b.type !== 'folder' && b.type !== 'core').length)
   - Folder count (buttons.filter(b => b.type === 'folder').length)
   - Image count (Object.keys(images).length) -- only shown for full backup
   - Language (from settings["aac-language"])
7. If existing buttons in IndexedDB:
   - Warning: "This will replace your current board."
   - Three buttons: "Back Up First" (triggers full backup export inline, then returns to this modal), "Replace My Board" (primary action), "Cancel"
8. If no existing buttons (fresh install):
   - Skip warning, just show "Use This Board" button
9. On confirm:
   - Clear existing buttons from IndexedDB (STORE_BUTTONS)
   - Clear existing button images from IndexedDB (STORE_IMAGES) -- only keys matching button IDs, not reward/schedule images
   - Write imported buttons to IndexedDB
   - If Full Backup: decode base64 images, write to IndexedDB images store, rebuild aac-custom-images cache
   - Apply EXPORTED_SETTINGS_KEYS to localStorage
   - Call reloadBoard() -- a new function that re-reads from storage and re-renders WITHOUT running init() migrations
10. Toast: "Board imported! [X] words, [Y] folders."

### reloadBoard() Function (Robert's recommendation)

New function that replaces calling init() after import. Avoids migration logic collisions.

What it does:
- Re-read buttons from IndexedDB
- Set grid size from localStorage
- Apply sensory preferences
- Apply language settings
- Re-populate voice selector
- Re-render the grid
- Trigger ARASAAC symbol download for buttons with default symbols
- Close settings panel

What it does NOT do:
- Run any migration logic (colour->colors, add missing core words, vocabulary expansion, dog/cat move)
- Those migrations are only for organic app updates, not for imported boards

### Image Compression

For Full Backup exports:
- Process images sequentially (one at a time) to prevent memory spikes on low-end tablets
- Create an offscreen canvas (512x512 max, maintaining aspect ratio)
- Draw the image onto the canvas
- Export as JPEG at 80% quality via canvas.toDataURL('image/jpeg', 0.8)
- Original stays untouched in the user's local IndexedDB

Estimated sizes (with base64 overhead):
- 512x512 JPEG at 80%: ~40-67KB per image in JSON
- Board with 20 custom images: ~0.8-1.3MB
- Board with 50 custom images: ~2-3.3MB

### Image Key Filtering (Robert's recommendation)

On export, only include images from the images store where:
1. The key exists in the exported buttons array (by button ID)
2. hasCustomImage(buttonId) returns true from aac-custom-images cache

This prevents accidentally including reward images (reward-*) or schedule images (sched-*) in the board export.

---

## Task Breakdown

### Task 4.4.1: Export data builder

- buildExportData(mode, boardName) async function
- Reads all buttons from IndexedDB via loadButtons()
- Reads EXPORTED_SETTINGS_KEYS from localStorage
- If mode === 'backup': reads and compresses custom images sequentially
- Image compression: offscreen canvas, 512x512 max, JPEG 80%, toDataURL
- Returns the complete JSON-serializable object
- Progress callback for UI updates during image compression

### Task 4.4.2: Export UI and download

- "Export Board" button in Settings panel (parent mode only)
- Export modal (matches existing overlay pattern):
  - Board name input (pre-filled, editable)
  - Two radio-style options: Template vs Full Backup with descriptions
  - "Export" button
  - Progress bar for Full Backup (shows during image compression)
- File download: Blob -> object URL -> hidden anchor -> click -> cleanup
- Filename: "{boardName}_{date}.aacboard" (sanitized: spaces to underscores, special chars removed)
- Toast on completion
- Error handling with toast on failure

### Task 4.4.3: Import file reader and validator

- "Import Board" button in Settings panel (parent mode only)
- Hidden file input (accept=".aacboard,.json")
- FileReader.readAsText() with try-catch
- Max file size check (10MB) before reading
- JSON.parse with try-catch
- Schema validation: format, version, buttons array, settings object
- Error toast for invalid files with specific messages

### Task 4.4.4: Import preview and confirmation

- Preview modal showing board metadata
- Derive stats from imported data:
  - Word count: buttons.filter(b => b.type !== 'folder' && b.type !== 'core').length
  - Folder count: buttons.filter(b => b.type === 'folder').length
  - Image count: Object.keys(data.images || {}).length
- Check for existing data (loadButtons().length > 0)
- If existing data: show replace warning with "Back Up First", "Replace My Board", "Cancel"
- "Back Up First" triggers buildExportData('backup', 'Backup') + download inline, then returns to modal
- If no existing data: show "Use This Board" button only

### Task 4.4.5: Import data writer and reloadBoard()

- clearBoardData(): clears STORE_BUTTONS, clears button-related images from STORE_IMAGES
- writeBoardData(data): writes buttons to STORE_BUTTONS, writes images to STORE_IMAGES, applies settings to localStorage, rebuilds aac-custom-images cache
- reloadBoard(): re-reads storage, re-renders grid, applies settings, downloads ARASAAC symbols -- NO migration logic
- Toast on completion with summary

### Task 4.4.6: Integration and testing

- Export a template, import on fresh browser profile -- verify structure matches
- Export a full backup with custom images, import -- verify images display correctly
- Export from 3x3 grid, import on device set to 6x6 -- verify grid size changes
- Export in Spanish mode, import on English device -- verify language switches
- Import an invalid file -- verify error handling
- Import a file over 10MB -- verify rejection
- Import on a board with existing customizations -- verify replace warning and "Back Up First" button
- Import on a fresh install -- verify no replace warning
- Verify reward/schedule images are NOT included in export
- Verify usage data is NOT included in export
- Test file sizes: template under 100KB, full backup with images under 4MB
- Accessibility: all modals keyboard navigable, screen reader announces preview data
- Test on iOS Safari and Android Chrome file picker behavior

---

## Accessibility Considerations

- Export/Import buttons have clear labels and are keyboard accessible
- Export mode selection is keyboard navigable
- Preview modal content is screen reader accessible
- Progress indicator during export has aria-live="polite"
- File picker triggers correctly on assistive technology
- All touch targets 44px minimum
- Error and success toasts announced to screen readers

---

## Mobile-First Design

- Export modal: full-screen on phone, centered card on tablet
- Large tap targets for Template vs Full Backup selection
- Preview modal: scrollable if content exceeds screen
- File picker: native OS file picker (no custom UI needed)
- Progress indicator visible during image compression

---

## Review Notes

### Robert (Architecture)
- Export raw IndexedDB button objects, don't redesign schema -- INCORPORATED
- Enumerate all localStorage keys explicitly (EXPORTED_SETTINGS_KEYS) -- INCORPORATED
- Create reloadBoard() instead of calling init() to avoid migration collisions -- INCORPORATED
- Filter image keys to only include button images, not reward/schedule -- INCORPORATED
- Add minimum version check on import -- INCORPORATED

### Steve (Code Review)
- Process images sequentially, not in parallel (memory on low-end tablets) -- INCORPORATED
- Account for base64 ~33% size overhead in estimates -- INCORPORATED
- FileReader error handling with max file size check (10MB) -- INCORPORATED
- Add "Back Up First" button on import warning modal -- INCORPORATED
- Skip replace warning on empty board (fresh install) -- INCORPORATED

---

## Acceptance Criteria

- [ ] Export button visible in Settings panel (parent mode only)
- [ ] Two export modes: Template and Full Backup
- [ ] Template export produces a file under 100KB
- [ ] Full Backup compresses images to 512x512 JPEG at 80% quality
- [ ] Full Backup with 20 custom images produces a file under 4MB
- [ ] Exported file has .aacboard extension
- [ ] Import button visible in Settings panel (parent mode only)
- [ ] Import rejects files over 10MB with clear toast
- [ ] Import validates file format and version before showing preview
- [ ] Invalid files show a clear error toast
- [ ] Preview shows board name, word count, grid size, folder count, image count
- [ ] "Back Up First" button on import warning triggers inline backup export
- [ ] Warning skipped on fresh install (no existing data)
- [ ] Import replaces all buttons, folders, images, and settings
- [ ] Custom images survive the full export-import round trip
- [ ] ARASAAC symbols re-download after import (not bundled in export)
- [ ] Grid size, voice, sensory, and language settings transfer correctly
- [ ] Usage data, reward tracker, and schedule data are NOT included in export
- [ ] Reward/schedule images are NOT included in export
- [ ] reloadBoard() re-renders without running migrations
- [ ] Works on iOS Safari and Android Chrome
- [ ] All modals keyboard accessible and screen reader friendly
- [ ] Touch targets 44px minimum
