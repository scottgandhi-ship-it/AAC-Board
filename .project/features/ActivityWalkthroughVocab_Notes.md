# Activity Walkthrough & Smart Vocabulary Surfacing -- Notes

## Status: IN PROGRESS -- Phase A complete, Phase B next

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
- [ ] B1: "New Activity" button in Activities tab
- [ ] B2: Quick Start path
- [ ] B3: Guided Walkthrough path
- [ ] B4: Keyword extraction engine
- [ ] B5: Vocabulary suggestion review screen
- [ ] B6: Word toggle UI
- [ ] B7: Save custom activity with graph data
- [ ] B8: Spanish language support

### Phase C: Smart Surfacing & Position Stability
- [ ] C1: Word scoring algorithm
- [ ] C2: Position allocation algorithm
- [ ] C3: renderGrid() integration
- [ ] C4: Vocabulary level support
- [ ] C5: Early learner grid integration

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

## Issues & Resolutions
(none yet)

## Session Log
- 2026-03-15: Plan created, awaiting approval
- 2026-03-15: Phase A complete -- vocabulary graph, 19 activity templates, expansion map, synonyms, helper functions
