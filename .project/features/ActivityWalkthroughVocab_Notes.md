# Activity Walkthrough & Smart Vocabulary Surfacing -- Notes

## Status: IN PROGRESS -- Phase C complete, Phase D next

## Implementation Checklist

### Phase A: Vocabulary Graph Data Layer
- [x] A1: Define VOCAB_WORD_POOL (170+ words with Fitzgerald colors, icons, Spanish, symbolKw)
- [x] A2: Define ACTIVITY_TEMPLATES (19 activities with categorized vocabulary and keywords)
- [x] A3: Define WORD_EXPANSION map (45+ keyword expansion mappings)
- [x] A4: Define PARENT_SYNONYMS map (40+ casual language mappings)
- [x] A5: All 13 existing ACTIVITY_BUNDLES mapped in ACTIVITY_TEMPLATES
- [x] A6: 6 new activity bundles added (Swimming, Haircut, Teeth Brushing, Playdate, Morning Routine, Therapy Session)
- [x] A6b: STARTER_WORDS entries for all 6 new bundles
- [x] A6c: ACTIVITY_KEYWORD_MAP entries for all 6 new bundles
- [x] A6d: Removed redundant EXTRA_SUGGESTION_WORDS and EXTRA_KEYWORD_MAP (swimming/haircut are now proper bundles)
- [x] Helper functions: walkthroughSurfaceWords(), categorizeWalkthroughWords(), matchWalkthroughToTemplate()
- [x] JS syntax validated

### Phase B: Parent Walkthrough UX
- [x] B1: Walkthrough section in Create Activity modal (toggle button, step inputs, surface button)
- [x] B2: Quick Start path (enhanced name-based suggestions using walkthroughSurfaceWords)
- [x] B3: Guided Walkthrough path (step-by-step description, 3 initial steps, add/remove, max 10)
- [x] B4: Keyword extraction wired to walkthroughSurfaceWords() from step inputs
- [x] B5: Vocabulary suggestion review screen with categorized display (core/actions/things/descriptors/social)
- [x] B6: Word toggle UI (individual chip toggle, Add All button, integrates with selected words)
- [x] B7: Save walkthrough metadata (steps, template match) with custom activity
- [x] B8: Spanish language support (all labels, buttons, toasts, category names, word display)

### Phase C: Smart Surfacing & Position Stability
- [x] C1: Max activity words increased from 32 to 64 (all 5 cap checks updated)
- [x] C2: Position allocation algorithm (deterministic hash-based, persisted to localStorage per activity)
- [x] C3: renderGrid() integration (position allocation for custom activities, adaptive column scaling for large word sets)
- [x] C4: Vocabulary level support (core words always get starter tier, smart tier assignment on save)
- [x] C5: Early learner grid integration (starter filtering feeds into slot slicing, existing long-press override preserved)

### Phase D: Enhanced Activity Management
- [ ] D1: Edit walkthrough
- [ ] D2: Duplicate activity
- [ ] D3: Export/import templates
- [ ] D4: Usage insights integration

## Architecture Decisions
- VOCAB_WORD_POOL: flat object keyed by word label, not nested graph
- WORD_EXPANSION: simple keyword -> related words map, one-hop only
- ACTIVITY_TEMPLATES: separate from ACTIVITY_BUNDLES, used by walkthrough only
- ACTIVITY_BUNDLES: unchanged format, 6 new entries added directly
- Removed EXTRA_SUGGESTION_WORDS/EXTRA_KEYWORD_MAP -- swimming and haircut are now proper bundles
- walkthroughSurfaceWords() scoring: core words +1.5, direct match +1.0, expansion +0.7, template match +0.6
- Position allocation: hash-based deterministic positions per activity, saved to localStorage as aac-activity-positions-{id}
- Existing words keep positions when activity is edited; new words fill empty slots
- Grid columns scale adaptively: <=9 words -> 3col, <=16 -> 4col, <=30 -> 5col, >30 -> 6col
- Max activity words: 64 (up from 32)

## Issues & Resolutions
(none yet)

## Session Log
- 2026-03-15: Plan created, awaiting approval
- 2026-03-15: Phase A complete -- vocabulary graph, 19 activity templates, expansion map, synonyms, helper functions
- 2026-03-15: Phase B complete -- walkthrough toggle, step inputs, surface words, categorized review, word toggles, Add All, Quick Start enhanced suggestions, walkthrough metadata saved with activity, full Spanish support, cache v53
- 2026-03-15: Phase C complete -- position allocation algorithm, renderGrid integration, adaptive grid columns, max words 64, smart starter tier assignment, cache v54
