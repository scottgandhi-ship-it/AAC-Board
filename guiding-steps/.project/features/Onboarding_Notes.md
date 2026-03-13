# Guiding Steps Onboarding -- Implementation Notes

## Current Status: IMPLEMENTING -- all phases complete, awaiting validation

## Checklist

### Phase A: Data Model and State
- [x] A1: Add GSOnboarding state object with localStorage persistence (gs-onboarding)
- [x] A2: getChildName()/setChildName() -- already existed (gs-child-name, getGlobalChildName)
- [x] A3: First-run detection in init() -- calls GSOnboarding.init() after app initializes

### Phase B: Welcome Step (Step 1)
- [x] B1: Add welcome overlay HTML (headline, subheadline, Get Started/Skip buttons, 4 dots)
- [x] B2: Add CSS for onboarding overlay (gradient background, layout, buttons, cards)
- [x] B3: Wire "Get Started" to advance to step 2
- [x] B4: Wire "Skip" to mark onboarding complete

### Phase C: Child Name Step (Step 2)
- [x] C1: Add child name step HTML (headline, input, Next/Skip buttons, 4 dots)
- [x] C2: Wire "Next" to save name to gs-child-name and sync to settings input
- [x] C3: Wire "Skip for now" to advance without saving
- [x] C4: Focus management -- auto-focus input on step 2

### Phase D: Feature Tour Step (Step 3)
- [x] D1: Add feature tour HTML (headline, 3 feature cards with SVG icons)
- [x] D2: Add CSS for feature cards (icon + text layout, rounded corners, shadow)
- [x] D3: Wire "Let's Go" to dismiss overlay and show coach mark

### Phase E: Coach Marks (Step 4)
- [x] E1: Add coach mark tooltip HTML/CSS (backdrop + floating tooltip)
- [x] E2: Position tooltip relative to "Start Schedule" button
- [x] E3: Wire button tap to dismiss and complete onboarding
- [x] E4: Wire backdrop tap to dismiss gracefully

### Phase F: Settings and Integration
- [x] F1: Child name input already in Settings (settings-child-name)
- [x] F2: Settings input already wired to gs-child-name localStorage
- [x] F3: Social Stories already reads getGlobalChildName()
- [x] F4: Onboarding wired into init() sequence

### Phase G: Polish
- [ ] G1: Accessibility audit -- needs testing
- [ ] G2: Mobile end-to-end test -- needs testing
- [ ] G3: Test resume from each step -- needs testing
- [ ] G4: Test skip from each step -- needs testing
- [ ] G5: Verify existing users unaffected -- needs testing

## Architecture Notes
- Onboarding object: GSOnboarding (mirrors AAC Board's Onboarding pattern)
- Steps: 1 (Welcome) -> 2 (Child Name) -> 3 (Feature Tour) -> 4 (Coach Mark)
- Coach mark points to "Start Schedule" button with positioned tooltip
- Tap outside onboarding content dismisses flow
- Child name saved during onboarding syncs to settings-child-name input
- Existing gs-child-name infrastructure (getGlobalChildName) was already in place

## Issues and Resolutions
(none yet)

## Validation Progress
(none yet)
