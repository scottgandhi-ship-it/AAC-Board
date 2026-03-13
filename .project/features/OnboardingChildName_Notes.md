# AAC Board Onboarding Child Name -- Implementation Notes

## Current Status: IMPLEMENTING -- all tasks complete

## Checklist

### Phase A: Data Model and Helpers
- [x] A1: getChildName()/setChildName() -- already existed (aac-child-name localStorage)
- [x] A2: localStorage key aac-child-name -- already existed

### Phase B: Onboarding Flow Update
- [x] B1: Add child name step HTML (Step 2 with headline, input, Next/Skip buttons)
- [x] B2: CSS reuses existing onboarding styles (no new CSS needed)
- [x] B3: Update Onboarding.showStep() to handle 4 steps (2=name, 3=grid, 4=coach)
- [x] B4: Wire "Next" button to save name and advance to step 3
- [x] B5: Wire "Skip for now" to advance to step 3 without saving
- [x] B6: Update progress dots in all steps from 3 to 4
- [x] B7: Focus management -- auto-focus input on step 2

### Phase C: Settings Integration
- [x] C1: Child name input already in Settings (child-name-input)
- [x] C2: Settings input already wired to aac-child-name localStorage

### Phase D: Polish
- [ ] D1: Accessibility audit -- needs testing
- [ ] D2: Test full onboarding flow end-to-end -- needs testing
- [ ] D3: Test existing users not re-triggered -- needs testing

## Architecture Notes
- Onboarding steps: 1 (Welcome) -> 2 (Child Name) -> 3 (Grid Picker) -> 4 (Coach Marks)
- Child name saved on "Next" syncs to settings input (child-name-input)
- "Skip for now" skips name without saving, proceeds to grid picker
- Existing aac-child-name and settings infrastructure was already in place

## Issues and Resolutions
(none yet)

## Validation Progress
(none yet)
