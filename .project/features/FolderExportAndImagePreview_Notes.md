# Folder Export & Image Preview - Implementation Notes

## Current Status: IMPLEMENTING -- all phases complete, awaiting validation

## Checklist

### Phase A: Tile Image Preview (Long-Press to Enlarge)
- [x] A1: Overlay/modal markup and CSS (z-index 210, fade-in, reduced-motion aware)
- [x] A2: Long-press detection on grid tiles (kid mode triggers preview, parent mode keeps existing behavior)
- [x] A3: Overlay display and dismissal logic (tap anywhere, Escape key, 3s auto-dismiss, blob URL cleanup)
- [x] A4: Conflict handling with early learner quick-swap (parent mode unchanged, kid mode = preview)

### Phase B: Single Folder Export
- [x] B1: Export button in folder header (blue share icon in message bar, parent mode + inside folder only)
- [x] B2: buildFolderExportData() function (collects folder buttons + images, compresses, v2 format)
- [x] B3: Wire to download/share flow (triggerExportDownload helper, Web Share API + fallback)

### Phase C: Multi-Folder Bulk Export
- [x] C1: "Export Folders" button in Settings > Data section
- [x] C2: Folder selection UI (grid cards, tap-to-select, checkmark badge, Select All / Clear)
- [x] C3: buildMultiFolderExportData uses buildFolderExportData with multiple IDs
- [x] C4: Progress bar during image compression, triggerExportDownload for share/download

### Phase D: Folder Import (Merge)
- [x] D1: v2 format detection (routes "folder"/"folders" exportMode to showFolderImportPreview)
- [x] D2: Folder import preview UI with per-folder conflict resolution (Replace / Keep Both / Skip)
- [x] D3: applyFolderImport() function (handles all three conflict modes, preserves existing data)
- [x] D4: Success feedback (toast with folder count)

## Architecture Decisions
- Export format bumped to v2 (CURRENT_EXPORT_VERSION = 2)
- v1 imports still work (backward compatible -- only folder/folders modes route differently)
- triggerExportDownload() extracted as shared helper for all export paths
- Folder export includes the folder button itself (home screen tile) plus all child buttons
- "Keep Both" conflict resolution appends numeric suffix to folder ID and label
- Image preview only activates on tiles with custom images (isCustomImage check)

## Issues and Resolutions
(none yet)

## Validation Progress
- [ ] Test long-press image preview in kid mode (standard grid)
- [ ] Test long-press does NOT trigger preview in parent mode (should open edit/word picker)
- [ ] Test single folder export from folder header button
- [ ] Test bulk folder export from Settings
- [ ] Test importing folder file into empty board
- [ ] Test importing folder file with conflict resolution (Replace, Keep Both, Skip)
- [ ] Test v1 format import still works
- [ ] Test on mobile device (touch, share sheet)
- [ ] Bump sw.js cache version before deploy
