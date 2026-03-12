# Visible Steps Setting

## Executive Summary

Add a parent-mode setting to control how many schedule steps are visible to the child at once. Default is 3 (aligned with Marci's "Now / Next / Later" recommendation). Parents can choose 2-6.

## Requirements

- New setting in Settings panel (parent-mode only): "Visible steps" with options 2, 3, 4, 5, 6
- Default: 3
- Persisted in localStorage (key: gs-visible-steps)
- renderSchedule() filters displayed steps based on this setting
- Included in "Reset all to defaults" behavior

## Architecture

### Storage

- Key: gs-visible-steps
- Values: 2, 3, 4, 5, 6 (integers stored as strings)
- Default: 3
- Read at app init into a module-level variable (visibleStepsCount)

### Settings UI

- New settings-section inside Settings panel, after "Sensory Preferences", before "Voice"
- Gated with parent-mode-only class
- Label: "Schedule" (section header)
- Sub-label: "Steps shown at a time"
- Control: segmented button group (2 | 3 | 4 | 5 | 6) -- more tactile and scannable than a dropdown for 5 options
- Active button highlighted with --chrome-primary color
- On change: save to localStorage, update visibleStepsCount, re-render schedule

### Rendering Logic Change (renderSchedule)

Current behavior: renders ALL steps (done, current, upcoming) in a scrollable list.

New behavior:
- Find the index of the current step
- Calculate a window of visibleStepsCount steps centered around (or starting from) the current step
- Show: up to 1 completed step before current (for context), the current step, and remaining slots filled with upcoming steps
- Steps outside the window are not rendered
- Progress text remains "Step X of Y" (shows total, not just visible)
- Parent mode override: when parentMode is true, show all steps (parents need the full picture)

Window logic (for visibleStepsCount = 3):
- Show: [last done step (if any)] [current] [next upcoming]
- If no done steps yet: [current] [next 2 upcoming]
- As steps complete, the window slides forward

### Reset Defaults

- Add gs-visible-steps to the reset handler (line ~3832)
- Reset value: 3

## Task Breakdown

### Task 1: Storage and State
- Add visibleStepsCount variable (default 3)
- Read from localStorage on init
- Add to reset defaults handler

### Task 2: Settings UI
- Add new settings-section with segmented button group
- CSS for segmented buttons (inline, consistent with existing style)
- Wire up click handlers to save and re-render

### Task 3: Rendering Logic
- Modify renderSchedule() to filter steps based on visibleStepsCount
- Parent mode bypass (show all)
- Maintain "Step X of Y" with full total

## Accessibility

- Segmented buttons: role="radiogroup" with role="radio" on each button, aria-checked
- Keyboard navigable (arrow keys within group)
- Progress text unchanged ("Step X of Y") so screen readers always report full context

## Acceptance Criteria

- [ ] Default shows 3 steps on fresh install
- [ ] Setting appears only in parent mode
- [ ] Changing the value immediately updates the schedule view
- [ ] Value persists across page reloads
- [ ] "Reset all to defaults" resets to 3
- [ ] Parent mode shows all steps regardless of setting
- [ ] Progress text always shows total step count
- [ ] Segmented buttons are keyboard accessible
