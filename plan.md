# Plan: Core Words on Home Screen + Consistent Motor Planning

## The Problem Today

The home screen is **16 folder icons**. To say "I want more", a child must:
1. Tap "Social" folder → 2. Find "I" → 3. Go back → 4. Tap "Social" → 5. Find "want" → 6. Go back → repeat...

That's 6+ taps for a 3-word sentence. Research says it should be **2 taps max** for common requests.

There's also a `QUICK_ACCESS_BUTTONS` system that injects 5 phrase buttons ("I want", "I don't want", "I need help", "thank you", "please") into every folder view — but NOT the home screen. These are hardcoded DOM elements, not part of the data model.

## Design Philosophy: Core Words Everywhere, Folders Freeform

- **Core words are pinned to fixed positions on EVERY screen** — home, inside folders, everywhere. A child always knows where "I", "want", "help" live regardless of context.
- **Non-core words inside folders remain freeform** — parents and SLPs can organize those however they want.
- **Replaces `QUICK_ACCESS_BUTTONS`** — the old system injected 5 hardcoded phrase buttons as DOM hacks. Core words on every screen replaces this with real data-model buttons that are consistent, persistent, and editable.
- **Core words are real data-model buttons** with `type: 'core'` so they persist, survive IndexedDB round-trips, and can have custom images.

## Home Grid Layout (4 columns)

New mixed layout — core words occupy the **top 2.5 rows**, folders fill the rest:

```
Row 1:  [ I ]        [ want ]     [ don't want ] [ help ]
Row 2:  [ more ]     [ stop ]     [ yes ]        [ no ]
Row 3:  [ go ]       [ like ]     [ Social ]     [ Food ]
Row 4:  [ Drinks ]   [ People ]   [ Feelings ]   [ Actions ]
Row 5:  [ Toys ]     [ Places ]   [ Things ]     [ Questions ]
Row 6:  [ Clothes ]  [ My Body ]  [ Colors ]     [ Shapes ]
Row 7:  [ 123 ]      [ ABC ]
```

## Inside Any Folder (e.g., Food)

Core words pin to the same positions (top rows), folder content fills below:

```
Row 1:  [ I ]        [ want ]     [ don't want ] [ help ]
Row 2:  [ more ]     [ stop ]     [ yes ]        [ no ]
Row 3:  [ go ]       [ like ]     [ Home ⬅ ]     [           ]
Row 4:  [ apple ]    [ banana ]   [ cookie ]     [ milk ]
Row 5:  [ juice ]    [ water ]    [ bread ]      [ cheese ]
...
```

The child builds motor memory: "I" is ALWAYS top-left. "want" is ALWAYS second. No matter what screen they're on.

Core words use proper Fitzgerald Key colors:
- `I` → yellow (pronoun)
- `want`, `help`, `go`, `like`, `yes` → green (verbs/affirmative)
- `don't want`, `stop`, `no` → red (negatives)
- `more` → blue (descriptor)

## Implementation Steps

### Step 1: Define core words in the data model

Add 10 core word entries to `DEFAULT_BUTTONS` with `type: 'core'` and `folderId: null` (home grid), positions 0-9:

```javascript
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

Shift all existing folder positions by +10. Keep duplicate words in the `general` folder — the child can find "want" on home AND inside Social.

### Step 2: Update `renderGrid()` to inject core words on every screen

**Home grid**: Core words render naturally at positions 0-9 since they have `folderId: null`. No change needed for home.

**Folder views**: This is the key change. When rendering a folder, inject the core word buttons at the top of the grid (before the Home button and folder content). The core words are global — they don't belong to any folder but appear on all of them.

```javascript
// In renderGrid(), folder branch:
// 1. Render core words first (positions 0-9, always the same)
const coreWords = buttons.filter(b => b.type === 'core').sort((a, b) => a.position - b.position);
coreWords.forEach(btn => {
  const c = createCell(btn);
  grid.appendChild(c);
});

// 2. Then Home button
grid.appendChild(homeBtn);

// 3. Then folder-specific items
items.forEach(btn => {
  grid.appendChild(createCell(btn));
});
```

**Remove `QUICK_ACCESS_BUTTONS`**: Delete the `QUICK_ACCESS_BUTTONS` array and the injection logic in `renderGrid()`. Core words replace this entirely.

### Step 3: `createCell()` handles core type

`createCell()` already routes `type !== 'folder'` to the speak/add-to-message path. `type: 'core'` falls into this naturally — no change needed for basic tap behavior.

Add `data-type` attribute to the cell element for CSS targeting:
```javascript
cell.setAttribute('data-type', btn.type);
```

### Step 4: Motor planning protection

Core words (`type: 'core'`) are protected:
- **Cannot be deleted** — hide delete button in edit modal
- **Cannot be repositioned** — position field locked/hidden
- **Can have label/image customized** — parents may want to swap the emoji for a photo

### Step 5: IndexedDB migration for existing users

Existing users have saved buttons in IndexedDB without core words. Add migration in `init()`:

```javascript
const hasCoreWords = buttons.some(b => b.type === 'core');
if (!hasCoreWords) {
  // Define the 10 core words
  // Shift all existing folderId:null buttons' positions by +10
  // Prepend core words to the buttons array
  // Save back to IndexedDB
}
```

### Step 6: Add BUTTON_ICONS entries

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

### Step 7: Subtle CSS for core words

Minimal visual distinction so parents understand these are always-present words:

```css
.cell[data-type="core"] {
  border-bottom: 3px solid rgba(0,0,0,0.15);
}
```

## What We're NOT Doing

- **Not locking non-core word positions inside folders** — those stay freeform
- **Not changing grid column count** — that's a separate Grid Templates milestone
- **Not adding new vocabulary** — just promoting existing words to be globally visible

## Files Changed

- `index.html` — all changes in this single file:
  - `DEFAULT_BUTTONS`: add 10 core word entries, shift folder positions
  - `BUTTON_ICONS`: add core word emoji mappings
  - `renderGrid()`: inject core words at top of every folder view; remove `QUICK_ACCESS_BUTTONS`
  - `createCell()`: add `data-type` attribute
  - Edit modal: protect core words from deletion/repositioning
  - `init()`: migration for existing IndexedDB users
  - CSS: subtle core word styling

## Acceptance Criteria

1. Home screen shows 10 core words in rows 1-3, folders in rows 3-7
2. Every folder view shows the same 10 core words in the same top positions
3. Tapping a core word speaks it and adds it to the message bar (on any screen)
4. Tapping a folder still navigates into that folder
5. "I want more" is achievable in 3 taps without leaving any screen
6. Core words cannot be deleted or repositioned
7. Core words appear in correct Fitzgerald Key colors
8. Non-core words inside folders can still be freely rearranged
9. `QUICK_ACCESS_BUTTONS` system is fully removed (replaced by core words)
10. Existing users with saved data get core words via migration
11. App still works offline after changes
