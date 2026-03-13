# Guiding Steps -- Onboarding Flow

## Executive Summary

Add a first-run onboarding experience to Guiding Steps, adapted from the AAC Board's proven onboarding pattern. Four steps: Welcome, Child Name, Feature Tour, and Coach Marks. Introduces parents to the app's three tools (Schedules, Rewards, Stories), captures the child's name for personalization, and guides them to their first action.

## Requirements

### R1: Step 1 -- Welcome
- Headline: "Every day is a little easier when your child knows what's next."
- Subheadline: "Guiding Steps helps your child follow routines, earn rewards, and understand social situations."
- Buttons: "Get Started" (primary) and "Skip" (text link)
- Skip marks onboarding complete immediately
- Progress dots: 4 dots, first active

### R2: Step 2 -- Child Name
- Headline: "Who are we helping today?"
- Single text input with visible label above (no placeholder per project rules)
- Subtext: "We'll use their name to make stories and schedules feel personal."
- Stored in localStorage key: gs-child-name
- "Next" button saves trimmed name and advances
- "Skip for now" link advances without saving
- Progress dots: 4 dots, second active

### R3: Step 3 -- Feature Tour
- Headline: "Three tools, one app."
- Three cards displayed vertically, each with:
  - Icon + feature name + one-line description
  - Schedules: "Visual routines your child can follow step by step"
  - Rewards: "Track progress toward goals they care about"
  - Stories: "Social stories that teach what to expect"
- Button: "Let's Go" -- advances to step 4
- Progress dots: 4 dots, third active

### R4: Step 4 -- Coach Marks
- Land on Schedule tab (primary feature)
- Tooltip pointing at the "+" button: "Start here -- add your child's first activity."
- Tapping "+" dismisses coach mark and opens add-activity flow
- Tapping elsewhere dismisses coach mark gracefully
- Progress dots: not shown (coach mark is a tooltip, not a full overlay)

### R5: State Management
- localStorage key: gs-onboarding
- State: { version: 1, complete: false, currentStep: 1, date: timestamp }
- First-run detection: check if gs-onboarding exists and complete is false
- Resume from currentStep if user refreshes mid-flow
- Skip and coach mark dismissal both mark complete

### R6: Child Name Integration
- getChildName() / setChildName() helpers reading gs-child-name
- Wire into existing Social Stories child name field (auto-populate)
- Wire into Settings panel (editable field)
- Available for schedule headers and reward celebrations in future

### R7: Settings Integration
- Add "Child's Name" field to Settings panel
- Read/write from gs-child-name localStorage key
- Input with visible label, no placeholder

### R8: Accessibility
- All overlay steps: role="dialog", aria-modal="true", aria-label
- Focus management: move focus to first interactive element on each step
- All buttons 48px min height, 44px+ touch targets
- Input has associated label element
- Coach mark tooltip has aria-live="polite" for screen reader announcement
- Progress dots are decorative (aria-hidden="true")

### R9: Visual Design
- Same gradient overlay style as AAC Board for brand consistency:
  - Background gradient: purple to pink to yellow to green
  - Centered content, max-width 400px, 32px padding
- Feature tour cards: rounded corners, soft shadow, icon left-aligned
- Coach mark tooltip: floating card with arrow pointing to "+" button, semi-transparent backdrop

## Architecture Overview

### HTML Structure
- Onboarding overlay (fixed, z-index 400) with 3 step containers (steps 1-3)
- Coach marks overlay (fixed, z-index 350) with tooltip element
- Each step has its own visibility toggle (display none/flex)

### CSS
- Reuse AAC Board gradient overlay pattern
- Feature tour cards: flex row, icon + text, rounded corners, subtle border
- Coach mark: absolute positioned tooltip near "+" button, arrow indicator
- Responsive: adjust padding and font sizes below 500px

### JS -- Onboarding Object
- getState() / setState() -- localStorage persistence
- isComplete() -- check complete flag
- init() -- detect first run, show appropriate step
- showStep(n) -- display step 1, 2, or 3
- showCoachMarks() -- display tooltip on Schedule tab
- complete() -- mark done, remove overlays, fire onboarding-complete event

### Integration Points
- App init: check onboarding state before normal rendering
- Social Stories editor: auto-populate child name from getChildName()
- Settings panel: child name input field
- Schedule tab: coach mark targets the "+" add-activity button

## Task Breakdown

### Phase A: Data Model and State
- A1: Add Onboarding state object with localStorage persistence (gs-onboarding)
- A2: Add getChildName() / setChildName() helpers (gs-child-name)
- A3: Add first-run detection in app initialization

### Phase B: Welcome Step (Step 1)
- B1: Add welcome overlay HTML (headline, subheadline, buttons, progress dots)
- B2: Add CSS for onboarding overlay (gradient background, layout, buttons)
- B3: Wire "Get Started" to advance to step 2
- B4: Wire "Skip" to mark onboarding complete

### Phase C: Child Name Step (Step 2)
- C1: Add child name step HTML (headline, input, subtext, buttons, progress dots)
- C2: Wire "Next" button to save name and advance to step 3
- C3: Wire "Skip for now" to advance without saving
- C4: Focus management -- auto-focus input on step appearance

### Phase D: Feature Tour Step (Step 3)
- D1: Add feature tour HTML (headline, 3 feature cards, button, progress dots)
- D2: Add CSS for feature cards (icon, name, description layout)
- D3: Wire "Let's Go" button to dismiss overlay and show coach marks

### Phase E: Coach Marks (Step 4)
- E1: Add coach mark tooltip HTML and CSS
- E2: Position tooltip relative to Schedule tab's "+" button
- E3: Wire "+" button tap to dismiss coach mark and complete onboarding
- E4: Wire tap-outside to dismiss gracefully

### Phase F: Settings and Integration
- F1: Add child name input to Settings panel
- F2: Wire settings input to gs-child-name localStorage
- F3: Auto-populate Social Stories editor child name from getChildName()
- F4: Wire onboarding state into app init sequence

### Phase G: Polish
- G1: Accessibility audit (roles, labels, focus, touch targets)
- G2: Test full flow end-to-end on mobile
- G3: Test resume from each step after refresh
- G4: Test skip from each step
- G5: Verify existing users (if any) are not disrupted

## Acceptance Criteria
- First-time users see 4-step onboarding starting with Welcome
- Child name is captured and persisted in localStorage
- Feature tour clearly introduces Schedules, Rewards, and Stories
- Coach mark guides parent to add their first activity
- Skipping at any step marks onboarding complete
- Settings panel shows editable child name field
- Social Stories auto-populates child name from stored value
- Refreshing mid-flow resumes at the correct step
