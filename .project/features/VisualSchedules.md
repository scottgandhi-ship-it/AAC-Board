# Visual Schedules

## Status: PLANNING
## Priority: Phase 3 -- after Reward Tracker
## Dependencies: NavigationAndParentMode must be complete

---

## Executive Summary

A visual scheduling system where parents create reusable daily routine templates (e.g., "School Day", "Weekend") from a library of default activities and custom uploads. The child sees a vertical list of step cards showing what comes next. They tap the current step to mark it done and advance through their day. Templates are reused daily without rebuilding.

---

## Requirements

1. Parents can create reusable schedule templates with ordered steps
2. Each step has a label and an image (default SVG or parent-uploaded)
3. ~30 default activities across 6 time-of-day categories with built-in SVG icons
4. Parents can upload custom images for any step
5. Parents activate a template to create today's schedule
6. Child view shows a vertical scrolling list of step cards
7. Current step is visually prominent; completed steps are greyed with a checkmark
8. Single tap on current step to mark done (only current step is interactive)
9. Audio feedback on step completion (ding + spoken next-step name)
10. "All Done!" screen when schedule is complete
11. Steps are ordered (no clock times -- sequence only)
12. Support up to 10 templates per device

---

## Architecture Overview

### Data Model

Two new IndexedDB object stores:

**scheduleTemplates** (keyPath: "id")

    {
      id: string (e.g., "tmpl-1709234567890"),
      name: string (e.g., "School Day"),
      steps: [
        {
          stepId: string (e.g., "step-0"),
          label: string (e.g., "Brush teeth"),
          imageType: "default" | "custom",
          defaultImageKey: string or null (key into DEFAULT_SCHEDULE_IMAGES map),
          customImageKey: string or null (key in images store, "sched-{templateId}-{stepId}")
        }
      ],
      createdAt: number,
      updatedAt: number
    }

**activeSchedule** (single record, keyPath: "id", always id="current")

    {
      id: "current",
      templateId: string (which template was activated),
      templateName: string (snapshot of name at activation time),
      steps: [
        {
          stepId: string,
          label: string,
          imageType: "default" | "custom",
          defaultImageKey: string or null,
          customImageKey: string or null,
          status: "upcoming" | "current" | "done"
        }
      ],
      activatedAt: number (timestamp),
      completedAt: number or null
    }

Images for custom schedule steps stored in existing **images** store with key "sched-{templateId}-{stepId}".

### IndexedDB Version

If NavigationAndParentMode bumped to v2 (for rewardTracks), this bumps to v3.
If both are planned together, can do a single bump to v3 with all new stores.

### Default Activity Library

~30 default activities organized by time of day. Each has a label and an inline SVG icon (simple pictographic, 2-3 colors max, stored as SVG string in JS).

**Morning Routine (6 items):**
- Wake up (sun/bed icon)
- Go potty (toilet icon)
- Brush teeth (toothbrush icon)
- Get dressed (shirt icon)
- Eat breakfast (bowl/spoon icon)
- Take medicine (pill/bottle icon)

**School / Learning (6 items):**
- Go to school (school building icon)
- Circle time (group/circle icon)
- Work time (pencil/paper icon)
- Snack (apple icon)
- Recess (playground/swing icon)
- Lunch (lunch tray icon)

**Therapy / Appointments (4 items):**
- Speech therapy (speech bubble icon)
- Occupational therapy (hands icon)
- Doctor visit (medical cross icon)
- Waiting room (chair icon)

**Afternoon / Home (6 items):**
- Come home (house icon)
- Snack (cookie icon)
- Play inside (blocks/toy icon)
- Play outside (tree/sun icon)
- Screen time (tablet icon)
- Clean up (broom icon)

**Evening Routine (5 items):**
- Dinner (plate/fork icon)
- Bath time (bathtub icon)
- Brush teeth (toothbrush icon -- same as morning)
- Put on pajamas (pajamas icon)
- Story time (book icon)

**Bedtime (2 items):**
- Go to bed (bed icon)
- Goodnight (moon/stars icon)

Total: 29 default activities.

Each is defined in a DEFAULT_SCHEDULE_IMAGES map:

    { key: "wake-up", label: "Wake up", category: "Morning Routine", svg: "<svg>...</svg>" }

### UI Structure (inside #view-schedule)

**Child mode -- active schedule:**

    [Schedule title] (top, e.g., "School Day")
    [Step cards list] (vertical scroll, flex:1)
      - Done steps: greyed out, checkmark overlay, reduced opacity
      - Current step: highlighted border, enlarged, centered in view
      - Upcoming steps: full color, normal size
    [Progress indicator] (e.g., "Step 4 of 12")

**Child mode -- no active schedule:**

    "No schedule for today"
    (Parent must activate one)

**Child mode -- schedule complete:**

    "All Done!" celebration screen
    Large checkmark or star graphic
    "Great job finishing your [schedule name]!"

**Parent mode additions:**
- "Choose Schedule" button in header (pick template to activate)
- "Edit Templates" button (manage template library)
- "New Template" button

### Step Card Design

Each step card:
- Full width, 80-100px tall (current step: 120px)
- Horizontal layout: image on left (60x60px), label text on right (large, bold)
- Background: white with subtle shadow
- Current step: 3px left border in brand color (#5c6bc0), slightly larger scale
- Done step: opacity 0.5, checkmark overlay (CSS ::after pseudo-element with a simple check)
- Upcoming step: full opacity, no border accent
- Cards have 8px gap between them

### Step Completion Interaction

- ONLY the current step responds to taps
- Tap current step card:
  1. Card animates: brief scale-down (0.95) then back up
  2. Checkmark appears (CSS transition, 0.2s)
  3. Card fades to done state (opacity transition, 0.3s)
  4. Play ding tone (same as reward tracker)
  5. Speak the NEXT step label: "Time to [next step label]"
  6. Smooth scroll to center the new current step (scrollIntoView with smooth behavior)
  7. Save updated activeSchedule to IndexedDB
- If it was the last step:
  1. Play ta-da tone
  2. Speak "All done! Great job!"
  3. Show "All Done!" screen
  4. Save completedAt timestamp

### Template Editor (Parent Mode)

**Template list view:**
- List of saved templates with name and step count
- Tap to edit, long-press or delete icon to remove
- "New Template" button at bottom

**Template editor view:**
- Template name input (no placeholder)
- Ordered list of steps (each showing image thumbnail + label)
- Per step: [Move Up] [Move Down] [Edit] [Remove] buttons
- [Add Step] button at bottom of step list
- Add Step opens a picker:
  - Tab row: "Defaults" | "Custom"
  - Defaults tab: categorized grid of default activities (tap to add)
  - Custom tab: text input for label + upload image button
- [Save Template] [Cancel] buttons

**Step reordering:**
- Move Up / Move Down buttons per step (not drag-and-drop, per accessibility rules)
- Buttons are 44px+ touch targets

### Activating a Schedule

Parent mode action: "Start Schedule" or "Use Today"
1. Opens a list of saved templates
2. Parent taps one
3. App creates an activeSchedule record from the template
4. All steps set to "upcoming", first step set to "current"
5. Switch to child mode view of the schedule
6. If there was already an active schedule, confirm: "Replace today's schedule?"

---

## Task Breakdown

### Task 3.1: IndexedDB schema upgrade
- Bump DB_VERSION (to 3)
- Add scheduleTemplates and activeSchedule stores in onupgradeneeded
- Handle upgrade path from v1 and v2
- Add CRUD helpers: loadTemplates, saveTemplate, deleteTemplate, loadActiveSchedule, saveActiveSchedule, clearActiveSchedule

### Task 3.2: Default activity library
- Define DEFAULT_SCHEDULE_IMAGES map with all 29 activities
- Each entry: key, label, category, svg (inline SVG string)
- SVGs should be simple, clear, 2-3 colors, recognizable at 60x60px
- Test rendering at target size

### Task 3.3: Schedule child view -- active schedule renderer
- Render vertical list of step cards from activeSchedule data
- Visual states: done, current, upcoming
- Auto-scroll to center current step on load
- Progress indicator text ("Step 4 of 12")
- "No schedule" empty state
- "All Done!" completion state

### Task 3.4: Step completion interaction
- Tap handler on current step only
- Animation sequence (scale, checkmark, fade, scroll)
- Audio feedback (ding tone, reuse from reward tracker)
- Speech synthesis for next step name
- IndexedDB save after each step completion
- Last-step detection and "All Done!" transition

### Task 3.5: Template editor -- list view
- List of saved templates
- Template name, step count display
- New Template button
- Delete template with confirmation

### Task 3.6: Template editor -- step editor
- Template name input
- Ordered step list with move up/down/edit/remove
- Add Step picker (defaults tab + custom tab)
- Default activity picker: categorized grid
- Custom step: label input + image upload
- Save template to IndexedDB

### Task 3.7: Activate schedule flow
- "Start Schedule" button in parent mode
- Template picker list
- Create activeSchedule from template
- Replace confirmation if schedule already active
- Transition to child view

### Task 3.8: Image handling for custom steps
- Upload and store custom step images in images store
- Key format: "sched-{templateId}-{stepId}"
- Load and display custom images in step cards
- Clean up images when template or step is deleted

### Task 3.9: Integration and testing
- Wire schedule view into tab navigation
- Verify parent mode controls visibility
- Test full flow: create template -> add steps -> activate -> complete all steps
- Test with default-only steps, custom-only steps, and mixed
- Test schedule replacement (activate new while one is running)
- Test persistence: close app mid-schedule, reopen, resume
- Accessibility: screen reader announces step names, progress, completion

---

## Accessibility Considerations

- Step cards: each has aria-label with step name and state ("Brush teeth - current", "Wake up - done")
- Only current step has button role and is keyboard focusable
- Done and upcoming steps are aria-hidden or have role="listitem" (non-interactive)
- Progress indicator has aria-live="polite"
- "All Done!" announcement uses aria-live="assertive"
- Step completion audio respects device volume
- All parent mode controls (move up/down, edit, remove) have aria-labels
- Template editor step list uses role="list" with role="listitem" children
- Animations respect prefers-reduced-motion

---

## Acceptance Criteria

- [ ] At least 29 default activities render with recognizable SVG icons
- [ ] Parent can create a template with mix of default and custom steps
- [ ] Steps can be reordered with move up/down buttons
- [ ] Custom images upload and display correctly
- [ ] Activating a template creates a fresh schedule with all steps "upcoming"
- [ ] Current step is visually prominent and centered on screen
- [ ] Tapping current step marks it done with visual + audio + speech feedback
- [ ] Only the current step responds to taps
- [ ] Completed steps show greyed with checkmark, remain visible
- [ ] "All Done!" screen appears when last step completed
- [ ] Schedule progress persists across app close/reopen
- [ ] Replacing an active schedule prompts for confirmation
- [ ] Parent mode controls hidden in child mode
- [ ] Touch targets meet 44px minimum
- [ ] Screen reader navigates schedule flow correctly
- [ ] Animations disabled when prefers-reduced-motion is set
