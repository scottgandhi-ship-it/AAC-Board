# Auto-Generated Social Stories (Step-Based Story Creation)

## Executive Summary

Replace the 6-step Story Helper wizard with a simpler, faster flow: parents describe what will happen in 3-8 sequential steps, and the system generates a complete, clinically structured social story. Parents review and customize page by page, adding photos of their actual environment. Full custom creation remains available but this becomes the primary path.

**Core insight**: Parents know WHAT will happen. They don't know HOW to write a therapeutic story about it. The system bridges that gap.

## Problem Statement

Current Story Helper wizard asks 6 separate questions (situation, scene, sequence, feelings, coping, ending). This is:
- Too many steps for a stressed parent at 10 p.m.
- Asks questions parents may not know how to answer ("What coping strategies?")
- Feels like filling out a clinical form, not describing their Tuesday
- Still produces stories that may need significant editing

The AAC Board walkthrough proved that step-based input is the fastest path to quality output. Apply the same pattern here.

## Clinical Foundation (Marci)

Carol Gray social story framework requires balanced sentence types:
- **Descriptive**: What happens, where, who is involved (2-5 per directive)
- **Perspective**: How the child or others might feel
- **Directive**: What the child can do (gentle suggestions, not commands)
- **Affirmative**: Reassurance and positive statements
- **Cooperative**: Who will help

Parents writing freehand typically over-index on directives ("You will sit still") and miss perspective sentences entirely. Auto-generation enforces the correct ratio while keeping language warm and natural.

**Sensory detection**: Steps mentioning sensory triggers (loud sounds, bright lights, touching, cutting, new textures) should automatically generate preparation language.

## Parent Value (Reggie)

- "Tell us what will happen" not "Create a social story" -- accessible language
- 2 minutes from start to reviewable draft
- Review step lets parents add real photos (their dentist's office, their school)
- Customization without anxiety -- edit freely, system handles structure
- Specific to their child's actual experience, not generic templates

---

## Architecture

### Input Flow

Parent provides (reusing existing editor-step-setup fields):
1. **Story title** (or auto-suggested from first step)
2. **Child's age** (existing age pills, drives word limits)
3. **Perspective** (existing first/third person toggle)
4. **Event steps** (3-8 sequential descriptions of what will happen)

The event steps replace the current 6-step wizard. Simple text inputs, one per step, with prompts like "What happens first?", "Then what?", "What happens next?"

### Generation Engine

New function `generateStoryFromSteps(steps, story)` that:

1. **Opening page** (descriptive): Sets the scene from step 1
   - "I am going to [event]. [Context from step 1]."

2. **For each step** (descriptive + selective enrichment):
   - Core descriptive page from step text
   - Sensory detection: scan for trigger keywords -> add preparation language
   - Emotional inference: detect new/scary/waiting moments -> add perspective sentence
   - Merge short adjacent steps onto same page when under word limit

3. **Feelings page** (perspective): Auto-generated based on event type
   - "I might feel [nervous/excited/unsure]. That is okay."
   - Inferred from step content (new experience, medical, social, etc.)

4. **Coping page** (directive + cooperative): Light suggestion
   - "If I feel worried, I can [squeeze my hands / take a deep breath / hold {parent}'s hand]."
   - "{parent} will be there to help me."

5. **Closing page** (affirmative): Positive wrap-up
   - "When it is all done, I did it! I can feel proud."

### Sensory Keyword Detection

Scan step text for keywords that indicate sensory moments:

    SENSORY_TRIGGERS = {
      auditory: ['loud', 'noise', 'buzz', 'beep', 'ring', 'siren', 'music', 'clippers', 'drill', 'alarm'],
      tactile: ['touch', 'poke', 'stick', 'cut', 'wash', 'brush', 'cold', 'wet', 'sticky', 'squeeze'],
      visual: ['bright', 'flash', 'dark', 'lights'],
      vestibular: ['spin', 'swing', 'ride', 'fast', 'high'],
      general: ['different', 'new', 'strange', 'unfamiliar', 'change']
    }

When detected, insert preparation language:
- Auditory: "It might be loud. That is okay. I can cover my ears if I need to."
- Tactile: "Someone might touch [area]. It might feel [cold/different]. It will not hurt."
- Visual: "The lights might be bright. I can close my eyes for a moment."

### Emotional Inference Map

Map event categories and keywords to likely emotions:

    EMOTION_CUES = {
      medical: { keywords: ['doctor', 'dentist', 'shot', 'checkup', 'hospital'], feeling: 'nervous', coping: 'squeeze hands' },
      social: { keywords: ['party', 'friends', 'new people', 'class', 'school'], feeling: 'shy or excited', coping: 'stay close to {parent}' },
      routine_change: { keywords: ['new', 'first time', 'different', 'move', 'change'], feeling: 'unsure', coping: 'take deep breaths' },
      separation: { keywords: ['drop off', 'leave', 'say goodbye', 'without'], feeling: 'worried', coping: '{parent} will come back' },
      sensory: { keywords: ['haircut', 'loud', 'crowded', 'bright'], feeling: 'overwhelmed', coping: 'take a break' }
    }

### Stock Image Matching

Match generated pages to existing STORY_SVGS when possible:

    STEP_IMAGE_HINTS = {
      'doctor': 'doctor-building', 'dentist': 'dentist-building',
      'haircut': 'haircut-shop', 'school': 'school-building',
      'party': 'party-invite', 'store': 'grocery-store',
      'wait': 'doctor-waiting', 'car': 'relatives-car',
      'check': 'doctor-checkup', 'chair': 'dentist-chair',
      'brave': 'doctor-brave', 'done': 'generic-positive',
      'friends': 'school-friends', 'home': 'school-home'
    }

Fallback: no stock image (parent adds their own photo).

### Word Limit Integration

- Use existing `getAgeConfig(story)` to get soft/hard word limits
- After generation, auto-split pages exceeding soft limit via `splitTextAtSentenceBoundary()`
- Maximum 12 pages enforced
- Short steps merged onto same page when combined total is under soft limit

### Personalization

- Use existing `personalizeStoryText()` with tokens: {name}, {verb}, {poss}, {obj}, {parent}
- Generate all text in first person by default, apply personalization at render time
- Third person mode transforms via existing token system

---

## UI Flow

### Modified Editor Flow

    [Setup Screen] --> [Step Input Screen] --> [Page Review/Edit]
        |                                          |
        |-- Title, Age, Perspective                |-- Generated pages
        |-- "Describe what will happen"            |-- Edit text per page
             button (replaces Helper)              |-- Add/change photos
                                                   |-- Sentence type shown
                                                   |-- Word count shown
                                                   |-- Add/delete pages

### Step Input Screen (New)

    +---------------------------------------+
    | < Back              New Story    Save  |
    +---------------------------------------+
    |                                        |
    |   Describe what will happen            |
    |   step by step                         |
    |                                        |
    |   1. What happens first?               |
    |   [_________________________________]  |
    |                                        |
    |   2. Then what?                        |
    |   [_________________________________]  |
    |                                        |
    |   3. What happens next?               |
    |   [_________________________________]  |
    |                                        |
    |   [+ Add another step]                 |
    |                                        |
    |   [Create Story]                       |
    |                                        |
    +---------------------------------------+

- Minimum 3 steps, maximum 8
- Step labels rotate: "What happens first?", "Then what?", "What happens next?", "And then?", "What happens after that?", etc.
- Add/remove step buttons (cannot go below 3)
- "Create Story" generates pages and transitions to page editor

### Page Review (Existing editor-step-pages)

No changes needed to existing page editor. Generated pages land here with:
- Text pre-filled
- Sentence types assigned
- Stock images matched where possible
- Word counts within age limits
- Parent can edit everything freely

---

## Implementation Phases

### Phase A: Generation Engine
**Scope**: Core step-to-story generation logic (no UI)

**Tasks**:
- A1: Define SENSORY_TRIGGERS constant (keyword lists by sensory category)
- A2: Define EMOTION_CUES constant (event categories with keywords, feelings, coping)
- A3: Define STEP_IMAGE_HINTS constant (keyword to stock SVG key mapping)
- A4: Implement detectSensory(stepText) -- returns array of matched sensory categories
- A5: Implement inferEmotion(allStepsText) -- returns best-match emotion cue
- A6: Implement matchStockImage(pageText) -- returns stock SVG key or null
- A7: Implement generateStoryFromSteps(steps, story) -- full page generation with sentence types, sensory prep, feelings, coping, closing
- A8: Integrate word limit splitting -- auto-split pages over soft limit, merge short adjacent steps

**Acceptance Criteria**:
- Given 3-8 step strings, produces 5-12 pages with correct sentence type distribution
- Sensory keywords trigger preparation language
- Pages respect age-based word limits
- Stock images matched where available
- Works entirely offline

### Phase B: Step Input UI
**Scope**: New editor step for event description

**Tasks**:
- B1: Add editor-step-steps HTML (step input list, add/remove, create button)
- B2: CSS for step input screen (consistent with existing editor styling)
- B3: Step input JS (add/remove steps, min 3 / max 8, rotating labels)
- B4: Wire "Describe what will happen" button on setup screen to step input
- B5: Wire "Create Story" button to generateStoryFromSteps() -> page editor
- B6: Auto-suggest title from first step if title is empty

**Acceptance Criteria**:
- Setup screen has clear path to step input
- 3-8 steps with add/remove
- "Create Story" generates pages and transitions to page editor
- Existing "Create from Scratch" still available for full custom path
- Touch targets 44px+ minimum

### Phase C: Template Integration
**Scope**: Pre-fill steps from existing templates

**Tasks**:
- C1: Define TEMPLATE_STEPS for each of the 8 existing templates (pre-written step sequences)
- C2: When parent selects a template in parent mode, pre-fill step inputs instead of generating a fixed story
- C3: Parent can edit/add/remove pre-filled steps before generating
- C4: Template selection screen shows "Customize" option that routes to step input

**Acceptance Criteria**:
- Selecting a template pre-fills steps that parent can modify
- Generated story from template steps matches quality of hardcoded templates
- Parent can add location-specific details to template steps

### Phase D: Polish and Edge Cases
**Scope**: Quality improvements and edge cases

**Tasks**:
- D1: Step input persistence (save draft steps to localStorage in case of accidental back navigation)
- D2: Empty/short step handling (skip steps with fewer than 2 words)
- D3: Duplicate step detection (warn if two steps are very similar)
- D4: Generation preview -- brief toast or animation while generating ("Creating your story...")
- D5: Accessibility -- ARIA labels on step inputs, keyboard navigation, focus management

**Acceptance Criteria**:
- Draft steps persist across accidental navigation
- Graceful handling of minimal or duplicate input
- Full keyboard and screen reader support
- Generation feels intentional (not instant, not slow)

---

## Integration Points

### Existing Systems
- **editor-step-setup**: Unchanged. Title, age, perspective captured here first.
- **editor-step-pages**: Unchanged. Generated pages land here for review.
- **AGE_CONFIG / getAgeConfig()**: Used for word limit enforcement during generation.
- **splitTextAtSentenceBoundary()**: Used for auto-splitting long pages.
- **personalizeStoryText()**: Used for name/perspective token replacement.
- **STORY_SVGS**: Stock images matched to generated pages.
- **saveStory()**: Standard save path, no changes needed.
- **countStoryWords() / getWordLimitState()**: Existing word limit UI works on generated pages.

### Replaced/Modified Systems
- **Story Helper wizard** (editor-step-helper): Kept in code but the step input becomes the default path. Helper wizard accessible as advanced option if needed.
- **generateStoryFromHelper()**: Not replaced. New generateStoryFromSteps() is a parallel function.
- **Template creation flow**: Modified to pre-fill steps instead of directly generating pages.

### New localStorage Keys
- `gs-story-draft-steps`: Persists in-progress step inputs (cleared on save or explicit discard)

### Service Worker
- Bump cache version on deploy

---

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Generated stories feel robotic | Use natural, warm language. First person. Short sentences. Test with real parents. |
| Sensory detection false positives | Conservative keyword list. Only add prep language for high-confidence matches. |
| Parents skip review step | Make review engaging -- show one page at a time with image area inviting photos. |
| Too few pages from short steps | Merge short steps, add feelings/coping/closing pages. Minimum 4 pages. |
| Too many pages from many steps | Merge related steps, enforce 12-page max, auto-split handles overflow. |
| Replaces working wizard | Keep wizard as fallback. Step input is the promoted path, not the only path. |
| Generated text conflicts with word limits | Run limits check during generation, split before presenting to parent. |

---

## Open Questions

1. Should we deprecate the 6-step Story Helper wizard entirely, or keep it as an "Advanced" option?
2. Should the system offer 2-3 story variations for the parent to choose from?
3. Should we add a "Quick Preview" button that shows the generated story in the reader before going to the page editor?
4. Should template steps be editable inline or should they open the full step input screen?
