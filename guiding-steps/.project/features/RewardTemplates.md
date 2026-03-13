# Reward Templates -- Save and Reuse Reward Configurations

## Executive Summary

Allow parents to save reward track configurations as reusable templates. Common rewards (potty training, treat time, etc.) can be saved once and re-created from a template picker when setting up new tracks. Templates store the task label, reward label, target count, timer settings, and images.

## Requirements

1. Parents can save a reward track's configuration as a template
2. When creating a new reward track, a template picker appears offering saved templates
3. Selecting a template pre-fills all fields in the reward config form
4. Parents can still create from scratch (no template)
5. Templates are stored persistently (IndexedDB or localStorage)
6. Parents can delete saved templates
7. Limit to a reasonable number of templates (e.g., 10)

## Architecture

### Storage

Add a new IndexedDB object store `rewardTemplates` (or use localStorage if simpler). Each template:

    {
      id: string,
      name: string,           // display name for the template
      taskLabel: string,
      rewardLabel: string,
      targetCount: number,
      timerEnabled: boolean,
      timerDuration: number,
      taskImageType: string,
      taskDefaultImageKey: string,
      createdAt: number
    }

Note: Reward images (the photo of the reward) are per-track, not per-template. Templates store text config only. Task default images (the built-in SVG icons) ARE stored since those are just key references.

### UX Flow

**Saving a template:**
- In the reward config form (when editing an existing track), add a "Save as Template" button
- Prompts for a template name (auto-suggest from task + reward labels)
- Saves current config as a template

**Using a template:**
- When tapping "New Track", show a template picker overlay (similar to story template picker)
- Shows saved templates as cards + a "Start from Scratch" card
- Selecting a template opens the reward config form pre-filled
- "Start from Scratch" opens an empty config form (current behavior)

**Deleting a template:**
- Long-press or swipe on a template card in the picker, or a delete button on each card

## Task Breakdown

### Task 1: IndexedDB -- Add rewardTemplates store

- Add STORE_REWARD_TEMPLATES constant
- Bump DB_VERSION
- Add store creation in onupgradeneeded
- Add CRUD helpers (loadRewardTemplates, saveRewardTemplate, deleteRewardTemplate)

### Task 2: Save as Template UI

- Add "Save as Template" button in reward config overlay (only visible when editing existing track)
- On click: prompt for template name, save current form values as template
- Show toast confirmation

### Task 3: Template picker for new tracks

- When "New Track" is tapped:
  - If no saved templates exist, open config form directly (current behavior)
  - If templates exist, show a picker overlay with template cards + "Start from Scratch"
- Template card shows: name, task label, reward label, target count
- Selecting a template pre-fills the config form

### Task 4: Delete templates

- Add a delete button (small X) on each template card in the picker
- Confirm before deleting
- Update picker display after deletion

### Task 5: CSS for reward template picker

- Reuse picker-card styles from story template picker where possible
- Style the template cards to show reward info clearly

## Acceptance Criteria

- [ ] Can save an existing reward track config as a named template
- [ ] "New Track" shows template picker when templates exist
- [ ] Selecting a template pre-fills the reward config form
- [ ] "Start from Scratch" opens empty config form
- [ ] Can delete saved templates
- [ ] Templates persist across app reloads
- [ ] Template limit enforced (10 max)
- [ ] Works correctly in Kids Mode (template picker hidden, same as New Track button)
