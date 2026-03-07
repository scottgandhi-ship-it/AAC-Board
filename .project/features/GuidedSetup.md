# 4.3 Guided Setup & Teaching Tutorial

## Executive Summary

Fast, friction-free onboarding that gets parents communicating with their child in under 60 seconds. The current grid picker becomes step 2 of a short 3-step welcome flow. Deeper teaching content (modeling strategies, AAC tips, vocabulary guidance) lives in an "AAC Guide" section inside Settings, always accessible but never blocking.

**Philosophy**: Onboard fast, teach later. Parents are tired and overwhelmed -- don't make them read a manual before they can use the app.

## Requirements

### Quick Onboard (first launch -- target: under 60 seconds)

1. **Welcome screen** (step 1 of 3)
   - Warm, emotional welcome: "Your child has something to say. Let's help them say it."
   - One-sentence explanation of what AAC is
   - Single "Get Started" button
   - No jargon, no lengthy paragraphs

2. **Grid picker** (step 2 of 3 -- already exists, enhance)
   - Keep current grid picker cards (3x3 / 4x4 / 6x6)
   - Keep language toggle (English / Espanol)
   - Add brief one-line guidance per card (already has this)
   - No changes needed here beyond visual integration with the flow

3. **Quick demo** (step 3 of 3)
   - Frame as modeling, not just mechanics: "This is how YOU show your child. Tap 'I' then 'want' -- they learn by watching you."
   - Animated highlight showing: tap a core word -> tap a prediction -> sentence speaks
   - "Try it yourself!" prompt -- user taps along on the real board
   - "Done" / "Skip" button to exit
   - Max 10 seconds of passive content before user is interactive
   - Reduced motion users: static numbered steps with descriptions instead of animation

4. **Done -- land on the board**
   - Toast: "Tip: Long-press the lock to access settings and more help"
   - Set localStorage flag: onboarding complete

### AAC Guide (in Settings -- always accessible)

5. **"AAC Guide" section in Settings panel**
   - New section in settings, visible in parent mode
   - Expandable/collapsible topics (accordion style)
   - Topics:
     - "What is AAC?" -- 2-3 sentence explanation
     - "How to Model" -- teach parents to demonstrate AAC use during routines, frame as "show, don't test"
     - "Core Words Matter" -- why the top strip is important
     - "Building Sentences" -- how prediction chains and grammar work
     - "Tips by Activity" -- mealtime, playtime, bath, bedtime modeling ideas with specific example phrases per activity
     - "When to Add New Words" -- 80% rule: when child uses 80% of current vocab consistently, add more
     - "Common Mistakes to Avoid" -- don't test ("what's this?"), don't withhold until child uses device, don't remove as punishment. Frame positively: "Instead of asking 'what do you want,' try modeling 'I want juice' yourself."
   - Each topic: short paragraph + actionable tip
   - "Replay Quick Tour" button to re-run the step 3 demo

6. **Contextual tips** (lightweight, non-blocking, day-based first week)
   - Day 1: "Just explore! Tap buttons yourself to get comfortable"
   - Day 3: "Try modeling during one meal today -- tap 'I want more' while your child watches"
   - Day 5: "Your child might not tap yet -- that's normal. Keep modeling!"
   - Day 7: "You're doing great. Check your Insights tab to see progress"
   - After first folder visit: "Core words at the top work on every screen"
   - Tips tracked in localStorage with timestamps, each shows once
   - Tips only appear in parent mode (never interrupt the child)
   - Day-based tips use first-launch date as anchor

## Architecture Overview

### New Components

- **Onboarding overlay** -- 3-step modal flow (welcome -> grid picker -> demo)
  - Reuses existing grid picker HTML, wraps it in the flow
  - New HTML for welcome screen and demo screen
  - CSS transitions between steps (slide or fade)

- **AAC Guide panel** -- accordion section inside settings
  - Pure HTML/CSS accordion (no JS framework needed)
  - Content stored as HTML strings or inline in the page

- **Tip engine** -- lightweight contextual tip system
  - localStorage keys: aac-tip-{tipId}-shown
  - Check conditions on relevant actions, show toast once

### localStorage Keys (new)

- aac-onboarding-complete -- boolean flag
- aac-onboarding-date -- timestamp of first launch (anchor for day-based tips)
- aac-tip-{tipId}-shown -- tip tracking (day1, day3, day5, day7, core-words)
- aac-use-count -- increment on each speak action

### Integration Points

- init() function: Check aac-onboarding-complete before rendering. If not complete, show onboarding overlay instead of grid picker
- Settings panel: Add AAC Guide section after existing sections, before "Reset" section
- speak() function: Increment use count, check tip conditions
- switchTab() / folder navigation: Check tip conditions

## Task Breakdown

### Phase A: Onboarding Flow (3 steps)

**A1: Welcome Screen**
- Add HTML for onboarding overlay with 3 steps
- Step 1: welcome message, "Get Started" button
- CSS for overlay, transitions, step indicators (dots)
- Wire "Get Started" to advance to step 2

**A2: Grid Picker Integration**
- Move existing grid picker into step 2 of onboarding flow
- On grid selection: advance to step 3 (instead of closing)
- Keep standalone grid picker for settings "change grid size" path

**A3: Quick Demo**
- Step 3: animated highlight on core word strip + prediction bar
- Pulse/glow animation on a core word, then prediction, then sentence bar
- "Try it!" prompt with skip/done buttons
- On done/skip: set aac-onboarding-complete, close overlay, show lock tip toast

**A4: Init Integration**
- Modify init() to check onboarding flag
- If not complete: show onboarding overlay
- If complete but no grid size: show grid picker standalone (edge case)
- If complete and has grid: normal boot

### Phase B: AAC Guide in Settings

**B1: Accordion Component**
- CSS-only accordion (details/summary elements)
- Styled to match existing settings panel
- Add after Sensory Preferences section, before Data/Reset section

**B2: Guide Content**
- Write concise content for each topic (What is AAC, How to Model, Core Words, Building Sentences, Tips by Activity, Adding New Words)
- Each topic: 2-4 sentences max + one actionable tip
- "Replay Quick Tour" button wired to re-run demo overlay

### Phase C: Contextual Tips

**C1: Tip Engine**
- Simple function: showTipOnce(tipId, message, condition)
- Checks localStorage for shown flag
- Shows toast if condition met and not previously shown
- Only fires in parent mode

**C2: Tip Triggers**
- Day-based tips: check days since aac-onboarding-date on app open
- Day 1/3/5/7 tips fire on first app open on or after that day
- After first folder navigation: core words tip
- Wire into init() (day checks) and folder nav handlers

## Accessibility Considerations

- Onboarding screens fully keyboard navigable
- Step indicators have aria labels ("Step 1 of 3: Welcome")
- Demo animation respects prefers-reduced-motion (skip animation, show static instructions instead)
- AAC Guide accordion uses native details/summary for screen reader support
- All new touch targets minimum 44x44px
- Focus management: trap focus in onboarding overlay, return focus to board on close

## Mobile-First Design

- Onboarding overlay: full-screen on mobile, centered card on tablet/desktop
- Large text, large buttons -- parents may be holding a child
- Swipe between steps (optional enhancement, buttons are primary)
- AAC Guide sections sized for one-thumb scrolling

## Acceptance Criteria

### Phase A
- [ ] First launch shows 3-step onboarding (welcome -> grid -> demo)
- [ ] Grid picker still works standalone from settings
- [ ] Demo highlights core word -> prediction -> speak flow
- [ ] Onboarding completes in under 60 seconds
- [ ] Second launch skips onboarding entirely
- [ ] Reduced motion users see static demo instead of animation

### Phase B
- [ ] AAC Guide section visible in settings (parent mode only)
- [ ] All 6 topics present with concise, actionable content
- [ ] Accordion expand/collapse works
- [ ] "Replay Quick Tour" re-launches demo overlay
- [ ] Screen reader can navigate all guide content

### Phase C
- [ ] Day 1/3/5/7 tips appear on correct days (parent mode only)
- [ ] Core words tip appears after first folder visit (parent mode only)
- [ ] Each tip shows exactly once
- [ ] Tips do not appear outside parent mode
- [ ] Tips use first-launch date as anchor

## Marci's Clinical Review (incorporated)
- Welcome copy: warm, emotional, hope-oriented (not product description)
- Demo framed as modeling ("this is how YOU show your child"), not just mechanics
- Tips by Activity: each has specific example phrase to model
- When to Add Words: uses 80% rule (evidence-based benchmark)
- Added "Common Mistakes to Avoid" topic (framed positively)
- Tips changed from count-based to day-based first-week sequence (matches therapy home carryover)
- Reduced motion: static numbered steps instead of just skipping
