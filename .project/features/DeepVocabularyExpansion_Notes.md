# Deep Vocabulary Expansion -- Notes

## Current Status
DONE -- validated and approved 2026-03-07

## Context
P0 feature for Phase 2 (Enhance). Expand from 283 to 415+ communication words.
6 new folders, ~132 new words, spanning 11 subphases.

## Implementation Checklist

- [x] Subphase 1: New Folder Infrastructure (Animals, Descriptors, Time, Where, Nature, School)
- [x] Subphase 2: Animals Vocabulary (18 words: dog, cat moved from People + 16 new)
- [x] Subphase 3: Descriptors Vocabulary (26 words)
- [x] Subphase 4: Time Vocabulary (15 words)
- [x] Subphase 5: Where/Prepositions Vocabulary (14 words)
- [x] Subphase 6: Nature/Weather Vocabulary (14 words)
- [x] Subphase 7: School Vocabulary (14 words)
- [x] Subphase 8: Expand Existing Folders (Actions +18, Body +10, Drinks +4, People -2/+5)
- [x] Subphase 9: Prediction Chain Updates (expanded PREDICTIONS, DEFAULT_NOUN_IDS)
- [x] Subphase 10: Spanish Translations (labels + symbolKeywords for all new words)
- [x] Subphase 11: ARASAAC Symbol Mapping (SYMBOL_KEYWORDS + BUTTON_ICONS for all new words)
- [x] Robert architecture review (FOLDER_ICONS, BUTTON_ICONS, migration in init())
- [x] Steve code review
- [x] Validation (Lighthouse, mobile testing, accessibility)

## Changes Made

### Subphase 1 (prior session)
- Added 6 new folder CSS color rules
- Added 6 folder entries to DEFAULT_BUTTONS (positions 16-21)
- Swapped Places for Animals in 3x3 grid
- Updated THREE_BY_THREE_FOLDERS Set

### Subphases 2-8
- Removed ppl-dog and ppl-cat from People folder, resequenced positions
- Added 5 new People: aunt, uncle, cousin, neighbor, therapist
- Added 18 new Actions: chase, hide, find, catch, tickle, climb, dig, pour, blow, say, tell, show, ask, cook, taste, cut, stir, bite
- Added 10 Body self-care: wash hands, brush teeth, go potty, take a bath, get dressed, put on, take off, dry off, comb hair, flush
- Added 4 Drinks: grape juice, strawberry milk, tea, soda
- Added Animals folder: 18 words (dog/cat moved + 16 new)
- Added Descriptors folder: 26 words
- Added Time folder: 15 words
- Added Where folder: 14 words
- Added Nature folder: 14 words
- Added School folder: 14 words

### Subphases 9-11
- Expanded PREDICTIONS with chains for act-eat, act-drink, act-play, act-read, gen-go, gen-look, time-first, time-then, where-in, where-on
- Added ani-bunny, ani-dinosaur, toy-bubbles, toy-ball to DEFAULT_NOUN_IDS
- Added Spanish labels and symbolKeywords for all ~132 new words
- Added BUTTON_ICONS for all new words
- Added FOLDER_ICONS for 6 new folders
- Added SYMBOL_KEYWORDS for all new words

### Architecture (Robert review)
- Added existing-user migration in init(): auto-adds new vocabulary and moves dog/cat to Animals folder
- All new folder/button data consistent across DEFAULT_BUTTONS, BUTTON_ICONS, FOLDER_ICONS, SYMBOL_KEYWORDS, LANG_ES

## Word Count Verification
- Communication words (excl numbers/letters): 415
- Total with numbers/letters: 541
- Folders: 22 (16 original + 6 new)

## Issues and Resolutions
- Dog/cat duplicate IDs avoided by reusing ppl-dog and ppl-cat IDs in Animals folder
- People folder resequenced after dog/cat removal

## Validation Progress
PASSED -- device tested and approved 2026-03-07
