# Early Learner Grids (1x1 Explorer & 2x2 Chooser)

## Executive Summary

Add two new grid modes designed for early AAC learners: **Explorer (1x1)** and **Chooser (2x2)**. These modes are fundamentally different from the existing 3x3-6x6 grids -- they display a fixed number of flat words (no folders, no dynamic rows) that fill the entire screen. Parents and SLPs hand-pick which words appear from the full vocabulary. This addresses the critical gap where the app currently skips the two most foundational stages of AAC intervention: cause-and-effect learning and choice-making.

## Clinical Rationale (Marci)

- **1x1 (Explorer)**: Teaches cause and effect. Child learns "I touch this, something happens." Foundation of all intentional communication. Used with children 18mo-4yr who are brand new to AAC.
- **2x2 (Chooser)**: Teaches choice-making and discrimination. "Do you want YES or NO?" "STOP or GO?" SLPs live at this stage for weeks or months with early learners.
- Without these levels, SLPs may dismiss the app as "not for early learners," excluding the most critical demographic.
- Evidence-based alignment: LAMP, aided language stimulation, progressive vocabulary disclosure.

## Requirements

### R1: 1x1 Explorer Mode
- Exactly ONE button fills the entire grid area
- No folders, no navigation, no scrolling
- Parent/SLP selects the word from a vocabulary picker
- Big, immediate feedback on tap (speech output, visual highlight)
- Quick-swap capability in parent mode (change the word without leaving the screen)

### R2: 2x2 Chooser Mode
- Exactly FOUR buttons in a 2-column x 2-row layout filling the grid area
- No folders, no navigation, no scrolling
- Parent/SLP selects up to 4 words from a vocabulary picker
- Suggested starter sets: YES/NO/MORE/STOP, WANT/HELP/MORE/ALL DONE
- Quick-swap capability in parent mode

### R3: Core Word Strip Behavior
- **Hidden at 1x1 and 2x2 levels.** The selected words ARE the vocabulary. Showing 5 additional core words defeats the clinical purpose of limiting choices.
- Message bar remains visible (still speaks tapped words)

### R4: Word Picker UI
- Accessible from grid size selection (settings, onboarding, parent mode)
- Shows ALL vocabulary words across all folders (flat list, not folder hierarchy)
- Searchable by label
- Grouped by Fitzgerald Key color category for SLPs who think in categories
- Shows word icon/emoji + label + color
- Enforces max selection (1 for Explorer, 4 for Chooser)
- Remembers selections per grid level in localStorage

### R5: No Folder System
- At 1x1 and 2x2, the concept of folders does not exist
- getTemplate() returns only the selected flat words, not folder structures
- Home grid IS the only grid -- no folder navigation possible

### R6: Quick-Swap in Parent Mode
- When parent mode is active at 1x1 or 2x2, tapping a button opens a word picker instead of the edit modal
- SLPs need to rotate words mid-session without navigating to settings
- Flow: parent mode on -> tap button -> word picker opens -> select replacement -> button updates immediately

### R7: Suggested Starter Sets (2x2 only)
- Offer 2-3 preset word combinations when first selecting 2x2
- Presets:
  - "Basics": YES, NO, MORE, STOP
  - "Requesting": WANT, HELP, MORE, ALL DONE
  - "Play": GO, STOP, MORE, AGAIN
- Parent can accept a preset or pick custom words
- Presets use words already in the vocabulary (CORE_WORD_DEFS + folder contents)

### R8: Motor Planning Consistency
- If a word is placed at position top-left in 2x2, it should remain in the top-left region when the child graduates to 3x3
- Document recommended word-to-position mappings for clinical consistency
- This is advisory (parents can override), but defaults should follow motor planning best practices

### R9: Grid Picker / Onboarding Updates
- Add Explorer (1x1) and Chooser (2x2) as options in all grid size selectors
- Labels: "Explorer (1x1) -- Learning cause and effect" / "Chooser (2x2) -- Making choices"
- Spanish translations needed for labels and descriptions
- Onboarding should present these as the first options (they are the entry point for youngest users)

### R10: Landscape Behavior
- 1x1 landscape: still 1 button, fills landscape viewport
- 2x2 landscape: could expand to 2x2 or 4x1 depending on aspect ratio
- Core strip remains hidden at these levels in landscape

## Architecture Overview

### How This Differs from 3x3-6x6

| Aspect | 3x3 to 6x6 (Current) | 1x1 and 2x2 (New) |
|--------|----------------------|-------------------|
| Grid columns | Sets --grid-cols, rows grow dynamically | Fixed columns AND rows |
| Content | Template-based folders + core words | Hand-picked flat words only |
| Core strip | Always visible | Hidden |
| Folder navigation | Yes (tap folder -> see contents) | No folders exist |
| Configuration | Automatic from getTemplate() | Manual via word picker |
| Row count | Unlimited (scrolls if needed) | Fixed: 1 row (1x1) or 2 rows (2x2) |

### Data Model

**Selected words storage** (localStorage):
- Key: aac-explorer-word (string, single button ID for 1x1)
- Key: aac-chooser-words (JSON array of up to 4 button IDs for 2x2)

**No changes to existing button data model.** Selected words reference button IDs from the existing vocabulary (DEFAULT_BUTTONS + folder contents).

### Key Code Changes

**getGridSize() / setGridSize()**:
- Accept values 1 and 2 in addition to 3-6
- setGridSize(1) sets --grid-cols to 1, adds body class grid-1
- setGridSize(2) sets --grid-cols to 2, adds body class grid-2

**getTemplate(size)**:
- size === 1: Return array with single selected word (from localStorage)
- size === 2: Return array with up to 4 selected words (from localStorage)
- No folder contents included at these sizes

**renderGrid()**:
- Detect grid size 1 or 2
- Hide core-word-strip
- Set grid-template-rows explicitly (1fr for 1x1, repeat(2, 1fr) for 2x2)
- Render selected words as flat cells (no folder logic)
- If no words selected yet, show word picker prompt

**New: renderWordPicker(maxSelections)**:
- Modal overlay similar to existing edit modal
- Lists all vocabulary words from DEFAULT_BUTTONS (excluding folders)
- Search/filter bar at top
- Fitzgerald Key color grouping
- Tap to select/deselect, enforces max count
- Confirm button saves to localStorage and re-renders grid

**New: CSS for grid-1 and grid-2**:
- body.grid-1 .cell: massive text, fills viewport
- body.grid-2 .cell: large text, generous padding
- body.grid-1 #core-word-strip, body.grid-2 #core-word-strip: display none
- Fixed grid-template-rows at these sizes

### Integration Points

- **Settings grid select**: Add 1x1 and 2x2 options
- **Onboarding grid picker**: Add 1x1 and 2x2 options
- **Spanish translations**: Add grid.1x1, grid.2x2 label/desc entries
- **Landscape handler**: Add entries to LANDSCAPE_COL_MAP (1->1, 2->2 or 2->4)
- **Parent mode**: Override long-press behavior at 1x1/2x2 to open word picker instead of edit modal
- **Service worker**: Bump cache version on deploy

## Task Breakdown

### Phase A: Data Model and Grid Infrastructure
- A1: Update getGridSize() to accept 1 and 2
- A2: Update setGridSize() to handle grid-1 and grid-2 classes
- A3: Add CSS for body.grid-1 and body.grid-2 (cell sizing, text scaling, fixed rows)
- A4: Hide core-word-strip at grid-1 and grid-2 via CSS
- A5: Update getTemplate() to return selected words for size 1 and 2
- A6: Add localStorage keys for explorer/chooser word selections
- **Acceptance**: Grid renders empty/placeholder state at 1x1 and 2x2 sizes

### Phase B: Word Picker UI
- B1: Build word picker modal (overlay, searchable word list, Fitzgerald color groups)
- B2: Implement selection logic (tap to toggle, enforce max count)
- B3: Save selections to localStorage, trigger re-render
- B4: Add suggested starter sets for 2x2 (preset buttons in picker)
- B5: Accessibility -- keyboard navigation, ARIA labels, focus management
- **Acceptance**: Parent can open picker, search/browse words, select, and see them on grid

### Phase C: Grid Rendering for 1x1 and 2x2
- C1: Update renderGrid() to detect size 1/2 and use fixed row layout
- C2: Render selected words as flat cells (no folder logic)
- C3: Show "pick your words" prompt when no words selected yet
- C4: Ensure speech output and visual feedback work at these sizes
- C5: Large cell styling -- text sizing, icon sizing, padding for 1x1 and 2x2
- **Acceptance**: 1x1 shows one full-screen button, 2x2 shows four large buttons, both speak on tap

### Phase D: Parent Mode Quick-Swap
- D1: Override long-press/tap behavior in parent mode at 1x1/2x2 to open word picker
- D2: Single-word replacement flow (tap button -> picker opens with that slot highlighted)
- D3: Ensure edit modal is NOT shown at these grid sizes (word picker replaces it)
- **Acceptance**: SLP can change words mid-session without navigating to settings

### Phase E: Grid Picker and Onboarding Updates
- E1: Add Explorer and Chooser options to settings grid select dropdown
- E2: Add Explorer and Chooser to onboarding grid picker
- E3: When selecting 1x1 or 2x2 for the first time, auto-open word picker
- E4: Spanish translations for all new labels and descriptions
- E5: Update grid size change warning text (no "resets buttons to defaults" for 1x1/2x2)
- **Acceptance**: User can select 1x1 or 2x2 from settings or onboarding, word picker opens, grid renders correctly

### Phase F: Landscape and Polish
- F1: Update LANDSCAPE_COL_MAP for sizes 1 and 2
- F2: Test and adjust landscape layout for 1x1 (single button, landscape proportions)
- F3: Test and adjust landscape layout for 2x2 (2x2 or 4x1 decision)
- F4: Animation and transition polish (popIn at these sizes, scale adjustments)
- F5: Edge cases -- what happens if selected word is deleted from vocabulary? Graceful fallback.
- **Acceptance**: Both modes look and feel correct in portrait and landscape on mobile devices

## Accessibility Considerations

- 1x1 button must be keyboard focusable and activatable
- 2x2 buttons must support tab navigation in reading order (left-right, top-bottom)
- ARIA labels on word picker modal, search input, selection state
- Color contrast maintained at large cell sizes
- Touch targets exceed 44x44px (they will be massive at these sizes)
- Screen reader announces selected word count in picker ("2 of 4 selected")

## Mobile-First Design Notes

- 1x1 cell should use nearly the full viewport height (minus message bar)
- 2x2 cells should each be approximately half-viewport in each dimension
- Text sizing at 1x1: emoji/icon should be very large (clamp 4rem+), label large (clamp 2rem+)
- Text sizing at 2x2: emoji/icon large (clamp 3rem+), label generous (clamp 1.5rem+)
- No scrolling at either size -- content must fit viewport

## Out of Scope

- Automatic graduation suggestions (e.g., "your child is ready for 2x2")
- Session logging or word rotation history
- Multi-page 1x1 (swipe to see next word) -- could be future enhancement
- Custom word creation (uses existing vocabulary only)
