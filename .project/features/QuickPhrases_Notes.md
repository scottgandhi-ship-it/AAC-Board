# Quick Phrases -- Notes

## Current Status
DONE -- implemented 2026-03-08

## Context
P0 feature for Phase 2. Added 15 pre-built quick phrases that auto-speak on tap.
Urgent communication (potty, pain, fear), requests, social, and regulation phrases.

## Implementation Checklist

- [x] Subphase 1: Folder infrastructure (folder-quick, grid visibility, CSS, icons)
- [x] Subphase 2: 15 phrase buttons (5 urgent, 5 requests, 3 social, 2 regulation)
- [x] Subphase 3: Auto-speak behavior (tap handler conditional for folderId === 'quick')
- [x] Subphase 4: Visual distinction CSS (dashed border for quick-phrase class)
- [x] Subphase 5: ARASAAC symbols + BUTTON_ICONS
- [x] Subphase 6: Spanish translations (LANG_ES labels + symbolKeywords)
- [x] Subphase 7: Existing user migration (handled by getTemplate comparison in init)

## Changes Made

### Folder Infrastructure
- Added folder-quick to DEFAULT_BUTTONS (position 23)
- Added to HOME_GRID_3X3_FOLDERS (position 10), HOME_GRID_4X4_FOLDERS (position 17), HOME_GRID_5X5_FOLDERS (position 23)
- Added 'quick' to THREE_BY_THREE_FOLDERS and FOUR_BY_FOUR_FOLDERS sets
- Added FOLDER_ICONS entry: speech bubble emoji
- Label: "Quick Phrases", Color: pink (social/communication)

### Phrase Buttons (15 phrases)
- Urgent (red): I need to go potty, my tummy hurts, I don't like that, stop it, I'm scared
- Requests (green): can I have more, help me please, I want that, I'm all done, I want to go home
- Social (pink): thank you, I love you, play with me
- Regulation (blue): I need a break, it's too loud

### Auto-Speak Behavior
- Modified createCell tap handler: when folderId === 'quick', phrase speaks immediately
- Message bar shows the full phrase (replaces any existing message)
- No need to tap "speak" button -- fires automatically
- Usage tracking logs the tap as normal

### Visual Distinction
- Added .cell.quick-phrase CSS class with dashed border
- Applied via classList in createCell when folderId === 'quick'

### Supporting Data
- BUTTON_ICONS: meaning-based emoji for all 15 phrases
- SYMBOL_KEYWORDS: English search terms for ARASAAC
- LANG_ES labels: Full Spanish phrase translations
- LANG_ES symbolKeywords: Spanish search terms for ARASAAC

## Word Count Update
- Communication words: 433 + 15 = 448

## Issues and Resolutions
- Auto-speak replaces message bar content rather than appending (phrases are complete sentences)

## Validation Progress
(awaiting device testing)
