# Visual Schedules - Implementation Notes

## Current Status: Implemented -- awaiting developer validation

## Checklist

### Task 3.1: IndexedDB schema upgrade
- [x] Bump DB_VERSION to 3 (Done)
- [x] Add scheduleTemplates store with keyPath "id" (Done)
- [x] Add activeSchedule store with keyPath "id" (Done)
- [x] Handles upgrade from v1, v2, and fresh install (Done)

### Task 3.2: Default activity library
- [x] 29 default activities with inline SVG icons (Done)
- [x] 6 categories: Morning(6), School(6), Therapy(4), Afternoon(6), Evening(5), Bedtime(2)
- [x] Each has key, label, category, svg string

### Task 3.3: Schedule child view -- active schedule renderer
- [x] 3 states: no schedule, active schedule, all done (Done)
- [x] Step cards with done/current/upcoming visual states (Done)
- [x] Current step highlighted with brand-color border (Done)
- [x] Auto-scroll to current step on render (Done)
- [x] Progress indicator "Step X of Y" (Done)
- [x] "All Done!" screen with checkmark and completion message (Done)

### Task 3.4: Step completion interaction
- [x] Tap current step to mark done (Done)
- [x] Plays ding, speaks next step "Time to [label]" (Done)
- [x] Last step: plays ta-da, speaks "All done! Great job!" (Done)
- [x] Saves to IndexedDB after each step (Done)
- [x] Only current step is interactive (Done)

### Task 3.5: Template editor -- list view
- [x] Template list with name and step count (Done)
- [x] "Start" mode activates template (Done)
- [x] "Edit" mode opens editor (Done)
- [x] "+ New Template" button in edit mode (Done)

### Task 3.6: Template editor -- step editor
- [x] Schedule name input (Done)
- [x] Ordered step list with move up/down/remove (Done)
- [x] Add Step opens activity picker (Done)
- [x] Save/Cancel/Delete buttons (Done)
- [x] Edit mode pre-fills from existing template (Done)

### Task 3.7: Activate schedule flow
- [x] Template picker list (Done)
- [x] Creates activeSchedule from template (Done)
- [x] First step "current", rest "upcoming" (Done)
- [x] Replace confirmation if schedule already active (Done)

### Task 3.8: Image handling for custom steps
- [x] Custom step image upload in activity picker (Done)
- [x] Stored in IndexedDB images store with sched- prefix (Done)
- [x] Displayed in step cards and editor (Done)

### Task 3.9: Integration and testing
- [x] Verification agent passed all 12 checks (Done)
- [x] No missing element references (Done)
- [x] No undefined variables (Done)
- [x] Schedule persists across app close/reopen (Done)
- [x] Fixed: custom steps without image use imageType "none" instead of "default" (Done)
- [ ] Developer manual testing on device (Pending)

## Issues and Resolutions
- Fixed: custom steps added without an image were getting imageType "default" with null defaultImageKey, rendering as empty icon. Changed to imageType "none" for clarity.

## Deviations from Plan
- Step cards use horizontal layout (image left, label right) with simple CSS flex instead of more complex card design
- Template editor uses a modal approach matching the existing patterns (settings modal, edit modal, reward config modal)
- Activity picker is a separate modal on top of the template editor for clean layering
- clearActiveSchedule() is defined but currently only used implicitly when a new schedule replaces the old one via activateTemplate()
