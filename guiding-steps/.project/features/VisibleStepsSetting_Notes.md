# Visible Steps Setting - Implementation Notes

## Current Status: Implementing

## Checklist

- [x] Task 1: Storage and state (visibleStepsCount variable, localStorage read on init, DEFAULT_VISIBLE_STEPS constant, reset handler updated)
- [x] Task 2: Settings UI (parent-mode-only section with segmented button group, CSS, click + keyboard handlers, aria roles)
- [x] Task 3: Rendering logic (renderSchedule filters to window of visibleStepsCount steps around current, parent mode shows all)

## Issues and Resolutions

(none)

## Validation Progress

- [ ] Default shows 3 steps on fresh install
- [ ] Setting appears only in parent mode
- [ ] Changing the value immediately updates the schedule view
- [ ] Value persists across page reloads
- [ ] "Reset all to defaults" resets to 3
- [ ] Parent mode shows all steps regardless of setting
- [ ] Progress text always shows total step count
- [ ] Segmented buttons are keyboard accessible
