# Social Stories - Implementation Notes

## Current Status: Implemented -- awaiting validation

## Checklist

### Phase A: Data Layer and DB Migration
- [x] A1: DB schema upgrade (v1 -> v2, socialStories store)
- [x] A2: CRUD helpers (saveStory, loadStories, loadStory, deleteStory, markStoryRead, generateId)
- [x] A3: Built-in templates data (8 templates with personalization tokens)

### Phase B: Stories List View
- [x] B1: Tab bar integration (Stories tab with book icon, wired into switchTab)
- [x] B2: Stories list UI (card grid with cover image, title, read count, edit/delete in parent mode)
- [x] B3: Stories list CSS (responsive 2-col / 3-col grid, empty state)

### Phase C: Story Reader (Full-Screen)
- [x] C1: Reader overlay HTML/CSS (full-screen, image 60% / text 40%, cream background, dots, nav arrows)
- [x] C2: Reader interaction JS (swipe + tap arrows, slide transitions, reduced motion support, read count)
- [x] C3: TTS narration (speak button per page, uses existing TTS system, respects quiet mode)

### Phase D: Story Editor (Wizard)
- [x] D1: Template picker (grid of 8 templates, start from scratch option)
- [x] D2: Story setup step (title, child name, parent name, person mode toggle)
- [x] D3: Page editor (image upload/remove, text input, sentence type selector, word count, ratio bar)
- [x] D4: Preview (opens reader in preview mode) and save to IndexedDB

### Phase E: Stock Images
- [x] E1: 30+ SVGs for all 8 template scenarios plus shared feelings/coping illustrations

### Phase F: Integration
- [x] F1: Offline (all IndexedDB, no network needed)
- [x] F2: Reset defaults clears STORE_STORIES and re-inits
- [x] F3: TTS voice, reduced motion, quiet mode all apply to reader

## Issues and Resolutions

(none yet)

## Validation Progress

- [ ] Stories tab appears in tab bar
- [ ] Empty state shows when no stories exist
- [ ] Template picker opens from "New Story" button (parent mode)
- [ ] Templates create personalized stories with child name
- [ ] Editor wizard flow: setup -> pages -> preview -> save
- [ ] Photo upload per page works
- [ ] Sentence type selection and ratio bar update correctly
- [ ] Reader opens full-screen with image + text
- [ ] Swipe and tap arrows navigate pages
- [ ] Page indicator dots update
- [ ] "Read Again" appears on last page
- [ ] TTS speak button reads page text
- [ ] Read count increments and displays on card
- [ ] Edit and delete story cards work in parent mode
- [ ] Reduced motion preference affects page transitions
- [ ] Reset all to defaults clears stories
- [ ] Works offline
