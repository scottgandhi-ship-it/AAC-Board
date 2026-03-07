# Basic Grammar

## Executive Summary

Add lightweight grammar processing to the speech output pipeline. When the user builds a sentence and taps Speak, the app applies context-aware transformations: auto-plurals after "more", verb conjugation based on pronoun, and optional article insertion. Grammar only affects spoken output -- button labels never change.

## Requirements

1. Auto-plurals: "more" + noun -> plural form spoken (e.g., "more cookie" -> "more cookies")
2. Simple verb forms: conjugate based on preceding pronoun (e.g., "he want" -> "he wants")
3. Article insertion: optional "a"/"the" before nouns
4. Grammar applied at speech output time only (button labels stay unchanged)
5. Settings toggle to enable/disable grammar assistance
6. Graceful handling of irregular forms

## Architecture Overview

### Design Principles

- **Non-destructive**: Grammar never modifies messageWords array or button labels
- **Applied at speak time**: Transform the joined sentence string before passing to TTS
- **Rule-based, not ML**: Simple lookup tables and pattern matching
- **ID-aware**: Use button IDs (not labels) to determine word categories
- **Extensible**: Easy to add Spanish grammar rules later (Milestone 3.3)

### Grammar Pipeline

```
messageWords (labels)
  -> applyGrammar(messageWords, messageButtonIds)
  -> grammatically corrected string
  -> speak(correctedString)
```

New requirement: track button IDs alongside labels in the message bar so grammar knows word types.

### Data Changes

- `messageWords` stays as-is (array of label strings)
- Add parallel array `messageButtonIds` (array of button ID strings)
- Both arrays stay in sync (push/pop/clear together)
- Grammar reads both arrays to determine context

## Task Breakdown

### Phase 2A: Message Bar ID Tracking

**Task 2A.1: Add messageButtonIds parallel array**
- Create `let messageButtonIds = []` alongside existing `messageWords`
- Update `addWordToMessage(label)` to also accept buttonId parameter
- Update all call sites to pass button ID:
  - createCell click handler (has btn.id)
  - prediction chip click handler (has pred.id)
  - core word strip click handler (has btn.id)
- Update clear, backspace, and any other message manipulation to keep arrays in sync
- Dependencies: None
- Acceptance: messageButtonIds always matches messageWords in length and order

### Phase 2B: Grammar Rules Engine

**Task 2B.1: Word category detection**
- Create `getWordCategory(buttonId)` function
- Returns: 'pronoun', 'verb', 'noun', 'descriptor', 'social', 'negation', 'preposition', or 'unknown'
- Detection strategy:
  - Look up button in `buttons` array by ID
  - Map Fitzgerald Key colors: yellow=pronoun, green=verb, orange=noun, blue=descriptor, pink=social, purple=preposition, red=negation
  - Special case: core words detected by type='core'
- Dependencies: Task 2A.1
- Acceptance: Correctly categorizes all default vocabulary

**Task 2B.2: Plural rules**
- Create `PLURAL_OVERRIDES` map for irregular plurals:
  - 'fish' -> 'fish', 'child' -> 'children', 'mouse' -> 'mice', etc.
  - Focus on vocabulary items actually in the app
- Create `pluralize(word)` function:
  - Check PLURAL_OVERRIDES first
  - Rules: -s, -es (after s/sh/ch/x/z), -ies (consonant+y), -ves (f/fe)
  - Default: append 's'
- Trigger: when "more" precedes a noun, or noun tapped twice consecutively
- Dependencies: Task 2B.1
- Acceptance: "more cookie" -> "more cookies", "more fish" -> "more fish"

**Task 2B.3: Verb conjugation**
- Create `VERB_FORMS` map for common verbs:
  - Base form, 3rd person singular, past tense
  - Example: { base: 'want', thirdPerson: 'wants', past: 'wanted' }
  - Cover all verbs in default vocabulary
- Create `conjugateVerb(verbLabel, precedingPronoun)` function:
  - 1st person (I): base form ("I want")
  - 2nd person (you): base form ("you want")
  - 3rd person (he/she/it): 3rd person form ("he wants")
  - Plural (we/they): base form ("we want")
  - No pronoun: base form (default)
- Dependencies: Task 2B.1
- Acceptance: "he want cookie" -> "he wants cookie"

**Task 2B.4: Article insertion**
- Create `needsArticle(nounId, context)` function
- Rules:
  - Insert "a" before singular countable nouns when no article/determiner present
  - Insert "an" before vowel sounds
  - Skip for uncountable nouns (water, milk, juice -- maintain skip list)
  - Skip when "more" precedes (already has determiner)
  - Skip when possessive precedes (my, your)
- This is the most nuanced rule -- make it optional (off by default)
- Dependencies: Task 2B.1
- Acceptance: "I want cookie" -> "I want a cookie" (when enabled)

### Phase 2C: Grammar Pipeline Integration

**Task 2C.1: Create applyGrammar() function**
- Takes: `messageWords` array, `messageButtonIds` array
- Returns: grammatically transformed string
- Applies rules in order:
  1. Verb conjugation (based on preceding pronoun)
  2. Pluralization (based on "more" or double-tap)
  3. Article insertion (if enabled)
- Each rule only modifies a copy of the words, never the originals
- Dependencies: Phase 2B complete
- Acceptance: Full sentence transformation works correctly

**Task 2C.2: Hook into speak pipeline**
- Modify the #btn-speak click handler:
  - Before: `speak(messageWords.join(' '))`
  - After: `speak(applyGrammar(messageWords, messageButtonIds))`
- Also apply grammar when auto-speaking full sentence (prediction chain completion)
- Individual word taps still speak raw label (no grammar on single words)
- Dependencies: Task 2C.1
- Acceptance: Speak button outputs grammatically correct sentences

**Task 2C.3: Settings toggle**
- Add "Grammar Assistance" toggle in settings/parent mode
- Sub-toggles (all on by default except articles):
  - Auto-plurals: on
  - Verb conjugation: on
  - Article insertion: off (more advanced, opt-in)
- Persist to localStorage: `aac-grammar-plurals`, `aac-grammar-verbs`, `aac-grammar-articles`
- Dependencies: Task 2C.1
- Acceptance: User can enable/disable each grammar rule independently

### Phase 2D: Double-Tap Plural

**Task 2D.1: Detect double-tap on noun**
- Track last tapped button ID and timestamp
- If same noun button tapped within 800ms: treat as plural request
- Replace the duplicate word in messageWords with pluralized form
- Speak the plural form
- Visual feedback: brief highlight on the word chip
- Dependencies: Phase 2C complete
- Acceptance: Tapping "cookie" twice quickly adds "cookies" (not "cookie cookie")

## Integration Points

- **addWordToMessage()**: Extended to accept and store button ID
- **speak()**: No changes to speak() itself; grammar applied before calling it
- **#btn-speak handler**: Calls applyGrammar() before speak()
- **Prediction chips**: Pass button ID to addWordToMessage()
- **Core word strip**: Pass button ID to addWordToMessage()
- **Settings panel**: New grammar toggles added
- **SPEAK_OVERRIDES**: Still applied after grammar (pronunciation layer)

## Edge Cases

- Unknown words (custom buttons): skip grammar, speak as-is
- Empty message bar: no grammar to apply
- Single word: no grammar context, speak raw
- "don't want" as a multi-word core button: treat as single verb unit
- Consecutive verbs: only conjugate the first one after a pronoun
- Negation: "don't" + verb stays base form ("he don't want" -- don't over-correct casual speech)

## Acceptance Criteria

1. "I want cookie" speaks as "I want cookie" (1st person, no change needed)
2. "he want cookie" speaks as "he wants cookie" (3rd person conjugation)
3. "more cookie" speaks as "more cookies" (auto-plural after "more")
4. "I want a cookie" works when article insertion is enabled
5. Double-tapping "cookie" produces "cookies" not "cookie cookie"
6. Grammar toggle in settings works and persists
7. Button labels never change -- grammar is speech-only
8. Custom/unknown words pass through unchanged
9. No performance impact on tap-to-speak latency
