# AAC Board Onboarding -- Add Child Name Step

## Executive Summary

Update the existing 3-step onboarding flow to a 4-step flow by inserting a "Child's Name" step between Welcome and Grid Size. Store the name in localStorage for personalization across the app (activity toasts, future features). Also update progress dots from 3 to 4.

## Requirements

### R1: Child Name Step (New Step 2)
- Headline: "Who are we helping today?"
- Single text input with visible label above (no placeholder per project rules)
- Stored in localStorage key: aac-child-name
- Subtext: "We'll use their name to make the experience feel personal."
- Skip link: "Skip for now" -- proceeds without saving a name
- Continue button: "Next" -- saves name and proceeds to Step 3

### R2: Updated Step Numbering
- Step 1: Welcome (existing, unchanged)
- Step 2: Child Name (NEW)
- Step 3: Grid Size picker (existing, renumbered from Step 2)
- Step 4: Coach Marks (existing, renumbered from Step 3)

### R3: Progress Dots
- Update from 3 dots to 4 dots in all steps
- Active dot matches current step number

### R4: Existing Onboarding Compatibility
- Users who already completed onboarding should NOT see it again
- Version stays at 1 (no re-trigger needed)
- Child name field also available in Settings for users who skipped or want to change it later

### R5: Settings Integration
- Add "Child's Name" field to Settings panel
- Read/write from same localStorage key: aac-child-name
- Input with label, no placeholder

### R6: Accessibility
- Input has associated label element
- Step 2 overlay has role="dialog", aria-modal="true", aria-label
- Focus moves to input when step appears
- All buttons meet 48px min height

## Architecture Overview

### State Changes
- Onboarding.showStep() updated to handle step 2 (child name), step 3 (grid picker), step 4 (coach marks)
- localStorage key: aac-child-name (simple string, trimmed on save)
- Helper: getChildName() returns stored name or empty string

### HTML Changes
- Add child-name step markup inside onboarding overlay (or as new overlay)
- Update progress dots in all 4 steps from 3 to 4
- Add child name input to settings panel

### CSS Changes
- Style the child name input step (reuse existing onboarding gradient, layout)
- Input field styling consistent with grid-picker dropdown

### JS Changes
- Onboarding.showStep(2): show child name overlay, focus input
- "Next" button: save trimmed name, proceed to step 3
- "Skip for now" link: proceed to step 3 without saving
- Renumber grid picker to step 3, coach marks to step 4
- Add getChildName() / setChildName() helpers
- Settings: wire up child name input with change listener

## Task Breakdown

### Phase A: Data Model and Helpers
- A1: Add getChildName() and setChildName() functions
- A2: Add localStorage key aac-child-name

### Phase B: Onboarding Flow Update
- B1: Add child name step HTML (overlay markup, input, buttons, progress dots)
- B2: Add CSS for child name step (reuse onboarding gradient, input styling)
- B3: Update Onboarding.showStep() to handle 4 steps
- B4: Wire "Next" button to save name and advance to step 3
- B5: Wire "Skip for now" link to advance without saving
- B6: Update progress dots in all steps from 3 to 4
- B7: Focus management -- auto-focus input on step 2

### Phase C: Settings Integration
- C1: Add child name input to settings panel
- C2: Wire settings input to read/write aac-child-name

### Phase D: Polish
- D1: Accessibility audit (labels, roles, focus)
- D2: Test full onboarding flow end-to-end
- D3: Test existing users are not re-triggered

## Acceptance Criteria
- New users see 4-step onboarding with child name at step 2
- Name persists in localStorage and is readable via getChildName()
- Skipping name step works without errors
- Settings shows child name field that syncs with localStorage
- Existing users who completed onboarding are unaffected
- All progress dots show 4 steps with correct active state
