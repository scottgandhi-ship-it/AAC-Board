# Auto-Generated Social Stories -- Notes

## Status: COMPLETE -- All 4 phases done (A/B/C/D)

## Implementation Checklist

### Phase A: Generation Engine
- [x] A1: SENSORY_TRIGGERS constant (auditory, tactile, visual, vestibular with keywords + preparation text)
- [x] A2: EMOTION_CUES constant (medical, social, routine_change, separation, sensory with keywords, feelings, coping)
- [x] A3: STEP_IMAGE_HINTS constant (40+ keyword to stock SVG key mappings)
- [x] A4: detectSensory() function -- scans step text for sensory trigger keywords
- [x] A5: inferEmotion() function -- scores all steps against emotion cue keywords, returns best match
- [x] A6: matchStockImage() function -- matches page text to STORY_SVGS stock keys
- [x] A7: generateStoryFromSteps() function -- converts steps to pages with sentence types, sensory prep, feelings, coping, closing
- [x] A8: Word limit splitting integration -- auto-splits pages over soft limit, caps at 12 pages

### Phase B: Step Input UI
- [x] B1: editor-step-describe HTML (step list, add button, create story button, advanced wizard link)
- [x] B2: CSS for step input (describe-step-list, describe-step-item, describe-step-num, describe-step-input, etc.)
- [x] B3: Step input JS (add/remove steps, min 3 / max 8, rotating labels)
- [x] B4: Setup screen "Next" routes to describe steps for new stories (replaces direct helper)
- [x] B5: "Create Story" button calls generateStoryFromSteps() and transitions to page editor
- [x] B6: Auto-title not implemented (title required on setup screen already)

### Phase C: Template Integration
- [x] C1: TEMPLATE_STEPS for all 8 existing templates (pre-written step sequences)
- [x] C2: createStoryFromTemplate() now stores pendingTemplateSteps and creates empty-page story
- [x] C3: openDescribeSteps() checks for pendingTemplateSteps and pre-fills inputs
- [x] C4: Parent can edit/add/remove pre-filled template steps before generating

### Phase D: Polish and Edge Cases
- [x] D1: Step input draft persistence (saveDescribeStepsDraft/loadDescribeStepsDraft/clearDescribeStepsDraft)
- [x] D2: Empty/short step handling (filters steps with < 2 chars, requires min 3 valid steps)
- [x] D3: Draft cleared on successful save
- [x] D4: "Use detailed wizard instead" button routes to existing Story Helper
- [x] D5: Back navigation handles describe step screen (saves draft, returns to setup)
- [x] D5: openStoryEditor hides describe and helper steps on open
- [x] D6: pendingTemplateSteps reset on non-template editor opens

## Architecture Decisions
- Describe steps is the new default path (setup -> describe -> page editor)
- Existing Story Helper wizard kept as "advanced" fallback via link
- SENSORY_TRIGGERS: flat object keyed by category, each with keywords array + prep text with personalization tokens
- EMOTION_CUES: scored by keyword match count, best match wins, fallback to routine_change
- STEP_IMAGE_HINTS: simple keyword -> stock SVG key lookup, first match wins
- generateStoryFromSteps(): descriptive pages from steps, sensory prep pages auto-inserted, then feelings + coping + affirmative ending
- Templates now pre-fill describe step inputs instead of generating fixed pages
- Draft persistence uses localStorage key gs-story-draft-steps
- Cache bumped to v10

## Issues and Resolutions
(none)

## Session Log
- 2026-03-15: Plan created after Marci (clinical) and Reggie (parent) consultation
- 2026-03-15: All 4 phases implemented -- generation engine (sensory/emotion/image detection), step input UI, template integration, draft persistence, cache v10
