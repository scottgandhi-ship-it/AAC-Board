# Search Finds Core Words and Folders

**Status**: APPROVED (Steve-reviewed)
**Stream**: 5B item #27

---

## Problem

Search currently only finds fringe words (`b.type === 'fringe'`). Core words like "want", "help", "more" and folders like "Feelings", "Food" are invisible to search. A parent looking for "help" or a therapist looking for "feelings" gets zero results.

## Current Behavior

- Search filters `buttons` array with `b.type !== 'fringe' return false`
- Core words (type: 'core') excluded -- 8 words invisible
- Folders (type: 'folder') excluded -- all category folders invisible
- Only searches the in-memory `buttons` array, which is the current grid's template
- Results show icon, label, and parent folder name
- Tapping a result speaks the word and adds it to the message bar

## Proposed Behavior

### Core Words in Search
- Include `type === 'core'` in search results
- Display with a "Core" folder label to distinguish them
- Tapping a core word result: speaks it and adds to message bar (same as fringe)
- Core words appear at the TOP of results (they're the most important words)

### Folders in Search
- Include `type === 'folder'` in search results
- Display with a "Folder" label to distinguish them
- Tapping a folder result: NAVIGATES to that folder (opens it on the board) instead of speaking
- Close the search overlay after navigation

### Search Source
- Currently searches only the `buttons` array (current grid's loaded words)
- This is fine -- the `buttons` array already contains core words, folders, AND all fringe words for the current grid size
- No need to search across grid sizes or templates

## Files to Modify

- `index.html` -- search filter logic (~line 3253) and result click handler (~line 3286)

## Implementation

### Step 1: Expand the filter (line 3253-3258)

Replace:
    const matches = buttons.filter(b => {
      if (b.type !== 'fringe') return false;
      ...
    })

With filter that allows 'fringe', 'core', and 'folder' types. Sort results: core first, then folders, then fringe.

### Step 2: Update folder label display (line 3282-3283)

For core words: show "Core" as the folder label.
For folders: show "Folder" as the folder label.
For fringe words: keep existing behavior (parent folder name).

### Step 3: Update click handler (line 3286-3292)

For folders: navigate to that folder instead of speaking.
- Set `currentFolder = btn.id.replace('folder-', '')`
- Call `renderGrid()`
- Close search overlay
- Do NOT speak or add to message

For core words and fringe words: keep existing behavior (speak + add to message).

## Edge Cases

- Early learner grids: buttons array is small (1-4 words), search still works but limited results
- Spanish language: core words and folders already have Spanish labels via i18n, no extra work
- Custom-added buttons: already in buttons array with type 'fringe', already searchable

## Acceptance Criteria

- Searching "help" finds the core word "help"
- Searching "feel" finds the Feelings folder AND any fringe words containing "feel"
- Core words appear before folders, folders before fringe words in results
- Tapping a core word speaks it and adds to message bar
- Tapping a folder navigates to that folder and closes search
- Tapping a fringe word works as before
- Search results show "Core" label for core words, "Folder" label for folders
- Works in Spanish and bilingual modes
