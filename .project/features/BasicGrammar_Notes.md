# Basic Grammar - Implementation Notes

## Current Status
IMPLEMENTED -- awaiting device testing

## Implementation Checklist

### Phase 2A: Message Bar ID Tracking
- [x] Task 2A.1: Add messageButtonIds parallel array and update all call sites

### Phase 2B: Grammar Rules Engine
- [x] Task 2B.1: Word category detection (getWordCategory)
- [x] Task 2B.2: Plural rules (pluralize function + PLURAL_OVERRIDES)
- [x] Task 2B.3: Verb conjugation (VERB_FORMS + conjugateVerb)
- [x] Task 2B.4: Article insertion (optional, off by default)

### Phase 2C: Grammar Pipeline Integration
- [x] Task 2C.1: Create applyGrammar() function
- [x] Task 2C.2: Hook into speak pipeline
- [x] Task 2C.3: Settings toggles (grammar on/off per rule)

### Phase 2D: Double-Tap Plural
- [x] Task 2D.1: Detect double-tap on noun for plural

## Issues and Resolutions
(none)

## Validation Progress
- [ ] Test "more cookie" speaks "more cookies"
- [ ] Test "he want cookie" speaks "he wants cookie"
- [ ] Test article insertion when enabled
- [ ] Test double-tap noun pluralization
- [ ] Test grammar toggles persist across sessions
- [ ] Test on mobile device
