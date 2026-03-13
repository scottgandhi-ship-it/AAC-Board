# Entertainment & Food Vocabulary Expansion - Notes

## Status: IMPLEMENTED -- awaiting device testing

## Implementation Checklist

### Phase 1: Entertainment Folder + Words
- [x] Add folder-entertainment to all grid folder arrays (3x3, 4x4, 5x5, 6x6, DEFAULT_BUTTONS)
- [x] Add 18 entertainment words to DEFAULT_BUTTONS
- [x] Add Spanish translations (labels + symbolKeywords)
- [x] Add noun genders
- [x] Add to THREE_BY_THREE_FOLDERS and FOUR_BY_FOUR_FOLDERS sets
- [x] Add Screen Time activity bundle with core words (I, want, don't want, more, help)
- [x] Add folder icon and button icons

### Phase 2: Food Expansion
- [x] Add 31 new food words to DEFAULT_BUTTONS (7 fruits, 8 vegetables, 8 snacks, 8 meals)
- [x] Positions numbered 25-55 (after existing 0-24)
- [x] Add Spanish translations (labels + symbolKeywords)
- [x] Add noun genders
- [x] Add button icons

### Phase 3: Custom Shows Input
- [x] Add Show button renders in Entertainment folder (parent mode only)
- [x] Modal UI with text input + type selector (TV Show / Movie / YouTube)
- [x] IndexedDB storage for custom shows (saved as regular button objects)
- [x] Render custom shows in Entertainment folder after default words
- [x] Delete via existing parent mode long-press -> edit modal -> Delete button
- [x] TTS works automatically (speaks the show label)

### Phase 4: Cache + Deploy
- [x] Bump sw.js cache version to v48
- [ ] Device testing
- [ ] Verify offline support

## Issues & Resolutions

(none)

## Validation Progress

- Implementation committed 2026-03-13
- Awaiting device testing
