# Activity Walkthrough & Smart Vocabulary Surfacing

## Executive Summary

A new activity creation paradigm where parents describe an activity through a guided walkthrough, and the app automatically surfaces clinically-appropriate AAC vocabulary. Replaces the current "pick from 13 bundles" model with a richer, parent-driven approach backed by an advanced word relationship graph.

The core innovation: **Parents provide context. The app provides clinical expertise.**

## Problem Statement

Current activity system limitations:
- 13 hardcoded activity bundles with 16 static words each
- Parents cannot create meaningful custom activities (only basic keyword matching via ACTIVITY_KEYWORD_MAP)
- No semantic relationships between words (e.g., "wash" doesn't know it relates to "soap," "water," "clean")
- No way for parents to describe what actually happens during their specific routine
- Activity words are isolated from the 415-word general vocabulary

## Vision

Parent says: "Bath time. We run the water, add bubbles, wash hair and body with soap, play with rubber duck, rinse off, dry with towel, put on pajamas."

App responds with a clinically-structured word set:
- **Core words**: I, want, more, help, stop, all done, no, my turn
- **Actions**: wash, pour, splash, play, dry, put on, take off, rinse, squeeze
- **Objects**: water, soap, bubbles, towel, duck, pajamas, hair, body
- **Descriptors**: hot, cold, wet, clean, dirty, slippery, warm
- **Social/Regulatory**: help, wait, uh oh, yucky, nice, again, all done

All mapped from the parent's natural description, not from a static lookup table.

---

## Architecture

### Layer 1: Activity Vocabulary Graph (Data Foundation)

A semantic relationship system connecting words across multiple dimensions.

**Word Node Structure:**
- id, label, labelEs, color (Fitzgerald Key), icon, symbolKw
- categories: array of semantic tags (e.g., ["hygiene", "water-play", "sensory"])
- relatedWords: array of word IDs with relationship types
- activityAffinity: map of activity-type to relevance score (0-1)

**Relationship Types:**
- `action-object`: wash -> soap, wash -> hair, pour -> water
- `object-descriptor`: water -> hot, water -> cold, towel -> dry
- `action-result`: wash -> clean, dry -> warm
- `sequence`: undress -> wash -> rinse -> dry -> dress
- `sensory`: water -> wet, bubbles -> slippery, soap -> slippery
- `emotional`: doctor -> scared, playground -> fun, bedtime -> tired
- `location`: bath -> bathroom, playground -> outside
- `tool-use`: wash + soap, dry + towel, eat + spoon

**Activity Type Taxonomy:**
- hygiene: bath, teeth brushing, hair, handwashing
- meals: breakfast, lunch, dinner, snack
- outdoor: playground, walk, yard, pool
- routine: bedtime, morning, getting dressed, car ride
- learning: circle time, book time, school
- play: sensory play, art, toys, screen time
- medical: doctor, dentist, therapy
- errands: grocery, shopping
- social: playdate, party, family visit

### Layer 2: Parent Walkthrough UX (Input)

**Two entry paths:**

**Path A -- Quick Start (under 30 seconds):**
1. Parent taps "New Activity" in Activities tab
2. Types or speaks activity name (e.g., "bath time")
3. App matches to activity type taxonomy -> surfaces pre-built vocabulary set
4. Parent sees categorized word suggestions (core, actions, objects, descriptors, social)
5. Toggle words on/off, tap "Done"
6. Activity is created with personalized vocabulary

**Path B -- Guided Walkthrough (under 90 seconds):**
1. Parent taps "New Activity" -> "Describe It"
2. Guided prompts appear one at a time:
   - "What activity is this?" (free text or pick from list)
   - "What happens first?" (e.g., "turn on water")
   - "Then what?" (e.g., "add bubbles")
   - "Then what?" (repeatable, up to 8 steps)
   - "How does it end?" (e.g., "dry off with towel")
3. Each step is parsed against the vocabulary graph
4. Words are accumulated and deduplicated across steps
5. Final review screen shows all suggested words, categorized
6. Parent customizes and saves

**Parsing Strategy:**
- Keyword extraction from parent's natural language descriptions
- Match keywords against vocabulary graph nodes
- Expand matches via relationship edges (wash -> soap, water, clean)
- Score and rank words by relevance to the described activity
- Ensure core words are always included
- Cap initial suggestions at grid-appropriate count (16-24 words)

### Layer 3: Smart Surfacing (Output)

**Word Selection Algorithm:**
1. Start with universal core words (I, want, more, help, stop, all done)
2. Extract keywords from walkthrough steps
3. For each keyword, traverse vocabulary graph:
   - Direct matches (exact word in graph)
   - Action-object relationships (wash -> soap, towel)
   - Descriptor associations (water -> hot, cold)
   - Sensory/emotional connections (doctor -> scared, brave)
4. Score each candidate word:
   - Direct mention in walkthrough: +1.0
   - One hop in graph from mentioned word: +0.7
   - Two hops in graph: +0.4
   - Activity type affinity score: +0.3 * affinity
   - Core word bonus: +0.5
5. Sort by score, select top N words (based on grid size)
6. Assign stable positions using position allocation algorithm

**Position Allocation (Motor Planning):**
- Each word gets a deterministic position based on its ID hash
- Once a word is placed in an activity, its position is locked for that activity
- New words fill empty positions, never displace existing ones
- Core words always occupy the same positions (top row)

---

## Word Relationship Data -- Initial Activity Maps

### Activity: Bath Time
**Steps**: undress, run water, add bubbles, wash body, wash hair, rinse, play, dry, get dressed
**Core**: I, want, more, help, stop, all done, no, my turn
**Actions**: wash, pour, splash, play, dry, put on, take off, rinse, squeeze, rub
**Objects**: water, soap, bubbles, towel, duck, hair, body, tub, pajamas
**Descriptors**: hot, cold, wet, clean, dirty, slippery, warm, soft
**Social/Regulatory**: help, wait, uh oh, yucky, nice, again, all done, gentle
**Sensory**: warm, cold, wet, slippery, soft, bubbly

### Activity: Mealtime
**Steps**: sit down, choose food, serve, eat, drink, ask for more, all done
**Core**: I, want, more, help, stop, all done, no, don't want
**Actions**: eat, drink, cut, pour, stir, blow, bite, chew, open, give
**Objects**: plate, cup, spoon, fork, napkin, bowl, food (specific items)
**Descriptors**: hungry, full, yummy, yucky, hot, cold, big, little, more
**Social/Regulatory**: please, thank you, my turn, wait, share, all done
**Sensory**: crunchy, soft, hot, cold, sweet, sour

### Activity: Playground
**Steps**: put on shoes, go outside, choose equipment, play, take turns, snack, go home
**Core**: I, want, more, help, stop, all done, go, my turn
**Actions**: run, jump, climb, slide, swing, push, pull, throw, catch, kick
**Objects**: swing, slide, ball, sand, shoes, hat, water bottle
**Descriptors**: fast, slow, high, low, big, fun, scary, hot, tired
**Social/Regulatory**: my turn, your turn, wait, share, watch me, help, again

### Activity: Bedtime
**Steps**: put on pajamas, brush teeth, pick book, read story, lights out, goodnight
**Core**: I, want, more, help, no, all done, don't want
**Actions**: read, brush, put on, hug, kiss, sleep, sing, close, turn off
**Objects**: book, pajamas, toothbrush, blanket, pillow, light, teddy
**Descriptors**: tired, sleepy, dark, quiet, soft, scary, cozy, warm
**Social/Regulatory**: goodnight, love you, one more, all done, wait, shhh

### Activity: Getting Dressed
**Steps**: choose clothes, put on underwear, shirt, pants, socks, shoes
**Core**: I, want, help, no, don't want, more, all done
**Actions**: put on, take off, zip, button, pull, push, choose, wear
**Objects**: shirt, pants, socks, shoes, underwear, jacket, hat, zipper
**Descriptors**: big, little, tight, loose, soft, itchy, wet, dry, cold, hot
**Social/Regulatory**: help, my turn, I do it, wait, all done

### Activity: Doctor Visit
**Steps**: drive to office, wait in lobby, see doctor, exam, possibly shots, leave
**Core**: I, want, help, stop, no, all done, don't want
**Actions**: wait, sit, look, open, breathe, listen, point, touch
**Objects**: doctor, sticker, band-aid, arm, mouth, ears, eyes, tummy
**Descriptors**: scared, brave, gentle, cold, hurt, okay, sick, better
**Social/Regulatory**: help, wait, stop, all done, good job, it's okay, almost done

### Activity: Car Ride
**Steps**: get in car, buckle up, drive, listen to music, arrive
**Core**: I, want, more, help, stop, no, all done, go
**Actions**: go, stop, drive, buckle, listen, look, sing, wait
**Objects**: car, seat, window, music, snack, toy, book
**Descriptors**: fast, slow, far, close, loud, quiet, bumpy, fun
**Social/Regulatory**: are we there, wait, look, stop, more, again

### Activity: Grocery Store
**Steps**: get cart, walk aisles, pick items, put in cart, checkout, leave
**Core**: I, want, more, help, no, all done, don't want
**Actions**: push, pick, put, carry, walk, wait, open, give
**Objects**: cart, bag, apple, banana, milk, bread, list, money
**Descriptors**: heavy, big, little, yummy, cold, more, enough
**Social/Regulatory**: help, wait, my turn, please, thank you, all done

### Activity: Art Time
**Steps**: get supplies, choose colors, draw/paint, create, clean up
**Core**: I, want, more, help, all done, no
**Actions**: draw, paint, cut, glue, color, mix, stamp, press, squeeze, wash
**Objects**: paper, crayon, paint, brush, scissors, glue, marker, sticker
**Descriptors**: big, little, pretty, messy, wet, dry, red, blue, green, yellow
**Social/Regulatory**: my turn, look, help, more, all done, I made it

### Activity: Sensory Play
**Steps**: set up materials, explore textures, play, create, clean up
**Core**: I, want, more, help, stop, all done, no
**Actions**: touch, squeeze, pour, mix, press, pull, push, shake, smell
**Objects**: sand, water, slime, play dough, rice, beans, bubbles, bin
**Descriptors**: soft, hard, wet, dry, sticky, squishy, cold, warm, bumpy, smooth
**Social/Regulatory**: more, again, my turn, yucky, nice, uh oh, all done

### Activity: Book Time
**Steps**: choose book, sit down, open book, read/look at pictures, turn pages, done
**Core**: I, want, more, help, all done, no
**Actions**: read, look, turn, point, open, close, find, listen
**Objects**: book, page, picture, word, chair, lap
**Descriptors**: funny, scary, sad, happy, big, little, same, different
**Social/Regulatory**: more, again, my turn, read it, what's that, look, the end

### Activity: Circle Time
**Steps**: sit in circle, sing songs, calendar, story, movement activity
**Core**: I, want, more, help, all done, my turn
**Actions**: sit, sing, clap, dance, listen, watch, stand, wave
**Objects**: song, friend, teacher, calendar, mat, instrument
**Descriptors**: loud, quiet, fast, slow, happy, silly, fun
**Social/Regulatory**: my turn, your turn, wait, hello, goodbye, please, thank you

### Activity: Screen Time
**Steps**: choose show/game, sit down, watch/play, break time, all done
**Core**: I, want, more, help, stop, all done, no
**Actions**: watch, play, pause, start, pick, tap, swipe, listen
**Objects**: tablet, TV, show, game, video, remote, headphones
**Descriptors**: funny, loud, quiet, scary, fun, boring, favorite
**Social/Regulatory**: more, again, my turn, all done, too loud, wait

---

## Additional Activity Maps (New)

### Activity: Swimming / Pool
**Steps**: change into swimsuit, sunscreen, enter water, play, swim, dry off
**Core**: I, want, more, help, stop, all done, no, go
**Actions**: swim, splash, kick, jump, float, blow, dive, hold, dry
**Objects**: water, pool, towel, goggles, swimsuit, noodle, float, sunscreen
**Descriptors**: cold, warm, deep, wet, fun, scary, fast, slow
**Social/Regulatory**: help, wait, my turn, watch me, hold me, again, all done

### Activity: Haircut
**Steps**: go to salon, sit in chair, cape on, cut hair, wash, dry, done
**Core**: I, want, help, stop, no, all done, don't want
**Actions**: sit, cut, wash, dry, spray, comb, wait, hold still
**Objects**: chair, cape, scissors, mirror, hair, comb, water
**Descriptors**: short, long, wet, dry, gentle, loud, scared, brave, tickly
**Social/Regulatory**: help, stop, wait, all done, almost done, it's okay, good job

### Activity: Teeth Brushing
**Steps**: get toothbrush, add paste, brush, spit, rinse, done
**Core**: I, want, help, no, all done, more, open
**Actions**: brush, spit, rinse, open, close, squeeze, pour
**Objects**: toothbrush, toothpaste, cup, water, mouth, teeth, tongue
**Descriptors**: minty, yucky, clean, wet, gentle, tickly
**Social/Regulatory**: open wide, all done, good job, spit, my turn

### Activity: Playdate
**Steps**: friend arrives, greet, choose activity, play together, share, snack, goodbye
**Core**: I, want, more, help, no, my turn, stop
**Actions**: play, share, give, take, build, chase, hide, find, hug
**Objects**: friend, toy, game, snack, house, room
**Descriptors**: fun, mine, yours, same, different, nice, mean, silly
**Social/Regulatory**: hi, bye, my turn, your turn, share, please, thank you, sorry, let's play

### Activity: Morning Routine
**Steps**: wake up, potty, wash hands/face, get dressed, eat breakfast, brush teeth
**Core**: I, want, help, no, all done, more, go
**Actions**: wake up, go, wash, eat, drink, brush, put on, sit
**Objects**: potty, sink, water, soap, towel, clothes, breakfast, toothbrush
**Descriptors**: tired, hungry, cold, warm, wet, dry, clean, ready
**Social/Regulatory**: good morning, help, all done, I did it, let's go

### Activity: Therapy Session
**Steps**: arrive, greet therapist, warm up, activities, practice, cool down, goodbye
**Core**: I, want, more, help, stop, all done, no, my turn
**Actions**: sit, stand, walk, jump, climb, hold, push, pull, reach, try
**Objects**: ball, mat, swing, puzzle, blocks, table, chair, sticker
**Descriptors**: hard, easy, heavy, light, fast, slow, good, tired, strong
**Social/Regulatory**: help, my turn, more, again, all done, good job, I did it, break

---

## Keyword Extraction & Matching Strategy

### Approach: Client-Side Keyword Matching (No AI/API Required)

Since this is an offline-first PWA, vocabulary surfacing must work without network.

**Keyword Index Structure:**
A flat map from common English words/phrases to vocabulary graph node IDs.

Example:
- "wash" -> [act-wash, act-rinse, obj-soap, obj-water, desc-clean]
- "water" -> [obj-water, desc-wet, desc-cold, desc-hot, act-pour, act-splash]
- "eat" -> [act-eat, act-bite, act-chew, obj-spoon, obj-fork, obj-plate, desc-hungry]
- "play" -> [act-play, act-run, act-jump, desc-fun, soc-my-turn, soc-share]

**Parsing Algorithm:**
1. Normalize input: lowercase, strip punctuation
2. Tokenize into words and bigrams
3. Remove stop words (the, a, an, is, we, then, and, with, to, in, on)
4. Match remaining tokens against keyword index
5. Collect all referenced vocabulary graph nodes
6. Apply scoring (direct match > one-hop > two-hop)
7. Ensure core words are always included
8. Return top N words sorted by score

**Synonym Handling:**
Map common parent language to AAC vocabulary:
- "bath" / "bathe" / "tub" -> bathtime activity type
- "food" / "eat" / "lunch" / "dinner" / "snack" -> mealtime activity type
- "park" / "outside" / "recess" -> playground activity type
- "pjs" / "pajamas" / "jammies" -> obj-pajamas
- "potty" / "bathroom" / "toilet" -> hygiene activity type

---

## Implementation Phases

### Phase A: Vocabulary Graph Data Layer
**Scope**: Build the word relationship data structure and embed it in index.html
**Tasks**:
- A1: Define VOCABULARY_GRAPH constant with all word nodes and relationships
- A2: Define ACTIVITY_TYPE_TAXONOMY with activity categories
- A3: Define KEYWORD_INDEX for client-side text matching
- A4: Define SYNONYM_MAP for common parent language variations
- A5: Migrate existing 13 ACTIVITY_BUNDLES to use graph-backed word sets
- A6: Add 6 new activity maps (Swimming, Haircut, Teeth Brushing, Playdate, Morning Routine, Therapy Session) -> 19 total

**Acceptance Criteria**:
- All 19 activities have complete word sets across all categories (core, actions, objects, descriptors, social)
- Word relationships are bidirectional and typed
- Keyword index covers all words in the graph
- Existing activity functionality is unchanged (backward compatible)
- All words use correct Fitzgerald Key colors

### Phase B: Parent Walkthrough UX
**Scope**: Build the guided walkthrough flow for creating activities
**Tasks**:
- B1: "New Activity" button in Activities tab (parent mode only)
- B2: Quick Start path -- name/type input with instant vocabulary suggestion
- B3: Guided Walkthrough path -- step-by-step description prompts
- B4: Keyword extraction from parent descriptions (client-side parsing)
- B5: Vocabulary suggestion review screen with categorized word display
- B6: Word toggle UI (add/remove suggested words)
- B7: Save custom activity with graph-backed vocabulary
- B8: Spanish language support for walkthrough prompts and word suggestions

**Acceptance Criteria**:
- Quick Start path completes in under 30 seconds
- Guided Walkthrough completes in under 90 seconds
- Vocabulary suggestions include words parent didn't explicitly mention (the "magic moment")
- Core words are always included in suggestions
- Parent can toggle any suggested word on/off
- Custom activity integrates with existing activity system (start, end, tracking)
- All text has Spanish translations
- Accessible: keyboard navigable, screen reader compatible, 44px+ touch targets

### Phase C: Smart Surfacing & Position Stability
**Scope**: Scoring algorithm and motor-planning-safe position assignment
**Tasks**:
- C1: Word scoring algorithm (direct match, graph traversal, affinity scoring)
- C2: Position allocation algorithm (deterministic, stable across sessions)
- C3: Integration with existing renderGrid() activity overlay mode
- C4: Vocabulary level support (starter/expanded) for walkthrough-created activities
- C5: Activity slot overrides for early learner grids

**Acceptance Criteria**:
- Words never change position within a saved activity
- Scoring produces clinically appropriate word sets (validated against Marci's maps)
- Works with all grid sizes (1x1 through 6x6)
- Early learner slot customization works with new activities
- Starter level shows 6 contextually appropriate words

### Phase D: Enhanced Activity Management
**Scope**: Edit, duplicate, share walkthrough-created activities
**Tasks**:
- D1: Edit existing activity walkthrough (re-run walkthrough, modify words)
- D2: Duplicate activity as starting point for variations
- D3: Activity template export/import (.aactemplate JSON)
- D4: Activity usage insights integration (track word presses per activity)

**Acceptance Criteria**:
- Editing an activity preserves word positions for unchanged words
- Duplicated activities get new position allocations
- Export/import works offline
- Usage data captures activity context

---

## Integration Points

### Existing Systems Affected
- **ACTIVITY_BUNDLES** (Lines 4780-5067): Migrated to use vocabulary graph
- **getActivityWords()** (Lines 4767-4778): Updated to use graph-based word selection
- **ACTIVITY_KEYWORD_MAP** (Lines 8581-8595): Replaced by KEYWORD_INDEX
- **startActivity() / endActivity()**: No changes needed
- **renderGrid() activity mode** (Lines 6229-6305): Updated to handle variable word counts
- **Custom activities localStorage**: Extended with walkthrough data and graph references
- **Activity sessions tracking**: No changes needed

### New Data in localStorage
- `aac-custom-activities`: Extended with `walkthrough` field (steps array) and `graphWords` field (scored word list)
- Word positions per activity stored with activity data

### Service Worker
- No changes needed (all data is in index.html or localStorage)
- Bump cache version on deploy

---

## Risk Assessment

| Risk | Mitigation |
|------|-----------|
| Vocabulary graph bloats index.html | Estimate ~15-20KB for full graph; acceptable for single-file PWA |
| Parent walkthrough is too slow | Quick Start path as default; walkthrough is optional |
| Keyword matching misses important words | Graph relationships expand coverage; synonym map catches variants |
| Motor planning broken by dynamic positions | Deterministic position algorithm locked per activity |
| Too many words overwhelm the grid | Cap at grid-appropriate count; starter/expanded levels |
| Spanish translations incomplete | Use existing labelEs pattern; flag untranslated words |

---

## Open Questions for Developer

1. Should walkthrough-created activities visually differ from built-in activities? (e.g., badge or icon)
2. Should we allow parents to add words NOT in the vocabulary graph? (free-form custom words)
3. Priority: Should Phase A (data layer) ship standalone as a refactor, or only with Phase B (UX)?
4. Should the 6 new activities (Swimming, Haircut, etc.) be added to the built-in bundles, or only available via walkthrough?
