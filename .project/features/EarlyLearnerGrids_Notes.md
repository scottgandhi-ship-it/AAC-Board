# Early Learner Grids - Implementation Notes

## Current Status: IMPLEMENTING -- Core grids working, two items remaining

## Checklist

### Phase A: Data Model and Grid Infrastructure
- [x] A1: Update getGridSize() to accept 1 and 2
- [x] A2: Update setGridSize() to handle grid-1 and grid-2 classes
- [x] A3: Add CSS for body.grid-1 and body.grid-2
- [x] A4: Hide core-word-strip at grid-1 and grid-2
- [x] A5: Update getTemplate() for size 1 and 2 (via getEarlyLearnerTemplate)
- [x] A6: Add localStorage keys for explorer/chooser selections

### Phase B: Word Picker UI
- [x] B1: Build word picker modal (HTML + CSS + JS)
- [x] B2: Implement selection logic with max enforcement
- [x] B3: Save selections and trigger re-render
- [x] B4: Add suggested starter sets for 2x2 (Basics, Requesting, Play)
- [x] B5: Accessibility for word picker (role, aria-selected, aria-label, focus)

### Phase C: Grid Rendering for 1x1 and 2x2
- [x] C1: Update renderGrid() for fixed row layout
- [x] C2: Render selected words as flat cells (via createCell)
- [x] C3: Empty state prompt when no words selected ("Pick Words" button)
- [x] C4: Speech output and visual feedback (uses existing delegated handlers)
- [x] C5: Large cell styling (1x1: 4-7rem icon, 2-3rem label; 2x2: 3-4.5rem icon, 1.4-2rem label)

### Phase D: Parent Mode Quick-Swap
- [x] D1: Override parent mode long-press at 1x1/2x2 to open word picker
- [x] D2: Single-word replacement flow (slot-based replacement)
- [x] D3: Suppress edit modal at these grid sizes (handled in startHold)

### Phase E: Grid Picker and Onboarding Updates
- [x] E1: Add Explorer/Chooser options to settings grid select
- [x] E2: Add Explorer/Chooser to onboarding grid picker
- [x] E3: Auto-open word picker on first selection of 1x1/2x2
- [x] E4: Spanish translations (grid.1x1, grid.2x2 + descriptions)
- [x] E5: Grid size change skips confirm dialog for early learner grids

### Phase F: Landscape and Polish
- [x] F1: Update LANDSCAPE_COL_MAP (1->1, 2->2)
- [ ] F2: Landscape layout for 1x1 -- needs device testing
- [ ] F3: Landscape layout for 2x2 -- needs device testing
- [ ] F4: Animation and transition polish -- needs device testing
- [ ] F5: Edge case handling (deleted words) -- needs testing

## Remaining Work

### 1. Activity Auto-Compact for Early Learner Grids -- DONE
- Slices activity word list to EARLY_LEARNER_SLOTS count (1, 2, or 4)
- Uses fixed grid layout (correct cols/rows) for early learner sizes
- Shows toast when words are truncated: "Showing N words for this activity to match your child's level"
- Activity words already have priority order so first N are the most clinically important

## Architecture Notes (for context resumption)
- Grid sizes: 1 (First Words), 21 (This or That), 2 (My Picks), 3-6 (standard)
- isEarlyLearnerGrid() checks size === 1 || size === 21 || size === 2
- EARLY_LEARNER_SLOTS = { 1: 1, 21: 2, 2: 4 }
- Slot-based rendering: empty slots show "+" / "Tap to pick" with click-to-fill
- Word picker: getPickerWords() deduplicates by label for display, getAllVocabWords() keeps full list for rendering
- Storage: aac-early-words-{size} in localStorage (JSON array of word IDs)
- CSS classes: body.grid-1, body.grid-21, body.grid-2 (hide core strip, fixed rows/cols)
- Parent mode long-press on filled slot opens word picker for single-slot swap
- Names: First Words, This or That, My Picks, Let's Talk, More to Say, Big Talker, Chatterbox
- Spanish translations added for all names

## Issues and Resolutions
- FIXED: Preset word IDs were wrong (used general-yes instead of t-yes)
- FIXED: HOME_GRID_6X6_EXTRAS not included in getAllVocabWords()
- FIXED: Label dedup in getAllVocabWords() broke normal grid rendering (moved dedup to getPickerWords() only)
- FIXED: Multi-select word picker was confusing; replaced with slot-based tap-to-pick UX

## Validation Progress
(none yet)
