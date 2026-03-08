# Sensory/Regulation Words -- Notes

## Current Status
DONE -- implemented 2026-03-08

## Context
P0 feature for Phase 2. Added 18 sensory/regulation words in new "I Feel" folder.
Body states (hungry, thirsty, hot, cold, etc.) and coping strategies (need squeeze, deep breath, etc.).

## Implementation Checklist

- [x] Subphase 1: Folder infrastructure (folder-senses, grid visibility, CSS, icons)
- [x] Subphase 2: 18 vocabulary words (10 body states + 8 coping requests)
- [x] Subphase 3: ARASAAC symbols + BUTTON_ICONS
- [x] Subphase 4: Spanish translations (LANG_ES labels + symbolKeywords)
- [x] Subphase 5: Prediction chains (sensory states -> coping strategies)
- [x] Subphase 6: Existing user migration (handled by getTemplate comparison in init)

## Changes Made

### Folder Infrastructure
- Added folder-senses to DEFAULT_BUTTONS (position 22)
- Added to HOME_GRID_3X3_FOLDERS (position 9), HOME_GRID_4X4_FOLDERS (position 16), HOME_GRID_5X5_FOLDERS (position 22)
- Added 'senses' to THREE_BY_THREE_FOLDERS and FOUR_BY_FOUR_FOLDERS sets
- Added FOLDER_ICONS entry: thermometer emoji
- Label: "I Feel", Color: blue (Fitzgerald descriptors)

### Vocabulary (18 words)
- Body states (blue): hungry, thirsty, hot, cold, tight, shaky, too fast, too close, too much (red), stinky
- Coping requests (green): need squeeze, need quiet, need space, want hug, want blanket, cover ears, close eyes, deep breath

### Supporting Data
- BUTTON_ICONS: emoji for all 18 words
- SYMBOL_KEYWORDS: search terms for ARASAAC
- LANG_ES labels: Spanish translations for all 18 words
- LANG_ES symbolKeywords: Spanish search terms for ARASAAC
- PREDICTIONS: 6 chains connecting sensory states to coping strategies

## Word Count Update
- Communication words: 415 + 18 = 433

## Issues and Resolutions
- 3x3 grid now shows 11 folders (was 9). CSS grid wraps to 4 rows automatically.

## Validation Progress
(awaiting device testing)
