# Guided Vocabulary Stories -- Notes

## Status: PLANNING -- awaiting approval

## Implementation Checklist

### Phase A: Step Vocabulary Data Layer
- [ ] A1: Define STEP_VOCAB_MAP for all 19 activity templates (per-step word lists + modeling prompts)
- [ ] A2: Spanish prompts (promptEs) for all entries
- [ ] A3: stepVocabForActivity() helper -- returns word objects from VOCAB_WORD_POOL per step
- [ ] A4: generateStepVocab() helper -- auto-generates per-step words for custom activities
- [ ] A5: generateModelingPrompt() helper -- auto-generates prompts for custom activities

### Phase B: Guided Mode UI
- [ ] B1: Guided overlay HTML (step display, word chips, prompt, navigation, dots)
- [ ] B2: CSS for guided overlay
- [ ] B3: Step navigation JS (prev/next, dots, keyboard)
- [ ] B4: Word chip tap-to-speak
- [ ] B5: "Start Guide" button on activity banner
- [ ] B6: "Exit Guide" button
- [ ] B7: Step progress persistence per session

### Phase C: Custom Story Guided Mode
- [ ] C1: Auto-generate step vocab from walkthrough steps
- [ ] C2: Auto-generate modeling prompts
- [ ] C3: Cache step vocab with activity
- [ ] C4: "Edit Steps" in guided mode for custom activities
- [ ] C5: Spanish prompt generation for custom

### Phase D: Polish and Accessibility
- [ ] D1: Sensory step flags
- [ ] D2: Screen reader support (ARIA live)
- [ ] D3: Swipe navigation
- [ ] D4: Step-level usage insights
- [ ] D5: Guided mode for routines

## Architecture Decisions
(pending approval)

## Issues & Resolutions
(none yet)

## Session Log
- 2026-03-15: Plan created after Marci (clinical) and Reggie (parent) consultation, awaiting approval
