# Plan: Core Words on Home Screen + Consistent Motor Planning

## The Problem Today

The home screen is **16 folder icons**. To say "I want more", a child must:
1. Tap "Social" folder → 2. Find "I" → 3. Go back → 4. Tap "Social" → 5. Find "want" → 6. Go back → repeat...

That's 6+ taps for a 3-word sentence. Research says it should be **2 taps max** for common requests.

There's also a `QUICK_ACCESS_BUTTONS` system that injects 5 phrase buttons ("I want", "I don't want", "I need help", "thank you", "please") into every folder view — but NOT the home screen. These are hardcoded DOM elements, not part of the data model, and they disappear when you go home.

## Design Philosophy: Freeform, Not Rigid

Unlike Proloquo2Go which locks every single word to a permanent grid cell across all screens, we take a **lighter approach**:

- **Core words get reserved positions on the home grid** — they always appear in the same cells on the home screen
- **Inside folders, layout remains freeform** — folders are the user's space to organize however they want
- **The quick-access bar (Home + "I want" + "I don't want" etc.) inside folders stays as-is** — it already provides consistency within folders without being rigid
- **Core words are real data-model buttons** (not injected DOM hacks) so they persist, are editable, and survive IndexedDB round-trips

## Home Grid Layout (4 columns)

New mixed layout — core words occupy the **top 2 rows**, folders fill the rest:

```
Row 1:  [ I ]        [ want ]     [ don't want ] [ help ]
Row 2:  [ more ]     [ stop ]     [ yes ]        [ no ]
Row 3:  [ go ]       [ like ]     [ Social ]     [ Food ]
Row 4:  [ Drinks ]   [ People ]   [ Feelings ]   [ Actions ]
Row 5:  [ Toys ]     [ Places ]   [ Things ]     [ Questions ]
Row 6:  [ Clothes ]  [ My Body ]  [ Colors ]     [ Shapes ]
Row 7:  [ 123 ]      [ ABC ]
```

- **Rows 1-2**: 8 core words (always these positions, never move)
- **Row 3**: 2 more core words + first 2 folders
- **Rows 4-7**: Remaining folders

Core words use proper Fitzgerald Key colors:
- `I` → yellow (pronoun)
- `want`, `help`, `go`, `like` → green (verbs)
- `don't want`, `stop`, `no` → red (negatives)
- `more` → blue (descriptor)
- `yes` → green (affirmative)

## Implementation Steps

### Step 1: Add core word buttons to the home grid data

Move 10 core words from the `general` folder into `folderId: null` (home grid) with reserved positions 0-9. These become real home-grid buttons with `type: 'core'` (new type) to distinguish them from folders and fringe words.

```javascript
// New type 'core' — rendered like fringe (tappable word) but position-locked
{ id: 'core-i',          label: 'I',          color: 'yellow', type: 'core', folderId: null, position: 0 },
{ id: 'core-want',       label: 'want',       color: 'green',  type: 'core', folderId: null, position: 1 },
{ id: 'core-dont-want',  label: "don't want", color: 'red',    type: 'core', folderId: null, position: 2 },
{ id: 'core-help',       label: 'help',       color: 'green',  type: 'core', folderId: null, position: 3 },
{ id: 'core-more',       label: 'more',       color: 'blue',   type: 'core', folderId: null, position: 4 },
{ id: 'core-stop',       label: 'stop',       color: 'red',    type: 'core', folderId: null, position: 5 },
{ id: 'core-yes',        label: 'yes',        color: 'green',  type: 'core', folderId: null, position: 6 },
{ id: 'core-no',         label: 'no',         color: 'red',    type: 'core', folderId: null, position: 7 },
{ id: 'core-go',         label: 'go',         color: 'green',  type: 'core', folderId: null, position: 8 },
{ id: 'core-like',       label: 'like',       color: 'green',  type: 'core', folderId: null, position: 9 },
```

Shift all existing folder positions by +10 (folders start at position 10).

Keep the duplicate words in the `general` folder too — a child should find "want" both on the home screen AND inside Social. No removal, only addition.

### Step 2: Update `renderGrid()` for mixed home grid

Currently the home grid just renders all `folderId: null` items via `createCell()`. Since `createCell()` already handles both folders (navigates into folder) and fringe words (speaks + adds to message), the core words will "just work" as tappable words — no special rendering needed beyond what `createCell()` already does.

The key change: add the new `'core'` type to `createCell()` so it behaves like `'fringe'` (tap to speak/add to message) rather than like `'folder'` (tap to navigate).

In `createCell()` (~line 3540), the click handler checks `btn.type === 'folder'` to decide whether to navigate or speak. We add `'core'` to the "speak" path:

```javascript
// Existing: if (btn.type === 'folder') { navigate } else { speak }
// Core words fall into the else (speak) branch naturally since type !== 'folder'
```

Actually, looking at `createCell()`, it already does: `if (btn.type === 'folder') { ... } else { speak }`. So `type: 'core'` will automatically go to the speak path. No change needed in createCell for basic functionality.

### Step 3: Motor planning protection for core words

Add a guard in the edit/delete flow so that `type: 'core'` buttons:
- **Cannot be deleted** (hide delete button in edit modal)
- **Cannot have their position changed** (position field locked)
- **Can have their label/image customized** (parents may want to change the icon)

In the edit modal logic, check `btn.type === 'core'` and disable the position/delete controls.

### Step 4: IndexedDB migration for existing users

Users who already have saved buttons in IndexedDB won't see the new core words because `init()` loads saved buttons and skips `DEFAULT_BUTTONS`.

Add a migration in `init()`:
```javascript
// After loading saved buttons, check if core words exist
const hasCoreWords = buttons.some(b => b.type === 'core');
if (!hasCoreWords) {
  // Inject core words at positions 0-9
  // Shift existing home-grid items' positions by +10
  // Save back to IndexedDB
}
```

### Step 5: Add BUTTON_ICONS entries for core words

The emoji icon lookup table (`BUTTON_ICONS`, ~line 3456) needs entries for the new core word IDs:

```javascript
'core-i': '🙋',
'core-want': '👉',
'core-dont-want': '🚫',
'core-help': '🆘',
'core-more': '➕',
'core-stop': '✋',
'core-yes': '👍',
'core-no': '👎',
'core-go': '🏃',
'core-like': '❤️',
```

### Step 6: Visual distinction for core words (subtle)

Add a subtle CSS indicator so core words are visually distinct from folders on the home grid — slightly larger text or a thin border — so parents understand these are tappable words, not folders. Keep it minimal.

```css
.cell[data-type="core"] {
  border-bottom: 3px solid rgba(0,0,0,0.15);
}
```

Add `data-type` attribute in `createCell()`.

## What We're NOT Doing

- **Not locking word positions inside folders** — folders stay freeform
- **Not removing the QUICK_ACCESS_BUTTONS system** — it still serves its purpose inside folders
- **Not changing grid column count** — that's a separate Grid Templates milestone
- **Not adding new vocabulary** — just promoting existing words to the home screen

## Files Changed

- `index.html` — all changes in this single file:
  - `DEFAULT_BUTTONS` array: add 10 core word entries, shift folder positions
  - `BUTTON_ICONS` object: add core word emoji mappings
  - `createCell()`: add `data-type` attribute to cell element
  - `renderGrid()`: no changes needed (sorts by position, handles mixed types)
  - Edit modal: protect core words from deletion/repositioning
  - `init()`: add migration for existing IndexedDB users
  - CSS: subtle core word styling

## Acceptance Criteria

1. Home screen shows 10 core words in rows 1-3, folders in rows 3-7
2. Tapping a core word speaks it and adds it to the message bar
3. Tapping a folder still navigates into that folder
4. "I want more" is achievable in 3 taps from home (I → want → more) without leaving the home screen
5. Core words cannot be deleted or repositioned
6. Core words appear in correct Fitzgerald Key colors
7. Existing users with saved data get core words via migration
8. Quick-access buttons inside folders still work as before
9. App still works offline after changes
