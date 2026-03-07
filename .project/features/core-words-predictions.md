# Plan: Predictive Next-Word + Two-Tap Shortcuts

## The Problem

Core words on every screen got us to 3 taps for "I want more." But common requests like "I want cookie" still require: tap "I" -> tap "want" -> open Food folder -> find "cookie" = 4+ taps. We want 2-3 taps for the most common phrases.

## Solution: Prediction Strip

A horizontal strip of suggested next-words appears between the message bar and the grid after tapping a core word. This is an **additive UI layer** -- the grid never changes (motor planning safe).

### Layout

    +------------------------------------------+
    | [<-] [ I  want ]           [BS][S][SPK][X]|  <- message bar
    +------------------------------------------+
    | [chocolate milk] [cookie] [more] [help]  |  <- prediction strip (NEW)
    +------------------------------------------+
    | [ I ]  [want] [don't want] [help]        |  <- grid (unchanged)
    | [more] [stop] [yes]        [no]          |
    | ...                                       |
    +------------------------------------------+

### Prediction Sources (Blended Ranking)

Predictions come from two sources, merged and ranked:

**1. Curated Defaults (cold start)**

Static map providing sensible predictions for new users before any usage data exists:

    PREDICTIONS = {
      'I':          ['want', "don't want", 'like', 'help', 'go'],
      'want':       ['more', 'help', ...dynamicNouns],
      "don't want": ['stop', 'no', ...dynamicNouns],
      'like':       ['more', ...dynamicNouns],
      'help':       ['more', 'please', 'yes'],
      'more':       [...dynamicNouns],
      'go':         ['home', 'outside', 'bathroom', 'please'],
      'stop':       ['please', 'no', 'help'],
    }

Where `dynamicNouns` is resolved at render time by scanning the live buttons array for non-core-word items. Parent adds "chocolate milk" as a button -> it's immediately available.

**2. Learned Frequencies (usage-based)**

A bigram frequency model that watches what the child actually taps:

- Every time word B is tapped after word A, increment `bigramCounts[A][B]`
- Stored in localStorage key `aac-bigram-counts`
- Persisted across sessions, fully offline, no data leaves the device
- Example after a week of use:

      bigramCounts = {
        'want': { 'chocolate milk': 47, 'cookie': 12, 'more': 8, 'water': 5 },
        'I':    { 'want': 89, "don't want": 15, 'help': 7 },
        ...
      }

**3. Blended Ranking Algorithm**

At prediction time, `renderPredictions(lastWord)` does:

1. Get curated defaults for `lastWord` (if any)
2. Get learned bigrams for `lastWord` (if any)
3. Merge into a single candidate list (union of both sets)
4. Score each candidate: `learnedCount + (isCuratedDefault ? coldStartBonus : 0)`
5. `coldStartBonus` = a small fixed value (e.g., 3) so defaults show up initially but are quickly overtaken by real usage
6. Sort by score descending, take top N (6-8 chips max, fits the strip)
7. Filter: only show words that exist as actual buttons in the current vocabulary
8. **Reserve therapeutic slots**: Always keep 1-2 slots at the end of the strip for curated/default words, even when learned data dominates. This ensures the child is exposed to vocabulary they haven't used yet -- a core principle in speech therapy (aided language stimulation). Without this, the system would only reinforce existing vocabulary and never expand it.

Result: "chocolate milk" after "want" 47 times = it's always the first chip. New users still get sensible defaults. And even power users see a curated word or two they might not have tried yet.

### How Two-Tap Works

| Taps | Action | Sentence |
|------|--------|----------|
| 1 | Tap "I" | bar: "I", predictions: [want, don't want, like, help, go] |
| 2 | Tap prediction "want" | bar: "I want", predictions: [chocolate milk, cookie, more, water...] |
| 3 | Tap prediction "chocolate milk" | bar: "I want chocolate milk", speaks it, predictions clear |

So "I want chocolate milk" = 3 taps. "help please" = 2 taps. "more water" = 2 taps.

After a week of use, the child's most-requested items float to the top automatically.

### Behavior Rules

1. Predictions appear after tapping a **core word** (grid or prediction chip)
2. Tapping a **prediction chip** adds that word to the message bar
3. If the predicted word is a **non-core word** (noun like "cookie"), behavior depends on the **Auto-Speak** setting (see Step 9):
   - **Auto-Speak ON (default)**: speaks the full sentence automatically and clears predictions
   - **Auto-Speak OFF**: adds the word to the message bar, shows a "speak" chip as the first prediction plus follow-up predictions (e.g., "please", descriptors), and lets the child decide when the sentence is done
4. If the predicted word is a **core word** (like "want"), it chains -- shows next predictions silently
5. Predictions **clear** when: sentence is cleared, backspace removes the triggering word, or user taps a folder
6. Prediction chips inherit Fitzgerald Key colors matching the word type
7. Every tap (grid or prediction chip) records the bigram for learning

## Implementation Steps

### Step 1: Add HTML
Add `<div id="prediction-bar"></div>` between `#message-bar` and `#grid-container` inside `#view-talk`.

### Step 2: Add CSS
- Horizontal scrollable strip, ~44px tall
- Hidden by default (`display: none`), shown when predictions exist
- Chips styled as rounded pills with Fitzgerald Key colors
- Slide-down entrance animation

### Step 3: Bigram Frequency Model
- `bigramCounts` object loaded from localStorage on init
- `recordBigram(prevWord, currentWord)` -- increments count, saves to localStorage
- `getLearnedPredictions(word)` -- returns array of `{word, count}` sorted by frequency
- Debounced save (batch writes to localStorage, not on every single tap)

### Step 4: Add PREDICTIONS map + dynamic noun resolution
- Curated defaults map defined as a constant
- `getDynamicNouns()` function scans the buttons array at call time for non-core items
- Returns labels of common category items (food, drinks, toys, etc.)

### Step 5: Add renderPredictions(lastWord) function
- Calls `getLearnedPredictions(lastWord)` for usage-based candidates
- Calls curated defaults lookup for cold-start candidates
- Merges, scores, and ranks using blended algorithm
- Filters to only words that exist as actual buttons
- Creates tappable chips with Fitzgerald Key colors
- Populates `#prediction-bar` and shows it

### Step 6: Hook into addWordToMessage()
- Record the bigram: `recordBigram(previousWord, currentWord)`
- Call `renderPredictions(word)` if the word has any predictions (curated or learned)
- Clear predictions if no candidates exist

### Step 7: Prediction chip tap handler
- Adds word to message bar
- Records bigram (prediction taps count too)
- If word is non-core: speak full sentence, clear predictions
- If word is core: chain to next predictions silently

### Step 8: Parent mode -- Reset learned data option
- Add a "Reset word predictions" button in parent mode settings
- Clears `aac-bigram-counts` from localStorage
- Useful if device is shared between children or usage patterns change significantly

### Step 9: Parent mode -- Auto-Speak toggle
- Add an "Auto-speak sentences" toggle in parent mode settings
- **Default: ON** -- tapping a non-core word (noun) auto-speaks the full sentence and clears predictions (fewest taps for early communicators)
- **OFF** -- tapping a non-core word adds it to the message bar without speaking, shows a "speak" chip as the first prediction plus follow-up words like "please" or descriptors, letting the child build longer utterances before choosing to speak
- Stored in localStorage key `aac-auto-speak` (boolean)
- Clinical rationale: Auto-speak is great for early communicators who need immediate reinforcement, but as a child progresses, therapists want to encourage longer sentences. This toggle lets parents/SLPs graduate the child without changing the app

### Step 10: Parent mode -- Usage insights (future)
- Display bigram frequency data in a simple, readable format in parent mode
- Example: "Top phrases this week: 'I want chocolate milk' (47x), 'I want cookie' (12x), 'help please' (8x)"
- Clinical rationale: This is essentially free data collection -- therapists spend significant time tracking word usage manually. Surfacing this data helps caregivers and SLPs see progress and identify patterns
- **NOTE**: This is a future enhancement, not part of the initial implementation. Tracked here so we don't lose the idea

## Acceptance Criteria

- [ ] Prediction strip appears after tapping any core word
- [ ] Chips show Fitzgerald Key colors
- [ ] Curated defaults appear for brand new users (no usage data)
- [ ] After repeated use, most-tapped words rise to the top of predictions
- [ ] Dynamic nouns: adding a new button in parent mode makes it available as a prediction
- [ ] Bigram data persists across sessions in localStorage
- [ ] "Reset word predictions" option exists in parent mode
- [ ] "Auto-speak sentences" toggle exists in parent mode (default ON)
- [ ] With auto-speak OFF, nouns add to message bar and show "speak" chip + follow-up predictions
- [ ] With auto-speak ON, nouns trigger speak and clear (original behavior)
- [ ] 1-2 prediction slots always reserved for curated/therapeutic words even with heavy usage data
- [ ] Grid positions never change -- predictions are a separate layer
- [ ] Minimum 44x44px touch targets on prediction chips
- [ ] Strip scrolls horizontally if more predictions than screen width
- [ ] Fully offline -- no network calls

## What This Does NOT Do

- No cloud ML -- simple local bigram counts only
- No grid rearrangement -- predictions are a separate layer
- No changes to existing button positions or behavior
- No data leaves the device

## Files Changed

- `index.html` only -- HTML, CSS, and JS additions
