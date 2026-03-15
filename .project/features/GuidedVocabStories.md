# Guided Vocabulary Stories (Step-by-Step Activity Coaching)

## Executive Summary

Transform activity steps into parent-facing guided vocabulary stories. When an activity is active, parents can enter "Guided Mode" -- a step-by-step overlay that surfaces 3-5 contextually relevant words per step with modeling prompts. This turns the AAC board into a real-time coaching tool, telling parents exactly WHICH words to model at WHICH moment.

The core innovation: **A speech therapist in your pocket during every activity.**

## Problem Statement

Current activity system limitations:
- Activities display all 16-64 words at once on the grid
- Parents don't know which words to model at which moment during an activity
- ACTIVITY_TEMPLATES already have step arrays (e.g., bathtime: 'undress', 'run water', 'wash body'...) but these are only used for vocabulary generation -- never shown to the parent
- Parents report "I know I should be modeling words, but I don't know which ones to use when"
- Speech therapists create aided language boards by hand at $150/hour -- this automates that process

## Clinical Justification (Marci)

- **Aided Language Stimulation** is the gold standard in AAC therapy: caregivers model language in context, in the moment
- Per-step word surfacing solves the "which word when" problem
- Core + fringe balance per step ensures both functional and activity-specific vocabulary
- Modeling prompts give parents confidence and reduce cognitive load
- Non-linear navigation respects that real activities don't follow strict sequences

## Parent Value (Reggie)

- Follows parents' existing mental model ("first we undress, then run water...")
- 3-5 words per step prevents overwhelm (vs. 30+ words on full grid)
- Modeling tips ("Try saying: wash hair") are the key differentiator
- This is what parents would pay $9.99 for -- guided coaching, not just a word grid
- Custom stories for unique family routines (e.g., "going to Nana's house")

---

## Architecture

### Data Source

ACTIVITY_TEMPLATES already contain per-activity step arrays and categorized vocabulary:

    bathtime.steps = ['undress', 'run water', 'add bubbles', 'wash body', 'wash hair', 'rinse', 'play', 'dry off', 'get dressed']
    bathtime.core = ['I', 'want', 'more', 'help', 'stop', 'all done', 'no', 'my turn']
    bathtime.actions = ['wash', 'pour', 'splash', 'play', 'dry', 'put on', 'take off', 'rinse', 'squeeze', 'rub']
    bathtime.objects = ['water', 'soap', 'bubbles', 'towel', 'duck', 'hair', 'body', 'tub', 'pajamas']
    ...

### New Data: Step-to-Word Mapping

For each activity template, define which words are most relevant per step. New constant STEP_VOCAB_MAP:

    STEP_VOCAB_MAP = {
      bathtime: {
        'undress': { words: ['take off', 'clothes', 'help'], prompt: 'Take off clothes. Help me!' },
        'run water': { words: ['water', 'hot', 'cold', 'pour'], prompt: 'Pour water. Hot or cold?' },
        'add bubbles': { words: ['bubbles', 'more', 'pour', 'squeeze'], prompt: 'More bubbles! Squeeze and pour.' },
        'wash body': { words: ['wash', 'soap', 'body', 'rub', 'gentle'], prompt: 'Wash body with soap. Gentle!' },
        'wash hair': { words: ['wash', 'hair', 'water', 'gentle', 'pour'], prompt: 'Wash hair. Pour water. Gentle!' },
        'rinse': { words: ['rinse', 'water', 'pour', 'all done'], prompt: 'Rinse off! Pour more water.' },
        'play': { words: ['play', 'splash', 'duck', 'fun', 'my turn'], prompt: 'Play time! Splash! My turn!' },
        'dry off': { words: ['dry', 'towel', 'all done', 'warm'], prompt: 'Dry off with towel. All done!' },
        'get dressed': { words: ['put on', 'pajamas', 'help', 'all done'], prompt: 'Put on pajamas. All done!' },
      },
      // ... all 19 activity templates
    }

Each step maps to:
- **words**: 3-5 vocabulary words (mix of core + fringe from the activity's word pool)
- **prompt**: A short parent-facing modeling script (1-2 sentences, natural language)
- **promptEs**: Spanish translation of the modeling prompt

### Guided Mode Overlay

A lightweight overlay on top of the activity grid that shows:
- Current step name and number (e.g., "Step 3 of 9: Wash Body")
- 3-5 highlighted word chips for this step
- Modeling prompt text ("Try saying: Wash body with soap. Gentle!")
- Previous / Next step navigation
- Step dots or progress indicator
- "Exit Guide" to return to full grid
- Direct tap on word chips to speak them

### Custom Story Support

Walkthrough-created activities already store steps in `activity.walkthrough.steps`. The guided mode should:
- Auto-generate step-word mappings for custom activities using walkthroughSurfaceWords() per step
- Auto-generate modeling prompts from step text + matched words
- Allow parents to edit/customize per-step words and prompts

---

## Implementation Phases

### Phase A: Step Vocabulary Data Layer
**Scope**: Define STEP_VOCAB_MAP for all 19 activity templates

**Tasks**:
- A1: Define STEP_VOCAB_MAP constant with per-step word lists and modeling prompts for all 19 activities
- A2: Define STEP_VOCAB_MAP Spanish prompts (promptEs) for all entries
- A3: Helper function stepVocabForActivity(activityId, stepIndex) that returns word objects from VOCAB_WORD_POOL
- A4: Helper function generateStepVocab(stepText, activityWords) for custom activities (auto-generates per-step words)
- A5: Helper function generateModelingPrompt(stepText, words) for custom activity prompt generation

**Acceptance Criteria**:
- All 19 activities have complete per-step word mappings (3-5 words per step)
- Every step includes at least 1 core word
- Spanish prompts for all built-in activities
- Custom activity step vocab generation works offline

### Phase B: Guided Mode UI
**Scope**: Build the guided step overlay shown during active activities

**Tasks**:
- B1: Guided mode overlay HTML (step display, word chips, prompt, navigation)
- B2: CSS for guided overlay (calm, clean design per Noah's principles)
- B3: Step navigation JS (previous/next, step dots, keyboard accessible)
- B4: Word chip tap-to-speak integration
- B5: "Start Guide" button on activity banner (enters guided mode)
- B6: "Exit Guide" button (returns to full grid)
- B7: Step progress persistence (remember last step per activity session)

**Acceptance Criteria**:
- Guided mode shows 3-5 words per step with modeling prompt
- Parent can navigate forward/back freely (non-linear)
- Word chips speak on tap and add to message bar
- Touch targets 44px+ minimum
- Smooth transition between guide and full grid
- Works on all grid sizes including early learner

### Phase C: Custom Story Guided Mode
**Scope**: Auto-generate guided mode for walkthrough-created activities

**Tasks**:
- C1: Auto-generate step vocab from walkthrough steps using walkthroughSurfaceWords() per step
- C2: Auto-generate modeling prompts from step text + surfaced words
- C3: Cache generated step vocab with the activity object
- C4: "Edit Steps" option in guided mode for custom activities
- C5: Spanish prompt generation for custom activities

**Acceptance Criteria**:
- Any walkthrough-created activity with steps gets guided mode automatically
- Generated per-step vocabulary is contextually appropriate
- Generated prompts are natural and helpful
- Parents can customize step words after auto-generation

### Phase D: Polish and Accessibility
**Scope**: Sensory considerations, accessibility, and edge cases

**Tasks**:
- D1: Sensory step flags (mark steps that may be sensory-sensitive, e.g., haircut: "cut hair")
- D2: Screen reader support (ARIA live regions for step changes)
- D3: Swipe navigation for step progression (mobile gesture)
- D4: Activity insights: track which steps parents spend most time on
- D5: Guided mode for routines (advance through routine steps across multiple activities)

**Acceptance Criteria**:
- Sensory-sensitive steps show a gentle note to parents
- Full keyboard and screen reader navigation
- Swipe left/right works for step navigation on mobile
- Step-level usage data visible in insights

---

## UX Design (Noah)

### Guided Overlay Layout

    +---------------------------------------+
    |  [< Prev]  Step 3 of 9  [Next >]     |
    |  *** *** [*] *** *** *** *** *** ***  |  <- step dots
    +---------------------------------------+
    |                                        |
    |        Wash Body                       |  <- step name, large
    |                                        |
    |   [wash]  [soap]  [body]  [gentle]    |  <- word chips, tappable
    |                                        |
    |   "Wash body with soap. Gentle!"      |  <- modeling prompt
    |                                        |
    +---------------------------------------+
    |  [Exit Guide]          [Full Board]   |
    +---------------------------------------+

### Design Principles

- **Calm background**: Semi-transparent overlay, not full replacement of grid
- **Large step name**: 1.2rem+, bold, centered
- **Word chips**: Fitzgerald Key colored, 44px+ touch targets, tap to speak
- **Prompt text**: Italic, softer color, conversational tone
- **Step dots**: Small, non-intrusive progress indicator
- **Navigation**: Large arrow buttons, swipe-friendly
- **Exit**: Always visible, never trapped in guided mode

---

## Integration Points

### Existing Systems
- **ACTIVITY_TEMPLATES**: Source of step arrays and categorized vocabulary
- **VOCAB_WORD_POOL**: Source of word definitions (color, icon, labelEs, symbolKw)
- **walkthroughSurfaceWords()**: Used for auto-generating custom activity step vocab
- **Activity banner**: "Start Guide" button added alongside existing close button
- **renderGrid() activity mode**: Guided overlay appears on top of (not replacing) the grid
- **Activity sessions tracking**: Extended with step-level usage data
- **Walkthrough data**: Custom activities with walkthrough.steps get guided mode automatically

### New localStorage Keys
- `aac-guided-step-{activityId}`: Persists last viewed step per activity (for resuming)
- Custom activity objects extended with `stepVocab` field (cached auto-generated data)

### Service Worker
- No changes needed (all data in index.html or localStorage)
- Bump cache version on deploy

---

## Risk Assessment

| Risk | Mitigation |
|------|-----------|
| STEP_VOCAB_MAP bloats index.html | Estimate ~8-10KB for 19 activities; acceptable |
| Modeling prompts feel clinical | Write in natural parent voice, not therapy jargon |
| Guided mode disrupts child's free communication | Overlay is optional, dismissible, never blocks grid access |
| Custom activity auto-prompts are low quality | Fallback to step text as prompt; parent can always edit |
| Too many steps overwhelm | Max 10 steps per activity; skip/jump always available |
| Non-English step vocab | Spanish prompts for all built-in; auto-generation for custom |

---

## Open Questions

1. Should the guided mode auto-advance when the parent taps "next," or should it wait for explicit tap?
2. Should word chips in guided mode also highlight on the full grid behind the overlay?
3. Should we add optional audio cues (gentle chime) on step transitions?
4. Should guided mode be the default for new parents (with option to turn off)?
