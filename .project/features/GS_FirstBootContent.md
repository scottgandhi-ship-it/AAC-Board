# Guiding Steps - Pre-load Sample Content at First Boot

**Status**: APPROVED (Steve-reviewed, revised)
**Stream**: 5C items #1 (pre-load sample schedule + reward track) and #2 (surface first 4 story templates)

---

## Problem

On first boot, all three tabs show empty states. A new parent sees "No schedule for today", "No reward tracks yet", and an empty Stories grid. This is the worst possible first impression -- the app looks empty and requires the parent to figure out how to create content before they can see any value.

## Current State

- **Schedules**: 6 default templates are seeded into IndexedDB on first boot (via `initSchedules()`), but no active schedule is started. Parent sees empty state.
- **Rewards**: No tracks exist. Parent sees "No reward tracks yet" empty state.
- **Stories**: No stories exist. 8 templates are available in `DEFAULT_STORY_TEMPLATES` but only appear when parent taps "New Story" and opens the template picker.

## Proposed Changes

### 1. Pre-load a Sample Schedule (auto-start on first boot)

On first boot (after onboarding completes OR on first `initSchedules()` with empty active schedule):
- Automatically start the "Morning Routine" template as the active schedule
- This gives the Schedule tab immediate content to show
- Use the `gs-sample-loaded` localStorage flag to ensure this only happens once
- Morning Routine is the best choice: short (4-5 steps), universally relevant, immediately demonstrable

### 2. Pre-load a Sample Reward Track

On first boot (during `initRewards()` when no tracks exist):
- Create one sample reward track:
  - Task: "Practice waiting"
  - Target: 5 steps
  - Reward: "Choose a game"
  - Timer: disabled
- Gives Rewards tab immediate visual content
- Guarded by same `gs-sample-loaded` flag

### 3. Surface First 4 Story Templates on Stories Tab

Instead of showing an empty grid, pre-create 4 stories from templates on first boot:
- Going to the Doctor
- Getting a Haircut
- First Day of School
- Going to the Grocery Store

These are the most universally relevant scenarios for the target audience (parents of autistic children ages 3-6). Pre-creating them means:
- Stories tab shows 4 story cards immediately
- Parent can tap to read right away
- Parent can edit/personalize later
- More templates available via "New Story" button

Implementation: In `initStories()`, if `stories.length === 0` and `gs-sample-loaded` is not set, create 4 stories from `DEFAULT_STORY_TEMPLATES` using `createStoryFromTemplate()` (or equivalent inline logic).

## Files to Modify

- `guiding-steps/index.html` -- `initSchedules()`, `initRewards()`, `initStories()`

## Implementation Details

### localStorage flag

`gs-sample-loaded` = 'true' -- set after all sample content is created. Prevents re-seeding if user clears their content intentionally.

### initSchedules() changes (~line 4304)

After templates are loaded and active schedule is null:
- Check `!localStorage.getItem('gs-sample-loaded')`
- Find "Morning Routine" template (`tmpl-default-morning`)
- Activate it as the current schedule (same logic as "Start Schedule" flow)

### initRewards() changes (~line 4829)

After tracks load and length is 0:
- Check `!localStorage.getItem('gs-sample-loaded')`
- Create sample track object
- Save via `saveTrack()`

### initStories() changes (~line 5852)

After stories load and length is 0:
- Check `!localStorage.getItem('gs-sample-loaded')`
- Pick first 4 templates from DEFAULT_STORY_TEMPLATES
- Create story objects with child name personalization (from `gs-child-name`)
- Save each via `saveStory()`

### Set flag

After all three init functions complete in the main init flow, set `localStorage.setItem('gs-sample-loaded', 'true')`.

## Acceptance Criteria

- Fresh install: Schedule tab shows active "Morning Routine" with steps
- Fresh install: Rewards tab shows one sample track ("Practice waiting" / 5 stars / "Choose a game")
- Fresh install: Stories tab shows 4 pre-created stories (Doctor, Haircut, School, Grocery Store)
- Stories are personalized with child's name if entered during onboarding
- Sample content only created once (flag prevents re-seeding)
- If user deletes sample content, it does not come back
- Existing installs are unaffected (flag check + empty-array check)
