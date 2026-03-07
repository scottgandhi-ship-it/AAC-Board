# Plan: Predictive Next-Word + Two-Tap Shortcuts

## The Problem

Core words on every screen got us to 3 taps for "I want more." But common requests like "I want cookie" still require: tap "I" → tap "want" → open Food folder → find "cookie" = 4+ taps. We want 2-3 taps for the most common phrases.

## Solution: Prediction Strip

A horizontal strip of suggested next-words appears between the message bar and the grid after tapping a core word. This is an **additive UI layer** — the grid never changes (motor planning safe).

### Layout

```
┌──────────────────────────────────────────┐
│ [←] [ I  want ]           [⌫][🔍][🔊][✕]│  ← message bar
├──────────────────────────────────────────┤
│ [want] [don't want] [like] [help] [go]  │  ← prediction strip (NEW)
├──────────────────────────────────────────┤
│ [ I ]  [want] [don't want] [help]       │  ← grid (unchanged)
│ [more] [stop] [yes]        [no]         │
│ ...                                      │
└──────────────────────────────────────────┘
```

### Prediction Map (static, curated)

```javascript
const PREDICTIONS = {
  'I':          ['want', "don't want", 'like', 'help', 'go'],
  'want':       ['more', 'help', ...TOP_NOUNS],
  "don't want": ['stop', 'no', ...TOP_NOUNS],
  'like':       ['more', ...TOP_NOUNS],
  'help':       ['more', 'please', 'yes'],
  'more':       [...TOP_NOUNS],
  'go':         ['home', 'outside', 'bathroom', 'please'],
  'stop':       ['please', 'no', 'help'],
};
```

`TOP_NOUNS` = the 4 most common request nouns pulled from the actual buttons array: water, cookie, milk, juice. These stay in sync with any customization the parent makes.

### How Two-Tap Works

| Taps | Action | Sentence |
|------|--------|----------|
| 1 | Tap "I" | bar: "I", predictions: [want, don't want, like, help, go] |
| 2 | Tap prediction "want" | bar: "I want", predictions: [more, water, cookie, milk, juice, help] |
| 3 | Tap prediction "cookie" | bar: "I want cookie", speaks "I want cookie", predictions clear |

So "I want cookie" = 3 taps. "help please" = 2 taps. "more water" = 2 taps.

### Behavior Rules

1. Predictions appear after tapping a **core word** (grid or prediction chip)
2. Tapping a **prediction chip** adds that word to the message bar
3. If the predicted word is a **non-core word** (noun like "cookie"), it speaks the full sentence automatically and clears predictions
4. If the predicted word is a **core word** (like "want"), it chains — shows next predictions silently
5. Predictions **clear** when: sentence is cleared, backspace removes the triggering word, or user taps a folder
6. Prediction chips inherit Fitzgerald Key colors matching the word type

## Implementation Steps

### Step 1: Add HTML
Add `<div id="prediction-bar"></div>` between `#message-bar` and `#grid-container` inside `#view-talk`.

### Step 2: Add CSS
- Horizontal scrollable strip, ~44px tall
- Hidden by default (`display: none`), shown when predictions exist
- Chips styled as rounded pills with Fitzgerald Key colors
- Slide-down entrance animation

### Step 3: Add PREDICTIONS map + TOP_NOUN_IDS constant
Define near the core word section. `TOP_NOUN_IDS` lists button IDs whose labels get pulled into noun predictions: `['drink-water', 'food-cookie', 'drink-milk', 'drink-apple-juice', 'food-crackers', 'food-apple']`.

### Step 4: Add renderPredictions(lastWord) function
- Looks up `PREDICTIONS[lastWord]`
- For each predicted word, creates a tappable chip
- Chips need to know if the word is core vs. noun for coloring and tap behavior
- Populates `#prediction-bar` and shows it

### Step 5: Hook into addWordToMessage()
- After adding a word, call `renderPredictions(word)` if predictions exist for that word
- Clear predictions if no map entry exists (e.g., after a noun)

### Step 6: Prediction chip tap handler
- Adds word to message bar
- If word is non-core: speak full sentence, clear predictions
- If word is core: chain to next predictions silently

## What This Does NOT Do
- No ML, no usage tracking — static curated map only
- No grid rearrangement — predictions are a separate layer
- No changes to existing button positions or behavior

## Files Changed
- `index.html` only — HTML, CSS, and JS additions
