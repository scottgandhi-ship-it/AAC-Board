# Quick Phrases

**Status**: PLANNING
**Phase**: Phase 2 (Enhance)
**Priority**: P0
**Clinical advisor**: Marci (Early Intervention Specialist)

---

## Executive Summary

Add a Quick Phrases system to the AAC Board that lets children communicate full sentences in a single tap. When a child needs to say "I need to go potty" or "my tummy hurts," multi-tap communication is too slow. Quick Phrases are pre-built sentences that speak immediately on tap, providing urgent communication for time-sensitive needs.

---

## Clinical Rationale (Marci)

Two-tap prediction is great for building language, but some communication is URGENT. A child in sensory overload, pain, or needing the bathroom cannot navigate folders and build sentences tap by tap. Every second of delay increases frustration and the likelihood of a behavioral response.

Quick Phrases also serve as MODELING targets. Parents can tap a full phrase to demonstrate how the device works, lowering the barrier to aided language stimulation. SLPs frequently program "quick hits" on dedicated AAC devices for exactly this reason.

---

## Current State

- No quick phrase or sentence-level output exists
- All communication requires: navigate to folder -> find word -> tap (optionally build multi-word message)
- Core strip provides fast access to 5 words but no full sentences
- Prediction helps build 2-word combos but still requires multiple taps

---

## Architecture Decision: How Do Quick Phrases Work?

**Option A**: New folder called "Quick Phrases" containing sentence buttons
- Pro: Fits existing architecture (folder with buttons inside)
- Con: Requires navigating INTO the folder first (adds a tap); not truly "quick"

**Option B**: Dedicated Quick Phrases bar/section on home screen
- Pro: Always visible, one tap to speak
- Con: Takes screen real estate; complex UI changes

**Option C**: New folder BUT with special behavior -- tapping a phrase immediately speaks it (no message bar building required)
- Pro: Fits existing architecture; one tap after opening folder; phrases speak on tap without needing to hit "speak" button
- Con: Different behavior from regular word buttons (which add to message bar)

**Option D**: Quick Phrases as a folder with auto-speak behavior
- Tap a phrase -> it speaks immediately AND adds to message bar (so it appears visually)
- Works within existing grid/folder system
- Distinct visual treatment (phrase buttons look different from single-word buttons)
- Parent can add custom phrases in edit mode

**Marci's recommendation**: Option D. Keep it in the folder system so motor planning is preserved and parents can find it. But make phrases auto-speak on tap -- don't make the child tap "speak" after. The message bar shows the phrase so the child gets visual feedback. Phrase buttons should look visually distinct (maybe a small speech bubble icon or different border) so the child learns "these buttons talk right away."

**Decision**: Option D -- Folder with auto-speak behavior

---

## Proposed Quick Phrases (12-15 phrases)

Organized by urgency and frequency of use in clinical settings:

### Urgent/Safety (red)
| Position | ID | Label | Spanish |
|----------|------|---------|---------|
| 0 | qp-potty | I need to go potty | necesito ir al bano |
| 1 | qp-hurts | my tummy hurts | me duele la panza |
| 2 | qp-dont-like | I don't like that | no me gusta eso |
| 3 | qp-stop-it | stop it | para |
| 4 | qp-scared | I'm scared | tengo miedo |

### Requests (green)
| Position | ID | Label | Spanish |
|----------|------|---------|---------|
| 5 | qp-more-please | can I have more | puedo tener mas |
| 6 | qp-help-me | help me please | ayudame por favor |
| 7 | qp-want-that | I want that | quiero eso |
| 8 | qp-all-done | I'm all done | ya termine |
| 9 | qp-go-home | I want to go home | quiero ir a casa |

### Social (pink)
| Position | ID | Label | Spanish |
|----------|------|---------|---------|
| 10 | qp-thank-you | thank you | gracias |
| 11 | qp-love-you | I love you | te quiero |
| 12 | qp-play-with-me | play with me | juega conmigo |

### Regulation (blue)
| Position | ID | Label | Spanish |
|----------|------|---------|---------|
| 13 | qp-need-break | I need a break | necesito un descanso |
| 14 | qp-too-loud | it's too loud | esta muy fuerte |

**Total**: 15 quick phrases

---

## Folder Configuration

- **Folder ID**: quick
- **Label**: Quick Phrases
- **Color**: pink (social/communication -- these are full communicative acts)
- **Position**: 23 (next available after I Feel at 22)
- **Grid visibility**:
  - 3x3: YES -- add to THREE_BY_THREE_FOLDERS (urgent phrases must be accessible on starter grid)
  - 4x4: YES
  - 5x5+: YES
- **Folder icon**: Speech bubble or lightning bolt (speed/urgency)

---

## Special Behavior: Auto-Speak on Tap

When a button inside the "quick" folder is tapped:
1. The phrase text is spoken immediately via speak()
2. The phrase text is displayed in the message bar (visual feedback)
3. No need to tap the "speak" button -- it fires automatically
4. Usage tracking logs the phrase as a single interaction

**Implementation approach**:
- In the button tap handler, check if the tapped button's folderId is "quick"
- If yes: call speak(button.label) immediately after adding to message bar
- This is a small conditional in the existing tap handler -- not a new system

**Visual distinction for phrase buttons**:
- Slightly different border style (dashed or double) or a small speech bubble icon overlay
- This signals to the child "these buttons talk right away"
- CSS-only change, no structural modification

---

## Custom Phrases (Parent Feature)

Parents can add custom quick phrases in edit mode:
- Same "Add Button" flow as any folder
- Parent types full phrase as the label (e.g., "I want chicken nuggets")
- Button gets added to quick folder with auto-speak behavior
- This enables personalization -- Marci's top recommendation for AAC effectiveness

No special UI needed beyond existing edit mode. The auto-speak behavior is folder-level, not button-level.

---

## Implementation Plan

### Subphase 1: Folder Infrastructure
- Add folder-quick to DEFAULT_BUTTONS (type: folder, position: 23)
- Add "quick" to THREE_BY_THREE_FOLDERS and FOUR_BY_FOUR_FOLDERS
- Add CSS styling for quick phrase folder
- Add FOLDER_ICONS entry (speech bubble)

### Subphase 2: Phrase Buttons
- Add 15 phrase button entries to DEFAULT_BUTTONS with folderId: 'quick'
- Colors: red (urgent), green (requests), pink (social), blue (regulation)
- Positions 0-14

### Subphase 3: Auto-Speak Behavior
- Modify button tap handler to detect folderId === 'quick'
- When quick phrase tapped: speak immediately + add to message bar
- Test with all grid sizes and speech settings

### Subphase 4: Visual Distinction
- CSS styling for buttons inside quick folder
- Subtle visual indicator that these are "instant speak" buttons
- Must pass accessibility contrast requirements

### Subphase 5: ARASAAC Symbols + Icons
- Add BUTTON_ICONS for all 15 phrases
- Phrase icons should represent the MEANING of the phrase, not individual words
- e.g., "I need to go potty" -> toilet icon, not "I" + "need" + "potty" icons

### Subphase 6: Spanish Translations
- Add Spanish labels to LANG_ES.labels
- Speech output uses the Spanish label when language is set to Spanish

### Subphase 7: Existing User Migration
- Add migration logic in init() to auto-add quick phrases folder and buttons
- Same pattern as Deep Vocabulary Expansion migration

---

## Acceptance Criteria

- [ ] New "Quick Phrases" folder appears on all grid sizes
- [ ] 15 pre-built phrases added with correct colors by category
- [ ] Tapping a phrase speaks it immediately (no "speak" button needed)
- [ ] Phrase appears in message bar after tap (visual feedback)
- [ ] All phrases have Spanish translations and speak in Spanish when language is ES
- [ ] All phrases have appropriate icons (ARASAAC or emoji fallback)
- [ ] Phrase buttons are visually distinct from regular word buttons
- [ ] Parents can add custom phrases via edit mode
- [ ] Usage tracking logs phrase taps
- [ ] Existing users get new folder and phrases via migration
- [ ] Motor planning preserved -- no existing positions changed
- [ ] Works offline
- [ ] Folder visible on 3x3 starter grid

---

## Dependencies

- None -- independent of Sensory/Regulation Words (though they complement each other)
- Can be implemented in parallel or sequence

---

## Risks

- **3x3 grid space**: If Sensory/Regulation also adds to 3x3, we now have 11 folders on a 9-cell grid. Need to verify grid wrapping or prioritize which folders show on 3x3.
- **Auto-speak confusion**: Children might not understand why some buttons talk immediately and others don't. Mitigation: visual distinction + parent coaching tip.
- **Long phrases and TTS**: Some phrases are 5+ words. TTS handles this fine, but verify pronunciation in both English and Spanish.
- **Phrase overlap**: "I need a break" exists in Feelings and may appear in Quick Phrases. This is intentional -- different access paths for the same urgent need. Motor planning is preserved because positions are different contexts (folder vs quick phrase).
