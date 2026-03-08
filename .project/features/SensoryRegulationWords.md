# Sensory/Regulation Words

**Status**: PLANNING
**Phase**: Phase 2 (Enhance)
**Priority**: P0
**Clinical advisor**: Marci (Early Intervention Specialist)

---

## Executive Summary

Add sensory and self-regulation vocabulary to the AAC Board so children with autism can communicate body states, sensory overwhelm, and coping needs. This is the highest clinical-impact vocabulary gap remaining after Levels 1-2. Being able to say "too loud" or "need squeeze" is often the difference between a meltdown and a managed moment.

---

## Clinical Rationale (Marci)

Children with autism frequently experience sensory processing differences. Without vocabulary to communicate these states, they resort to behavioral responses (meltdowns, shutdowns, aggression, elopement). Giving them words for what they're feeling in their body -- and words for what helps -- is a core therapeutic goal across OT, DT, and Speech.

**Key distinction**: Feelings (happy, sad, angry) are EMOTIONAL states. Sensory/regulation words are BODY states and COPING strategies. They belong in different clinical categories.

---

## Current State

**Existing sensory-adjacent words**:
- Feelings folder (20 words): includes "overwhelmed" and "need a break" (position 15, 19)
- My Body folder (32 words): includes "hurts", "sick", "fever", "itchy", "dizzy", "too loud", "too bright", "allergic" (positions 12-21)

**Gaps**:
- Body states: hungry, thirsty, hot (body), cold (body), tight, tingly, shaky
- Sensory input: too fast, too close, too much, stinky/smelly
- Coping/regulation requests: need squeeze, need quiet, need space, want blanket, want hug, cover ears, close eyes, deep breath, count to 10, rock/swing
- Urgency words: "it hurts" and "stop" exist but aren't grouped with other sensory words for easy access

---

## Architecture Decision: Where Do These Words Live?

**Option A**: Expand My Body folder (already 32 words, would hit 45+)
- Pro: Body states near body parts
- Con: Folder becomes very large; mixes nouns, verbs, states, and coping strategies

**Option B**: Add words to Feelings folder (already 20 words)
- Pro: Emotional and sensory states together
- Con: Clinically different categories; folder gets large

**Option C**: New "I Feel" or "My Senses" folder for body states + coping strategies
- Pro: Dedicated space for sensory communication; easy for SLPs to target; clean separation from emotions and body parts
- Con: Another folder on the grid

**Marci's recommendation**: Option C. In therapy, we work on sensory vocabulary as its own domain. "I feel hot" (body state) is different from "I feel happy" (emotion). A dedicated folder lets SLPs and parents find and model these words quickly during high-stress moments. Name it "I Feel" to keep it child-friendly and distinct from "Feelings" (emotions).

**Decision**: Option C -- New "I Feel" folder

---

## Proposed Vocabulary (18-20 words)

### Body States (blue -- descriptors)
| Position | ID | Label | Color | Spanish |
|----------|------|---------|-------|---------|
| 0 | sense-hungry | hungry | blue | hambriento |
| 1 | sense-thirsty | thirsty | blue | sediento |
| 2 | sense-hot | hot | blue | calor |
| 3 | sense-cold | cold | blue | frio |
| 4 | sense-tight | tight | blue | apretado |
| 5 | sense-shaky | shaky | blue | tembloroso |
| 6 | sense-too-fast | too fast | blue | muy rapido |
| 7 | sense-too-close | too close | blue | muy cerca |
| 8 | sense-too-much | too much | red | demasiado |
| 9 | sense-stinky | stinky | blue | apestoso |

### Coping/Regulation Requests (green -- verbs/actions)
| Position | ID | Label | Color | Spanish |
|----------|------|---------|-------|---------|
| 10 | sense-need-squeeze | need squeeze | green | necesito apretar |
| 11 | sense-need-quiet | need quiet | green | necesito silencio |
| 12 | sense-need-space | need space | green | necesito espacio |
| 13 | sense-want-hug | want hug | green | quiero abrazo |
| 14 | sense-want-blanket | want blanket | green | quiero cobija |
| 15 | sense-cover-ears | cover ears | green | tapar oidos |
| 16 | sense-close-eyes | close eyes | green | cerrar ojos |
| 17 | sense-deep-breath | deep breath | green | respirar profundo |

**Total**: 18 new words

---

## Folder Configuration

- **Folder ID**: senses
- **Label**: I Feel
- **Color**: blue (descriptors -- Fitzgerald Key)
- **Position**: 22 (next available after School at 21)
- **Grid visibility**:
  - 3x3: YES -- add to THREE_BY_THREE_FOLDERS (replaces nothing; the 3x3 set currently has 9 folders which fits a 3x3 grid, but folder visibility filtering allows more than 9 in the set. Kids scroll or the grid wraps. Actually need to check this.)
  - 4x4: YES -- add to FOUR_BY_FOUR_FOLDERS
  - 5x5+: YES -- always visible

**NOTE**: On 3x3 grid, this folder is critical for the target population. A child who can't say "too loud" on the starter grid has no voice for sensory needs. Consider swapping a less-critical 3x3 folder or ensuring the grid can accommodate 10 items.

---

## Implementation Plan

### Subphase 1: Folder Infrastructure
- Add folder-senses to DEFAULT_BUTTONS (type: folder, position: 22)
- Add "senses" to THREE_BY_THREE_FOLDERS and FOUR_BY_FOUR_FOLDERS
- Add CSS color rule for the folder
- Add FOLDER_ICONS entry
- Verify grid layout accommodates the new folder on all grid sizes

### Subphase 2: Vocabulary Words
- Add 18 button entries to DEFAULT_BUTTONS with folderId: 'senses'
- All body state words: color blue
- All coping/regulation words: color green
- Positions 0-17

### Subphase 3: ARASAAC Symbols + Icons
- Add BUTTON_ICONS for all 18 words
- Add SYMBOL_KEYWORDS for ARASAAC search
- Map to pictogram IDs where available

### Subphase 4: Spanish Translations
- Add Spanish labels to LANG_ES.labels
- Add Spanish symbolKeywords to LANG_ES.symbolKeywords

### Subphase 5: Prediction Chains
- Add chains from sensory words to coping words:
  - sense-too-much -> sense-need-quiet, sense-need-space, sense-deep-breath
  - sense-hot -> sense-need-space, drink-water
  - sense-cold -> sense-want-blanket, sense-want-hug
  - sense-shaky -> sense-deep-breath, sense-need-squeeze, sense-want-hug
- Add "I feel" -> sensory words chain from core-i

### Subphase 6: Existing User Migration
- Add migration logic in init() to auto-add new folder and words for existing users
- Same pattern as Deep Vocabulary Expansion migration

---

## Acceptance Criteria

- [ ] New "I Feel" folder appears on all grid sizes
- [ ] 18 sensory/regulation words added with correct Fitzgerald colors
- [ ] Body states are blue, coping requests are green
- [ ] All words have Spanish translations
- [ ] All words have ARASAAC symbol mappings
- [ ] Prediction chains connect sensory states to coping strategies
- [ ] Existing users get new vocabulary via migration
- [ ] Motor planning preserved -- no existing word positions changed
- [ ] Works offline after initial load
- [ ] Folder visible on 3x3 starter grid (critical for target population)

---

## Dependencies

- None -- independent of other planned features
- Builds on Deep Vocabulary Expansion architecture (same patterns)

---

## Risks

- **3x3 grid space**: Adding a 10th folder to 3x3 may require grid layout adjustment. Mitigation: verify CSS grid wraps properly or adjust to show 10 items (e.g., 3x3 + 1 row).
- **Folder naming**: "I Feel" vs "Feelings" could confuse parents. Mitigation: clear folder icons and distinct naming. "Feelings" = emotions (happy/sad). "I Feel" = body (hungry/cold/too loud).
