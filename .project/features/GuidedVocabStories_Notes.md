# Guided Vocabulary Stories -- Notes

## Status: COMPLETE -- All 4 phases done (A/B/C/D)

## Implementation Checklist

### Phase A: Step Vocabulary Data Layer
- [x] A1: STEP_VOCAB_MAP defined for all 19 activity templates (3-5 words per step + modeling prompts)
- [x] A2: Spanish prompts (promptEs) for all 19 activities
- [x] A3: stepVocabForActivity() returns word objects from VOCAB_WORD_POOL per step
- [x] A4: generateStepVocab() auto-generates per-step words for custom activities via walkthroughSurfaceWords
- [x] A5: generateModelingPrompt() auto-generates prompts from step text + word labels

### Phase B: Guided Mode UI
- [x] B1: Guided overlay HTML (step name, word chips, prompt, nav arrows, dots, sensory note)
- [x] B2: CSS for guided overlay (Fitzgerald Key word colors, calm design, 48px touch targets)
- [x] B3: Step navigation JS (prev/next buttons, dot click, keyboard accessible)
- [x] B4: Word chip tap-to-speak (addWordToMessage + speak)
- [x] B5: "Guide" button on activity banner (shown when guided steps available)
- [x] B6: "Full Board" exit button returns to grid
- [x] B7: Step progress persistence (localStorage per activity)

### Phase C: Custom Story Guided Mode
- [x] C1: getGuidedSteps() auto-generates step vocab from walkthrough steps
- [x] C2: generateModelingPrompt() creates prompts from surfaced words
- [x] C3: stepVocab cached via activity.stepVocab field
- [x] C4: Custom activities with walkthrough.steps get guided mode automatically
- [x] C5: Spanish support via walkthroughSurfaceWords labelEs and prompt generation

### Phase D: Polish and Accessibility
- [x] D1: Sensory step flags (sensory: true in STEP_VOCAB_MAP, orange note displayed)
- [x] D2: ARIA live region on overlay (aria-live="polite", aria-label on all buttons)
- [x] D3: Swipe navigation (touchstart/touchend, 50px threshold, horizontal bias)
- [x] D4: Step-level usage tracking (guidedStep field in usage events)
- [x] D5: Guided mode for routines (startActivity resets guided mode per activity)

## Architecture Decisions
- STEP_VOCAB_MAP: flat object keyed by activity ID -> step name -> { words, prompt, promptEs, sensory }
- getGuidedSteps(): single entry point that handles both built-in and custom activities
- Built-in activities use STEP_VOCAB_MAP directly; custom use walkthroughSurfaceWords per step
- Guided overlay sits inside grid-container, hides grid when active, preserves activity banner
- Step persistence: localStorage key aac-guided-step-{activityId}
- Word taps in guided mode record guidedStep in usage events for step-level analytics

## Issues & Resolutions
(none)

## Session Log
- 2026-03-15: Plan created after Marci (clinical) and Reggie (parent) consultation
- 2026-03-15: All 4 phases implemented -- STEP_VOCAB_MAP (19 activities, Spanish), guided overlay UI, custom story support, sensory flags, swipe nav, step-level insights, cache v56
