# Activity Enhancements -- Implementation Notes

## Current Status
- All three phases implemented, awaiting device testing

## Implementation Checklist

### Phase A: Clinical Word Review
- [x] Update Mealtime words (added I, no; removed bowl, thank you)
- [x] Update Bath Time words (added I, help, no, out; removed duck, warm)
- [x] Update Playground words (added I, no, want; removed high, your turn)
- [x] Update Bedtime words (added I, no, help, all done; removed dark, sing)
- [x] Update Getting Dressed words (added I, no; removed zip)
- [x] Update Circle Time words (added I, help, no; removed friend)
- [x] Update Car Ride words (added no, help, all done; removed are we there)
- [x] Update Sensory Play words (added help, no, all done, stop; removed cool, bubbles, mix)
- [x] Update Book Time words (added want, no, where; removed see)
- [x] Update Doctor Visit words (added no, want, stop; removed turn, body)
- [x] Update Art Time words (added no, more, all done; removed pretty, on)
- [x] Update Grocery Store words (added help, stop; removed yummy, in)
- [x] Fix all color coding issues (all done -> green everywhere, yucky -> blue in Sensory)

### Phase B: Activities Tab
- [x] Tab bar HTML + CSS changes (5 tabs: Talk, Activities, Schedule, Rewards, gear)
- [x] Activities view HTML (locked/unlocked states)
- [x] Tab switching logic (added to getTabViewMap)
- [x] Parent mode gate (3-tap unlock with timeout)
- [x] Active activity highlighting (badge + border + end button)
- [x] Settings gear demoted to icon-only (tab-btn-gear class)

### Phase C: Activity Templates
- [x] Create activity UI + modal (name, icon picker, color picker, word selector)
- [x] Custom activity storage (localStorage aac-custom-activities)
- [x] Export function (.aactemplate JSON with Web Share API fallback)
- [x] Import function (file input with validation)
- [x] Export button on each activity card (parent mode only)

### Phase D: Validation
- [ ] Word overlay testing
- [ ] Navigation testing
- [ ] Mobile testing
- [x] Cache version bump (v34 -> v35)

## Deviations from Plan
- Kept at 15-16 words per overlay (some slightly over at 16 rather than 14-16 target)
- Import button placed in Activities tab rather than both tab and Settings
