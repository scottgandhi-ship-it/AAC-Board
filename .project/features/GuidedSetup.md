# 4.3 Guided Setup

## Executive Summary

Fast, friction-free onboarding that gets parents communicating with their child in under 30 seconds. The current grid picker becomes step 2 of a short 3-step welcome flow. No tutorials, no guides, no tips -- just get to the board.

**Philosophy**: Get out of the way. Parents are tired and overwhelmed -- don't make them read a manual before they can use the app.

**Voice**: Every piece of copy is friendly, pro-parent, non-clinical, and welcoming. We are all-inclusive, understanding, and on their side. AAC is communication -- not a clinical intervention, not a bridge to speech. It is their child's voice.

## Requirements

### Quick Onboard (first launch -- target: under 30 seconds)

1. **Welcome screen** (step 1 of 3)
   - Warm, emotional welcome: "Your child has something to say. Let's give them a voice."
   - One sentence: "AAC works alongside gestures, sounds, and expressions -- it adds to how your child already communicates."
   - Single "Get Started" button
   - No jargon, no lengthy paragraphs

2. **Grid picker** (step 2 of 3 -- already exists, enhance)
   - Keep current grid picker cards (3x3 / 4x4 / 6x6)
   - Keep language toggle (English / Espanol)
   - Brief one-line guidance per card (already has this)
   - Add "You can change this anytime" below the grid cards to reduce decision anxiety
   - No changes needed beyond visual integration with the flow

3. **Quick demo** (step 3 of 3)
   - Static coach marks overlay on the real board -- three numbered callouts:
     - (1) A core word on the top strip
     - (2) The prediction bar
     - (3) The speak button
   - Copy: "Tap words to build a sentence. Your child learns by watching YOU do it. Try it now!"
   - The "Your child learns by watching YOU" message must have visual weight equal to or greater than the callouts -- not a footnote
   - Parent taps directly on the real board -- no animation, no passive watching
   - "Done" button appears only after the parent taps at least one word -- let the first-tap moment land
   - No reduced-motion fallback needed (no animation to reduce)

4. **Done -- land on the board**
   - Set localStorage flag: onboarding complete
   - No instructional toast needed (settings button is always visible after parent mode refactor)

### Prerequisite: Parent Mode Refactor

This plan depends on the Parent Mode Visibility refactor being completed first. See .project/features/ParentModeRefactor.md. With settings always discoverable, onboarding does not need to teach any hidden interactions.

### Mid-Onboarding Interruption Handling

- If the app is closed during onboarding, resume from the current step (not restart from step 1)
- Track which step the user reached in localStorage
- If the child grabs the device during setup, any tap outside the overlay dismisses it and lands on the board (onboarding marked complete)

## Architecture Overview

### Design Principles (Robert)

- **Defensive rendering**: Always render the grid first, show onboarding overlay on top. If the overlay breaks, the app still works.
- **Module-object pattern**: All onboarding logic lives in a self-contained object (const Onboarding = { init(), show(), complete() }). No loose functions scattered across the file.
- **Protect speak()**: Never add logic to speak() that could block communication. Any hooks are fire-and-forget with try-catch.
- **Lazy content**: Coach marks content injected on demand, not inlined in the DOM at load time.
- **CSS transitions only use transform and opacity**: No layout properties animated. Low-end tablets must stay smooth.

### New Component

- **Onboarding overlay** -- 3-step modal flow (welcome -> grid picker -> coach marks)
  - Reuses existing grid picker HTML, wraps it in the flow
  - Grid picker must accept a container parameter if currently hardcoded to a DOM ID
  - New HTML for welcome screen and coach marks screen
  - CSS transitions between steps (transform/opacity only)

### localStorage (consolidated, per Robert)

Single key with versioned JSON object:

    aac-onboarding: {
      version: 1,
      complete: false,
      currentStep: 1,
      date: null
    }

No key proliferation. Trivial to reset. Room to extend later.

### Integration Points

- init() function: Always render the grid. Then check aac-onboarding.complete. If false, show onboarding overlay on top.
- Grid picker: Verify it can render into a different parent container (onboarding flow step 2) without side effects.
- On overlay dismiss (any path): set complete to true, remove overlay.

## Task Breakdown

### Phase A: Onboarding Flow

**A1: Onboarding module scaffold**
- Create Onboarding module object with init(), show(), advance(), complete() methods
- Add consolidated localStorage key with version
- Wire into init() -- always render grid first, then overlay if needed

**A2: Welcome Screen**
- Step 1 HTML: headline, one-sentence multimodal message, "Get Started" button
- CSS for full-screen overlay, step transitions (transform/opacity)
- Step indicator dots with aria labels ("Step 1 of 3: Welcome")

**A3: Grid Picker Integration**
- Wrap existing grid picker in step 2 of the onboarding flow
- Verify grid picker can render into the overlay container
- On grid selection: advance to step 3 (not close)
- Keep standalone grid picker path for settings "change grid size"

**A4: Coach Marks Demo**
- Step 3: static numbered callouts overlaid on the real board
- Three callouts pointing to core word, prediction bar, speak button
- Copy: "Tap words to build a sentence. Your child learns by watching YOU do it. Try it now!"
- "Done" button only appears after parent taps at least one word
- Tap outside overlay also dismisses (child-grab escape hatch)

**A5: Interruption handling**
- Track currentStep in localStorage on each advance
- On app reopen with incomplete onboarding, resume from currentStep
- Validate currentStep against actual step count on load (guard against stale data)
- Focus management: trap focus in overlay, return focus to board on close

## Accessibility Considerations

- Onboarding screens fully keyboard navigable
- Step indicators have aria labels ("Step 1 of 3: Welcome")
- Coach mark callouts have aria-describedby linking to their text
- All touch targets minimum 44x44px
- Focus trapped in onboarding overlay, returned to board on close
- No animation that needs reduced-motion handling (static coach marks)

## Mobile-First Design

- Onboarding overlay: full-screen on mobile, centered card on tablet/desktop
- Large text, large buttons -- parents may be holding a child
- Coach marks positioned relative to actual board elements

## Acceptance Criteria

- [ ] First launch shows 3-step onboarding (welcome -> grid -> coach marks)
- [ ] Grid picker still works standalone from settings
- [ ] Coach marks highlight core word, prediction bar, and speak button on the real board
- [ ] Parent can tap real board buttons while coach marks are visible
- [ ] "Done" button only appears after parent taps at least one word
- [ ] Grid picker shows "You can change this anytime" reassurance text
- [ ] Onboarding completes in under 30 seconds
- [ ] Second launch skips onboarding entirely
- [ ] No flash of welcome screen on return visits
- [ ] Closing app mid-onboarding resumes from current step
- [ ] Tapping outside overlay during any step dismisses and completes onboarding
- [ ] No toast or instructional copy about settings/lock -- settings button is always visible
- [ ] No errors in speak() or init() if onboarding code fails (defensive rendering)
- [ ] localStorage uses single consolidated key with version field
- [ ] All new code follows module-object pattern (const Onboarding = {})
- [ ] CSS transitions use only transform/opacity (no layout properties)
