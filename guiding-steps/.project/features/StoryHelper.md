# Story Helper -- Guided Story Creation Wizard

## Executive Summary

Replace the current blank "Start from Scratch" editor flow with a clinically-informed guided wizard that walks parents and SLPs through creating an effective social story, step by step. Based on Carol Gray's Social Stories framework and Marci's clinical recommendations. The Helper teaches parents **why** each part matters while producing a well-structured, personalized story their child can use immediately.

The existing page editor (Step 2: Pages) remains for fine-tuning after the Helper generates the initial draft. The Helper is an alternative **entry path** into the editor, not a replacement for it.

## Requirements

- Guided multi-step flow that produces a complete social story draft
- Each step includes brief coaching text explaining the therapeutic "why"
- Follows Carol Gray's sentence type ratio (descriptive/perspective heavy, directive light)
- Output feeds directly into the existing page editor for fine-tuning
- Works for both "Create Story" (blank) and as a future enhancement for template customization
- Parent mode only (same gate as current editor)
- Mobile-first, works offline
- Accessible (keyboard nav, screen reader, focus management)

## Architecture Overview

### Flow Placement

Current flow:
    Template Picker -> "Create Story" card -> openStoryEditor(null) -> blank page editor

New flow:
    Template Picker -> "Create Story" card -> Story Helper wizard (6 steps) -> generates pages -> page editor (for fine-tuning)

The Helper is a new step inside the existing story-editor overlay. It replaces editor-step-setup when the user enters via "Create Story" (no template). Template-based stories skip the Helper and go straight to setup + page editor as they do now.

### New HTML Structure

Inside #story-editor, add a new step div:

    #editor-step-helper (new) -- 6-step guided wizard
      Step 1: Situation ("What's the situation?")
      Step 2: Scene ("Setting the scene")
      Step 3: Sequence ("What happens?")
      Step 4: Feelings ("How might they feel?")
      Step 5: Coping ("What helps them?")
      Step 6: Ending ("The positive ending")

After the user completes all 6 steps, the Helper:
1. Auto-generates story pages from the collected input
2. Assigns appropriate sentence types per Carol Gray's ratio
3. Populates editingStory.pages
4. Transitions to editor-step-pages for review and fine-tuning

### Data Collection Per Step

**Step 1 -- Situation**
- Free text: "What situation does your child need help with?"
- Category sparks (tappable chips, optional): "A new experience", "Something scary", "A routine change", "A social interaction", "A sensory challenge", "A transition"
- Coaching: "Social stories work best when they're specific to your child's actual experience."

**Step 2 -- Scene**
- Free text: "Describe where this happens and what your child will notice."
- Sensory prompts (tappable chips, optional): "What they'll see", "What they'll hear", "What they'll smell or feel"
- Coaching: "Sensory details help your child mentally prepare. Kids on the spectrum often respond to sounds, lights, or textures we might not notice."

**Step 3 -- Sequence**
- Dynamic list of text inputs: "What happens first?", "Then what?", "What's the hardest part?"
- Add/remove step buttons, minimum 2, maximum 6
- Coaching: "Break the event into simple steps your child can follow. Spend extra time on the part that's most difficult."

**Step 4 -- Feelings**
- Child's feelings: tappable emotion chips + optional free text
  - Chips: "Scared", "Worried", "Confused", "Overwhelmed", "Excited", "Nervous", "Upset", "Unsure"
- Others' feelings (optional): "How might other people there be feeling?"
- Coaching: "Naming the hard feelings tells your child the emotion is normal and expected. It's okay to name the scary stuff."

**Step 5 -- Coping**
- Tappable strategy chips + optional free text
  - Chips: "Deep breaths", "Squeeze a fidget", "Hold my hand", "Ask for a break", "Count to five", "Use my words", "Hug my stuffy", "Close my eyes"
- Who can help: free text (defaults to parent/caregiver name from setup)
- Coaching: "Use strategies your child already knows. A social story isn't the place to introduce brand-new coping skills -- use what's already in their toolbox."

**Step 6 -- Positive Ending**
- Free text: "How does the story end positively?"
- Tone guidance chips: "I was brave", "I did it", "It was okay", "I can try again next time"
- Coaching: "The ending should feel achievable, not perfect. 'I tried something new and I was brave' is better than 'I had a great time' if your child probably won't enjoy it."

### Page Generation Algorithm

The Helper converts collected input into story pages with appropriate sentence types:

1. **Page 1** (descriptive): Scene setting from Step 2
   - "Sometimes I go to [situation]. [scene description]."

2. **Pages 2-4** (descriptive): Sequence steps from Step 3
   - Each step becomes one page

3. **Page 5** (perspective): Feelings from Step 4
   - "I might feel [emotions]. [Others' feelings]. That's okay."

4. **Page 6** (directive + cooperative): Coping from Step 5
   - "When I feel [emotion], I can [strategy]. [Helper] can help me."

5. **Page 7** (affirmative): Positive ending from Step 6
   - User's text, or generated from tone chips

All text uses personalization tokens ({name}, {poss}, {obj}, {verb}, {parent}) so the existing personalizeStoryText() function handles first/third person rendering.

Page count varies based on how many sequence steps the user adds (minimum 5 pages, maximum 9).

### Setup Integration

The Helper needs the same setup data as the current editor (child name, parent name, perspective). Two options:

**Option A -- Setup first, then Helper**: Keep editor-step-setup as Step 0. After "Next: Edit Pages", route to Helper instead of page editor. Helper uses child name and parent name in coaching text ("How might [child name] feel?").

**Option B -- Setup embedded in Helper**: Merge setup fields into Helper Step 1. Fewer screens but Step 1 becomes heavier.

**Recommendation: Option A.** The setup screen is already built and tested. It also lets us personalize coaching text with the child's name throughout the Helper, which makes it feel warmer.

### Modified Flow (Final)

    "Create Story" card -> editor opens -> editor-step-setup (title, name, perspective)
      -> "Next" button -> editor-step-helper (6-step guided wizard)
      -> "Generate Story" button -> editor-step-pages (review/fine-tune pages)
      -> "Save" button -> story saved to IndexedDB

### CSS

- Helper uses a card-based step layout with progress indicator at top
- Each step is a single scrollable card with coaching text, input(s), and chips
- Transition between steps: horizontal slide (respects reduced motion)
- Progress bar or step dots showing 1-6 position
- Coaching text styled distinctly (italic, softer color, slightly smaller) so it's available but not overwhelming
- Chip/tag UI for sparks, emotions, strategies: pill-shaped, tappable, toggleable
- Consistent with existing editor styling (same field labels, input styles, button styles)

## Task Breakdown

### Phase 1: Helper HTML and CSS

**1.1: Progress indicator**
- 6-dot or segmented progress bar at top of helper step
- Active/completed/upcoming states
- Accessible: aria-label "Step X of 6"

**1.2: Step 1 -- Situation UI**
- Free text input field
- Category spark chips (optional, tappable, multi-select)
- Coaching text block
- "Next" button

**1.3: Step 2 -- Scene UI**
- Free text textarea
- Sensory prompt chips
- Coaching text block
- "Back" / "Next" buttons

**1.4: Step 3 -- Sequence UI**
- Dynamic list of text inputs (start with 3, add/remove)
- Minimum 2, maximum 6
- Coaching text block
- "Back" / "Next" buttons

**1.5: Step 4 -- Feelings UI**
- Emotion chips (multi-select)
- Optional free text for child feelings
- Optional free text for others' feelings
- Coaching text block
- "Back" / "Next" buttons

**1.6: Step 5 -- Coping UI**
- Strategy chips (multi-select)
- Optional free text for custom strategies
- "Who can help?" field (pre-filled with parent name from setup)
- Coaching text block
- "Back" / "Next" buttons

**1.7: Step 6 -- Ending UI**
- Free text input
- Tone guidance chips (single-select)
- Coaching text block
- "Back" / "Create Story" button (primary, prominent)

**1.8: Chip/tag component CSS**
- Pill-shaped: border-radius 20px, padding 8px 16px
- Default state: outline with soft color
- Selected state: filled with color, checkmark or bold
- Touch target: minimum 44px effective area
- Wrap in flex container with gap

### Phase 2: Helper JavaScript

**2.1: Step navigation**
- Track current helper step (1-6)
- Show/hide step divs
- Update progress indicator
- Animate transitions (slide, respects reduced motion)
- "Back" returns to previous step (or setup on Step 1)
- "Next" validates current step has minimum input, advances

**2.2: Data collection object**
- helperData = { situation, sparks[], scene, sensoryDetails[], steps[], childFeelings[], othersFeelings, copingStrategies[], customStrategy, helper, ending, endingTone }
- Populated as user moves through steps

**2.3: Page generation function**
- generateStoryFromHelper(helperData, editingStory) -> populates editingStory.pages
- Applies sentence types per Carol Gray ratio
- Uses personalization tokens
- Generates 5-9 pages depending on sequence step count

**2.4: Flow routing**
- Modify "Create Story" card click -> openStoryEditor(null) (already done)
- Modify editor-setup-next click: if story has no pages with text (new story), show helper; if story has content (editing), show page editor
- After helper "Create Story" button: generate pages, transition to editor-step-pages

### Phase 3: Polish and Integration

**3.1: Coaching text content**
- Write final coaching copy for all 6 steps
- Warm, encouraging tone (Marci-approved)
- Brief -- 1-2 sentences max per step

**3.2: Validation**
- Step 1: require situation text (minimum)
- Step 3: require at least 2 sequence steps with text
- Step 6: require ending text or tone chip selection
- Steps 2, 4, 5: optional but encouraged (show gentle nudge if skipped)

**3.3: Keyboard and accessibility**
- Focus management on step transitions
- Chip selection via keyboard (Space/Enter to toggle)
- aria-pressed on chips
- Progress indicator is aria-live

**3.4: Reduced motion**
- Step transitions use opacity fade instead of slide

## Acceptance Criteria

### Phase 1
- [ ] All 6 helper steps render with correct layout
- [ ] Progress indicator shows current step
- [ ] Chips are tappable and toggle selection state
- [ ] Coaching text is visible but visually secondary
- [ ] Layout works on 375px width screens
- [ ] Touch targets are 44px minimum

### Phase 2
- [ ] Navigation between steps works (forward/back)
- [ ] Data persists across steps within the wizard
- [ ] "Create Story" generates correct pages with proper sentence types
- [ ] Generated pages appear in page editor for fine-tuning
- [ ] Editing an existing story bypasses the Helper and goes to page editor
- [ ] New blank story routes through the Helper

### Phase 3
- [ ] All coaching text is finalized and Marci-approved
- [ ] Validation prevents empty stories
- [ ] Gentle nudges for skipped optional steps
- [ ] Focus management is correct on step transitions
- [ ] Reduced motion preference is respected
- [ ] Works offline
