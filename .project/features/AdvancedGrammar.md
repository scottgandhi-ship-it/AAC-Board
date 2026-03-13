# Advanced Grammar

## Executive Summary

Expand the grammar engine beyond the current Basic Grammar (plurals, 3rd-person verb conjugation, article insertion) to support developmentally critical grammatical forms for early AAC users ages 3-5. Based on clinical consultation with an Early Intervention Specialist and mapped to Brown's Stages of Language Development.

The existing grammar pipeline (applyGrammar -> speak) stays intact. We add new transformation rules and a grammar levels system so SLPs can match the device to each child's developmental stage.

## Current State

Already implemented (BasicGrammar):
- Auto-plurals after "more" (18 irregular overrides)
- 3rd-person verb conjugation (33 verbs)
- Optional article insertion (a/an, 15 uncountable nouns)
- Double-tap noun pluralization (800ms window)
- Spanish grammar support (gender-aware articles, verb forms, plurals)
- Per-rule toggles in Settings -> Communication -> Grammar Assistance
- Grammar only affects spoken output; button labels never change
- Word categories detected via Fitzgerald Key color mapping

## Requirements (Priority Order)

### P1: Present Progressive (-ing)
- Pronoun + action verb -> "pronoun + am/is/are + verb-ing"
- "I eat" -> "I am eating", "he play" -> "he is playing"
- Stative verbs excluded (want, like, need, have, know, see, hear, feel, love, hate)
- Maps to Brown's Stage I-II (19-28 months developmental age)
- Clinical rationale: the earliest grammatical morpheme acquired; nearly every SLP targets this for 3-5 year old AAC users

### P2: Negation Patterns
- "no" + verb -> "don't [verb]": "no want" -> "don't want"
- 3rd person: "he no want" -> "he doesn't want"
- "no" at start of utterance (standalone) stays as "no"
- "no" + noun stays as "no [noun]" (valid early form: "no cookie")
- Maps to Brown's Stage I-II (24-30 months)
- Clinical rationale: refusal/rejection is a fundamental communicative right (ASHA Communication Bill of Rights)

### P3: Possessives
- Possessive pronoun support: my, your, his, her, our, their
- Noun possessives: [noun/name] + [noun] -> "[noun]'s [noun]": "Mommy cup" -> "Mommy's cup"
- Maps to Brown's Stage III (31-34 months)
- Clinical rationale: identity and ownership language, high-frequency daily need

### P4: Past Tense Expansion
- Triggered by temporal words: "yesterday", "before", "already", "finished", "done", "last"
- Regular past tense: add -ed with spelling rules (drop silent e, double final consonant, y -> ied)
- Expanded irregular verb table (45+ high-frequency irregulars for young children)
- NOT automatic -- requires temporal trigger word in utterance
- Maps to Brown's Stage III-IV (30-40 months)
- Clinical rationale: lets children talk about past events; intentional trigger supports aided language stimulation

### P5: Copula Insertion (is/am/are)
- Pronoun + descriptor -> insert copula: "I happy" -> "I am happy", "she sad" -> "she is sad"
- Mapping: I -> am, he/she/it -> is, you/we/they -> are
- Only applies when pronoun is followed by a descriptor (blue category in Fitzgerald Key)
- Maps to Brown's Stage III (31-34 months)
- Clinical rationale: unambiguous pattern, makes output sound more natural

### P6: Grammar Levels System (Critical Infrastructure)
- Replace individual per-rule toggles with a level selector
- **Level 0 -- No grammar**: Output exactly what is tapped, word by word
- **Level 1 -- Basic**: Plurals after "more", present progressive (-ing) on action verbs
- **Level 2 -- Intermediate**: Add negation patterns, possessives, copula insertion
- **Level 3 -- Full**: Add past tense, article insertion, all transformations
- Individual toggles remain as overrides within each level (advanced/SLP use)
- Default: Level 1
- Clinical rationale: SLPs need to match grammar to the child's current Brown's Stage; without this, clinicians won't trust the app enough to recommend it

### P7: Double-Tap Window Adjustment
- Change default from 800ms to 1200ms
- Make configurable in settings (Accessibility section)
- Clinical rationale: many AAC users with motor planning difficulties have 1-2 second tap latency

## Architecture Overview

### Grammar Pipeline (Updated)

The existing pipeline stays the same:

    messageWords + messageButtonIds
      -> applyGrammar(words, btnIds)
      -> grammatically corrected string
      -> speak(correctedString)

### Rule Application Order

Rules applied in this order (each operates on the output of the previous):
1. Present progressive (-ing) -- new
2. Verb conjugation (3rd person -s) -- existing
3. Negation patterns -- new
4. Pluralization (after "more") -- existing
5. Possessives -- new
6. Copula insertion (is/am/are) -- new
7. Article insertion -- existing
8. Past tense (temporal trigger) -- new

NOTE: Present progressive and verb conjugation are mutually exclusive for a given verb. If -ing applies, 3rd-person -s does not. Rule 1 marks verbs it transforms so Rule 2 skips them.

Also note: Past tense (Rule 8) overrides -ing and 3rd-person when a temporal trigger is present. If "yesterday" appears in the utterance, verbs get past tense, not progressive or present conjugation.

### Grammar Level Gating

Each rule belongs to a level. The active grammar level determines which rules run:

| Rule | Level 0 | Level 1 | Level 2 | Level 3 |
|------|---------|---------|---------|---------|
| Plurals (more +) | -- | active | active | active |
| Progressive (-ing) | -- | active | active | active |
| 3rd person (-s) | -- | active | active | active |
| Negation (don't) | -- | -- | active | active |
| Possessives ('s) | -- | -- | active | active |
| Copula (is/am/are) | -- | -- | active | active |
| Articles (a/an) | -- | -- | -- | active |
| Past tense (-ed) | -- | -- | -- | active |

Individual rule toggles still exist as overrides. An SLP can set Level 2 but manually enable past tense if their client is working on it.

### Data Structures (New)

**STATIVE_VERBS** set:
    want, like, need, have, know, see, hear, feel, love, hate, understand

**ACTION_VERB_ING** map (for irregular -ing forms):
    run -> running, sit -> sitting, swim -> swimming, get -> getting,
    cut -> cutting, hit -> hitting, put -> putting, hug -> hugging,
    dig -> digging, stop -> stopping, begin -> beginning, die -> dying,
    lie -> lying, tie -> tying

Default -ing rule: drop trailing silent "e" then add "ing", otherwise just add "ing".

**IRREGULAR_PAST** expanded map (add to existing VERB_FORMS):
    go -> went, eat -> ate, drink -> drank, run -> ran, fall -> fell,
    get -> got, see -> saw, come -> came, make -> made, give -> gave,
    take -> took, sit -> sat, stand -> stood, say -> said, tell -> told,
    find -> found, lose -> lost, break -> broke, throw -> threw,
    catch -> caught, bring -> brought, buy -> bought, think -> thought,
    know -> knew, read -> read, write -> wrote, draw -> drew,
    sing -> sang, sleep -> slept, wake -> woke, ride -> rode,
    swim -> swam, fly -> flew, grow -> grew, blow -> blew,
    wear -> wore, tear -> tore, bite -> bit, hit -> hit, cut -> cut,
    put -> put, hurt -> hurt, hold -> held, leave -> left,
    build -> built, win -> won, hide -> hid

**TEMPORAL_TRIGGERS** set:
    yesterday, before, already, finished, done, last

**POSSESSIVE_PRONOUNS** map:
    I -> my, he -> his, she -> her, it -> its, you -> your,
    we -> our, they -> their

**NEGATION_MAP**:
    Default: "don't" + base verb
    3rd person (he/she/it): "doesn't" + base verb

## Task Breakdown

### Phase 1: Grammar Levels System (P6)

Do this FIRST because all new rules need to be level-gated.

**Task 1.1: Grammar level data model**
- Add `grammarLevel` setting (0-3), default 1
- Persist to localStorage key `aac-grammar-level`
- Include in export/import
- Dependencies: None

**Task 1.2: Settings UI -- Grammar levels selector**
- Replace the 3 individual checkboxes with a level dropdown/selector
- Show level name + description (matches Brown's Stage language)
- Keep individual rule toggles visible as "Advanced" section below the level selector
- Changing level auto-sets the individual toggles to match
- Individual toggles can override the level defaults
- Dependencies: Task 1.1

**Task 1.3: Level gating in applyGrammar()**
- Wrap each rule's application in a level check
- Existing rules (plurals, verb conjugation, articles) get level assignments
- Dependencies: Task 1.1

### Phase 2: Present Progressive (-ing) (P1)

**Task 2.1: Stative verb set + -ing formation**
- Create STATIVE_VERBS set
- Create ACTION_VERB_ING map for irregular -ing spellings
- Create `progressiveForm(verb)` function
- Dependencies: Phase 1

**Task 2.2: Auxiliary insertion (am/is/are)**
- When pronoun + action verb detected, insert auxiliary and apply -ing
- Pronoun mapping: I -> am, he/she/it -> is, you/we/they -> are
- Skip if verb is stative
- Mark transformed verbs so 3rd-person rule (existing) skips them
- Dependencies: Task 2.1

**Task 2.3: Integration into GRAMMAR_EN**
- Add progressive rule as first transformation in the pipeline
- Gated to Level 1+
- Dependencies: Task 2.2

### Phase 3: Negation Patterns (P2)

**Task 3.1: Negation detection and transformation**
- Detect "no" followed by a verb -> replace with "don't [verb]"
- With 3rd person pronoun preceding: "doesn't [verb]"
- Standalone "no" (start of utterance or before noun) stays unchanged
- Dependencies: Phase 1

**Task 3.2: Integration into GRAMMAR_EN**
- Add negation rule after progressive and verb conjugation
- Gated to Level 2+
- Dependencies: Task 3.1

### Phase 4: Possessives (P3)

**Task 4.1: Possessive pronoun mapping**
- When pronoun is followed by a noun and no verb intervenes, use possessive form
- "I ball" -> "my ball", "he cup" -> "his cup"
- Dependencies: Phase 1

**Task 4.2: Noun possessives**
- When noun/name followed by another noun (no verb between), add 's
- "Mommy cup" -> "Mommy's cup"
- Be conservative -- only apply when both words are nouns and adjacent
- Dependencies: Task 4.1

**Task 4.3: Integration into GRAMMAR_EN**
- Add possessive rule after pluralization
- Gated to Level 2+
- Dependencies: Task 4.2

### Phase 5: Copula Insertion (P5)

**Task 5.1: Pronoun + descriptor detection**
- When pronoun followed by descriptor (blue Fitzgerald Key), insert is/am/are
- "I happy" -> "I am happy", "she big" -> "she is big"
- Skip if a verb already appears between pronoun and descriptor
- Dependencies: Phase 1

**Task 5.2: Integration into GRAMMAR_EN**
- Add copula rule after possessives, before articles
- Gated to Level 2+
- Dependencies: Task 5.1

### Phase 6: Past Tense Expansion (P4)

**Task 6.1: Temporal trigger detection**
- Scan utterance for TEMPORAL_TRIGGERS words
- When found, set a flag for past-tense mode on the entire utterance
- Dependencies: Phase 1

**Task 6.2: Expanded irregular past table**
- Merge 45+ new irregular past forms into existing VERB_FORMS
- Add regular -ed formation with spelling rules
- Dependencies: Task 6.1

**Task 6.3: Past tense application**
- When temporal trigger is present, override progressive and present tense
- Apply past form to all verbs in the utterance
- Dependencies: Task 6.2

**Task 6.4: Integration into GRAMMAR_EN**
- Past tense runs last and can override earlier verb transformations
- Gated to Level 3+
- Dependencies: Task 6.3

### Phase 7: Double-Tap Window + Cleanup (P7)

**Task 7.1: Adjust double-tap default to 1200ms**
- Change DOUBLE_TAP_WINDOW constant from 800 to 1200
- Dependencies: None (can be done anytime)

### Phase 8: Spanish Parity

**Task 8.1: Spanish progressive (-ando/-iendo)**
- Spanish present progressive formation
- Auxiliary: estar (estoy, esta, estan)
- Dependencies: Phase 2 complete

**Task 8.2: Spanish negation**
- "no" + verb stays as "no [verb]" in Spanish (standard form)
- Simpler than English -- "no quiero" is already correct
- Dependencies: Phase 3 complete

**Task 8.3: Spanish possessives**
- mi, tu, su, nuestro/nuestra, su (plural)
- Gender agreement for nuestro/nuestra
- Dependencies: Phase 4 complete

## Integration Points

- **applyGrammar()**: Extended with new rule functions, level gating
- **GRAMMAR_EN**: New rules added to the transformation pipeline
- **GRAMMAR_ES**: Spanish equivalents for each new rule
- **Settings panel**: Grammar Assistance section redesigned with level selector
- **localStorage**: New key `aac-grammar-level`, existing per-rule keys preserved as overrides
- **Export/import**: Include grammar level in exported data

## Edge Cases

- Progressive + negation: "he no eat" -> "he isn't eating" (Level 2+) or "he doesn't eat" (depends on context). Default to "he doesn't eat" -- simpler and more common in early language.
- Possessive + plural: "Mommy cookies" -- is this possessive or just noun-noun? Conservative: only apply possessive when second noun is singular. If first noun had "more" before it, skip possessive.
- Past tense + progressive: "yesterday he eat" -> "yesterday he ate" (past wins). Never "yesterday he was eating" -- too complex for this stage.
- Stative verbs with copula: "I want happy" -- unlikely combination, but if it occurs, don't insert copula between "want" and "happy" since "want" is a verb.
- Custom buttons: unknown word category -> skip all grammar transformations for that word, pass through unchanged.
- Level 0 users: applyGrammar() returns words.join(' ') with zero transformations.

## Acceptance Criteria

### Grammar Levels
- [ ] Level selector appears in Settings -> Communication -> Grammar Assistance
- [ ] Level 0 passes all words through unchanged
- [ ] Level 1 applies plurals, progressive, and 3rd-person
- [ ] Level 2 adds negation, possessives, and copula
- [ ] Level 3 adds past tense and articles
- [ ] Individual rule toggles can override level defaults
- [ ] Level persists across sessions and is included in export/import

### Present Progressive
- [ ] "I eat" -> "I am eating"
- [ ] "he play" -> "he is playing"
- [ ] "she run" -> "she is running" (irregular -ing)
- [ ] "I want" -> "I want" (stative verb, no -ing)
- [ ] "I need" -> "I need" (stative verb, no -ing)

### Negation
- [ ] "no want" -> "don't want"
- [ ] "he no want" -> "he doesn't want"
- [ ] "no" (standalone) -> "no"
- [ ] "no cookie" -> "no cookie" (noun, not transformed)

### Possessives
- [ ] "I ball" -> "my ball"
- [ ] "he cup" -> "his cup"
- [ ] "Mommy cup" -> "Mommy's cup"

### Copula
- [ ] "I happy" -> "I am happy"
- [ ] "she big" -> "she is big"
- [ ] "they silly" -> "they are silly"

### Past Tense
- [ ] "yesterday I eat" -> "yesterday I ate"
- [ ] "before he play" -> "before he played"
- [ ] "already I go" -> "already I went" (irregular)

### Double-Tap
- [ ] Default window is 1200ms (up from 800ms)
