# Deep Vocabulary Expansion (Levels 1-2)

**Status**: PLANNING -- awaiting developer approval
**Phase**: Phase 2 (Enhance)
**Priority**: P0
**Clinical advisor**: Marci (Early Intervention Specialist)

---

## Executive Summary

Expand AAC-Board vocabulary from 283 communication words to 500-600, targeting children with autism ages 2-6. Focus on Level 1 (beginning communicators) and Level 2 (emerging communicators). All new words are clinically validated for pediatric autism AAC use, organized by activity context per design principles, and compatible with existing folder/grid architecture.

---

## Current State

**Total vocabulary items**: 409 (25 core + 258 fringe + 100 numbers + 26 letters)
**Communication words** (excluding numbers/letters): 283

### Current folders and word counts

| Folder | Words | Status |
|--------|-------|--------|
| Social (general) | 40 | Good coverage |
| Food | 25 | Good for Level 1-2 |
| Actions | 24 | Needs expansion |
| My Body | 22 | Has some sensory words mixed in |
| Feelings | 20 | Good for Level 1-2 |
| Toys | 20 | Good coverage |
| Things | 20 | Good coverage |
| Clothes | 16 | Good coverage |
| People | 14 | Has animals mixed in (dog, cat) |
| Places | 14 | Good coverage |
| Colors | 12 | Complete for Level 1-2 |
| Questions | 10 | Good coverage |
| Drinks | 9 | Needs a few more |
| Shapes | 8 | Complete for Level 1-2 |
| 123 | 100 | Complete |
| ABC | 26 | Complete |

### Core word strip

5 words: I, want, don't want, more, help

### 6x6 home grid extras

20 additional core words on home screen for advanced grid

---

## Gap Analysis (Marci-reviewed)

### Missing categories (need NEW folders)

**1. Animals** -- Currently dog and cat are buried in People folder
- Essential for: play, books, pretend, therapy activities, language building
- Children with autism often have strong animal interests (special interest category)
- Target: 16-20 words

**2. Time** -- No temporal vocabulary at all
- Essential for: transitions (a huge autism challenge), schedules, understanding routines
- Supports visual schedule feature integration
- Target: 12-16 words

**3. Nature/Weather** -- No outdoor/environment vocabulary
- Essential for: outdoor play, seasonal activities, science, sensory descriptions
- Target: 12-16 words

### Existing folders needing expansion

**4. Actions** (24 -> 40+) -- Missing critical verbs
- Mealtime: cut, pour, stir, cook, taste, bite, blow
- Self-care: brush (teeth/hair), comb, flush, wipe, dry
- Play: chase, hide, find, catch, tickle, climb, swing, dig, pour, blow (bubbles)
- Communication: say, tell, show, ask, answer
- Target: add 16-20 words

**5. Descriptors** -- Currently split across folders with no dedicated space
- Physical: hot, cold, wet, dry, fast, slow, loud, quiet, soft, hard
- Size/comparison: big, little are on 6x6 home grid only; need: tall, short, long, heavy, light, full, empty
- Quality: clean, dirty, new, old, same, different, broken, yucky, nice, pretty, ugly
- Target: new subfolder or expand existing -- 20-25 words

**6. Prepositions/Location** -- No spatial vocabulary
- Essential for: following directions, describing, requesting
- Words: in, on, under, behind, next to, up, down, out, off, over, here, there, away, between
- Target: 12-16 words

**7. Self-care/Hygiene** -- Some items in Body and Things but not organized for routine use
- Words: wash hands, brush teeth, go potty, take bath, get dressed, put on, take off, dry off, comb hair, flush, wipe
- Target: 10-12 words (could be subfolder of Body or standalone)

**8. School** -- No school-specific vocabulary
- Essential for: 55% of AAC procurement is schools; kids spend most waking hours there
- Words: circle time, line up, recess, art, music, story, paint, glue, marker, backpack, lunch, snack time, teacher, helper
- Target: 12-16 words

**9. Drinks** (9 -> 12-14) -- Minor expansion
- Add: grape juice, strawberry milk, tea, soda/pop
- Target: add 3-5 words

**10. People** (14 -> 16-18) -- Minor cleanup and expansion
- Move dog and cat to Animals folder
- Add: aunt, uncle, cousin, neighbor, therapist/helper, pet
- Target: net same after moving animals out, add 4-6 new

---

## Proposed New Folder Structure

### New folders to add

| Folder | Color (Fitzgerald) | Estimated words | Grid position |
|--------|-------------------|-----------------|---------------|
| Animals | orange (nouns) | 16-20 | Replace or add to home grid |
| Descriptors | blue (descriptors) | 20-25 | Replace or add to home grid |
| Time | purple (misc/abstract) | 12-16 | Replace or add to home grid |
| Nature | orange (nouns) | 12-16 | Available in 4x4 and 6x6 grids |
| School | orange (nouns) | 12-16 | Available in 4x4 and 6x6 grids |

### Grid size implications

- **3x3 grid** (9 folders): Currently Social, Food, Drinks, People, Feelings, Actions, Toys, My Body, Places. Consider swapping one for Animals (highest clinical value new folder).
- **4x4 grid** (16 folders): Room for all 5 new folders. May need to consolidate or use subfolders.
- **6x6 grid** (16 folders + 20 extras): Room for all new folders.

**Motor planning rule**: Existing folder positions MUST NOT change. New folders fill empty positions or extend the grid.

---

## Architecture Considerations

### Prepositions and Descriptors -- where do they live?

Option A: **New "Descriptors" folder** containing both adjectives and prepositions
- Pro: One place for "describing words"
- Con: Large folder (35+ words)

Option B: **Separate "Descriptors" and "Where" folders**
- Pro: Smaller, more focused folders; "Where" aligns with spatial concepts
- Con: Uses two folder slots

Option C: **Expand existing folders** -- put prepositions in Places, descriptors spread across relevant folders
- Pro: No new folders needed
- Con: Violates "find it in one place" principle; hard for kids to discover

**Marci's recommendation**: Option B. Children with autism often work on spatial concepts (in/on/under) as a specific therapy goal. Having a dedicated "Where" folder makes it easy for SLPs and parents to target these words during practice. Descriptors (hot/cold/big/small) are a different cognitive category.

### Self-care words -- where do they live?

Option A: **Expand "My Body" folder** to include self-care verbs
- Pro: Body-related actions near body parts makes sense
- Con: Mixes nouns (body parts) with verbs (wash, brush)

Option B: **New "Routines" or "Self-Care" folder**
- Pro: Activity-based organization (matches design principles)
- Con: Another folder

Option C: **Add to Actions folder**
- Pro: They are verbs
- Con: Actions folder already at 24 words, would get large

**Marci's recommendation**: Option A. In therapy, we work on body parts AND what we do with them together. "Where does it hurt?" and "Let's brush teeth" happen in the same context. Keep it activity-based. Rename to "My Body and Care" or keep as "My Body" with care verbs added at the end.

---

## Implementation Plan

### Subphase 1: New Folder Infrastructure
- Add Animals, Descriptors, Time, Where (prepositions), Nature, School folders to DEFAULT_BUTTONS
- Assign folder positions that respect motor planning (existing positions unchanged)
- Add CSS folder colors
- Update 3x3 folder set (add Animals, consider removing or keeping all 9 current)
- Update 4x4 display to show new folders
- Verify 6x6 layout accommodates all folders

### Subphase 2: Animals Vocabulary (16-20 words)
- Move dog and cat from People folder (preserve their button IDs, just change folderId)
- Add: fish, bird, horse, bunny/rabbit, bear, frog, butterfly, dinosaur, elephant, monkey, duck, cow, pig, chicken, snake, turtle
- Assign ARASAAC symbol IDs where available
- Add Spanish translations
- Add prediction chains (e.g., "I want" -> animals for "I want to see the ___")

### Subphase 3: Descriptors Vocabulary (20-25 words)
- Physical: hot, cold, wet, dry, fast, slow, loud, quiet, soft, hard
- Size: tall, short, long, heavy, light, full, empty
- Quality: clean, dirty, new, old, same, different, broken, yucky, nice, pretty
- All blue (Fitzgerald Key for descriptors)
- Add prediction chains

### Subphase 4: Time Vocabulary (12-16 words)
- Sequence: first, then, next, last, before, after
- When: now, later, soon, today, tomorrow, yesterday
- Period: morning, afternoon, night
- All purple (Fitzgerald Key for misc/abstract)
- Integration point: visual schedules can link to Time words

### Subphase 5: Prepositions / "Where" Vocabulary (12-16 words)
- Spatial: in, on, under, behind, next to, up, down, out, off, over
- Location: here, there, away, between, around, through
- All purple (Fitzgerald Key for prepositions)

### Subphase 6: Nature/Weather Vocabulary (12-16 words)
- Weather: sun, rain, snow, cloud, wind, hot outside, cold outside
- Nature: tree, flower, grass, bug, rock, water (outdoor), sky, moon, stars
- All orange (nouns)

### Subphase 7: School Vocabulary (12-16 words)
- Activities: circle time, line up, recess, art, music, story time, lunch, snack time
- Supplies: paint, glue, marker, backpack, paper, scissors (if not in Things already)
- People: helper, classmate (if not in People already)
- Mixed colors per Fitzgerald Key

### Subphase 8: Expand Existing Folders
- **Actions** (+16-20): chase, hide, find, catch, tickle, climb, dig, pour, blow, say, tell, show, ask, brush, comb, flush, wipe, dry, cook, taste
- **My Body** (+10-12): wash hands, brush teeth, go potty, take bath, get dressed, put on, take off, dry off, comb hair, flush, wipe
- **Drinks** (+3-5): grape juice, strawberry milk, tea, soda
- **People** (-2 moved to Animals, +4-6): aunt, uncle, cousin, therapist, neighbor, pet

### Subphase 9: Prediction Chain Updates
- Add bigram prediction entries for all new words
- Ensure new words appear in relevant prediction chains (e.g., "I want" -> new food/drink/toy items)
- Add therapeutic slots for new vocabulary categories

### Subphase 10: Spanish Translations
- Add Spanish labels for all new vocabulary items
- Verify TTS pronunciation for new Spanish words
- Update bilingual display

### Subphase 11: ARASAAC Symbol Mapping
- Map all new vocabulary items to ARASAAC pictogram IDs
- Verify symbols are age-appropriate and clear
- Flag any words without good ARASAAC matches for custom icon consideration

---

## Word Count Projection

| Category | Current | Adding | New Total |
|----------|---------|--------|-----------|
| Core words (strip) | 5 | 0 | 5 |
| Core words (6x6 extras) | 20 | 0 | 20 |
| Social | 40 | 0 | 40 |
| Food | 25 | 0 | 25 |
| Drinks | 9 | 4 | 13 |
| People | 14 | 4 (net: -2 moved + 6 new) | 18 |
| Feelings | 20 | 0 | 20 |
| Actions | 24 | 18 | 42 |
| Toys | 20 | 0 | 20 |
| Places | 14 | 0 | 14 |
| Things | 20 | 0 | 20 |
| Clothes | 16 | 0 | 16 |
| My Body | 22 | 10 | 32 |
| Colors | 12 | 0 | 12 |
| Shapes | 8 | 0 | 8 |
| Questions | 10 | 0 | 10 |
| **Animals (NEW)** | 0 | 18 | 18 |
| **Descriptors (NEW)** | 0 | 22 | 22 |
| **Time (NEW)** | 0 | 14 | 14 |
| **Where (NEW)** | 0 | 14 | 14 |
| **Nature (NEW)** | 0 | 14 | 14 |
| **School (NEW)** | 0 | 14 | 14 |
| Numbers | 100 | 0 | 100 |
| Letters | 26 | 0 | 26 |
| **TOTAL** | 409 | 132 | **541** |
| **Communication words** | 283 | 132 | **415** |

Adding numbers/letters: **541 total**. Communication words (excluding numbers/letters): **415**.

This lands us solidly in Level 2 range (300-600 words available) with room for parents and SLPs to add custom words to reach 600.

---

## Acceptance Criteria

- [ ] 6 new folders created (Animals, Descriptors, Time, Where, Nature, School)
- [ ] All new folders have correct Fitzgerald Key colors
- [ ] Existing folder positions unchanged (motor planning preserved)
- [ ] ~132 new vocabulary words added across new and existing folders
- [ ] Communication word count reaches 400+ (Level 2 range)
- [ ] Dog and cat moved from People to Animals (button IDs preserved)
- [ ] All new words have Spanish translations
- [ ] All new words mapped to ARASAAC symbols where available
- [ ] Prediction chains updated for new vocabulary
- [ ] 3x3 grid updated to include Animals folder
- [ ] 4x4 and 6x6 grids display all new folders
- [ ] No existing word positions changed
- [ ] Works offline (all new content cached by service worker)
- [ ] Lighthouse accessibility score 90+

---

## Dependencies

- None -- this can proceed independently on current architecture
- Parent Mode Refactor does NOT block this work
- No cloud infrastructure needed

---

## Risks

- **ARASAAC coverage**: Some words may not have good pictogram matches. Mitigation: flag for custom icons later.
- **Folder count on small screens**: 3x3 grid can only show 9 folders. New folders may only appear on 4x4+. Mitigation: most critical new folder (Animals) added to 3x3.
- **Performance**: 132 new button definitions added to DEFAULT_BUTTONS array. At ~500 total objects this is negligible for modern devices.
