# Symbol Library - Implementation Notes

## Current Status
IMPLEMENTED -- awaiting device testing

## Implementation Checklist

### Phase 2A: Symbol Mapping and Auto-Download
- [x] Task 2A.1: Create ARASAAC keyword map (SYMBOL_KEYWORDS) -- ~150 buttons mapped
- [x] Task 2A.2: Symbol fetch and cache engine (searchArasaac, fetchSymbolBlob)
- [x] Task 2A.3: Auto-download on first online load (background, batched, with progress)
- [x] Task 2A.4: Verify createCell() works with cached symbols (uses existing loadImage)

### Phase 2B: Symbol Picker in Edit Modal
- [x] Task 2B.1: Add "Browse Symbols" button to edit modal
- [x] Task 2B.2: Symbol search overlay with ARASAAC API (debounced, grid results)
- [ ] Task 2B.3: Offline symbol search from cache (deferred -- requires symbolMeta store)

### Phase 2C: Polish and Edge Cases
- [x] Task 2C.1: Handle API failures gracefully (catch errors, skip failed symbols)
- [x] Task 2C.2: Cache management (re-download button in settings)
- [x] Task 2C.3: Respect custom photos (markAsCustomImage tracking)

## Issues and Resolutions
(none)

## Validation Progress
- [ ] Verify auto-download starts on first load with internet
- [ ] Verify symbols display on grid buttons after download
- [ ] Verify Browse Symbols search works in edit modal
- [ ] Verify custom photos not overwritten by auto-download
- [ ] Verify re-download button works in settings
- [ ] Test on mobile device
