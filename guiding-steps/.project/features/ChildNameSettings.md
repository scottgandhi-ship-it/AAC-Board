# Child Name in Settings -- Global Child Profile

## Executive Summary

Move "Child's Name" from per-story configuration to a global app setting. Add a Child's Name field in the Settings panel that persists via localStorage. All stories auto-populate from this global value. Remove the Child's Name field from the Story Editor details section. Also wire this into a future onboarding flow (deferred -- Scott will define onboarding separately).

## Requirements

1. Add a "Child's Name" input field in the Settings panel (under a "Child Profile" section)
2. Persist the value in localStorage (key: gs-child-name)
3. All new stories auto-populate childName from the global setting
4. Template preview (readTemplateStory) uses the global child name
5. Remove the "Child's Name" field from the Story Editor details section
6. Existing saved stories keep their stored childName (backward compatible)
7. If global child name changes, it does NOT retroactively update existing saved stories
8. Story editor still shows the child name (read-only or as context) but sources it from settings

## Architecture

### Settings Panel Change

Add a new settings section "Child Profile" above or near "Kids Mode":

- Label: "Child's Name"
- Input field (text, no placeholder per project rules)
- Persisted to localStorage on blur/change

### Story Editor Change

- Remove the "Child's Name" label + input from the editor details section
- When creating a new story (or from template), auto-fill childName from localStorage
- Existing stories being edited keep their saved childName

### Template Preview Change

- readTemplateStory() currently passes empty string for childName
- Change to read from localStorage global child name
- If name exists, default personMode to 'third' so the name is used

## Task Breakdown

### Task 1: Add Child's Name to Settings panel

- New settings section "Child Profile" with text input
- Load from localStorage on init
- Save to localStorage on input change (debounced or on blur)

### Task 2: Wire global child name into story creation

- createStoryFromTemplate(): populate childName from global setting
- openStoryEditor(null): populate childName from global setting for new stories
- readTemplateStory(): use global child name + auto-select person mode

### Task 3: Remove Child's Name from Story Editor

- Remove the label + input for editor-child-name
- Story editor reads childName from the story object (set at creation time)
- Keep parent name field in editor (parent name stays per-story for now)

## Acceptance Criteria

- [ ] Settings panel has a "Child's Name" field that persists across reloads
- [ ] New stories auto-populate the child's name from settings
- [ ] Template preview uses the child's name from settings
- [ ] Child's Name field is removed from story editor
- [ ] Existing saved stories retain their childName
- [ ] Person mode defaults to third-person when child name is set
