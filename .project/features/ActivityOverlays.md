# Activity Overlays (Parent-Controlled Contextual Vocabulary)

**Status**: PLANNING
**Phase**: Phase 2 (Enhance)
**Priority**: P1
**Clinical advisor**: Marci (Early Intervention Specialist)
**UX advisor**: Noah (UI/UX Designer)

---

## Executive Summary

Add parent/SLP-controlled Activity Overlays to the AAC Board. When a parent activates an activity (e.g., "Mealtime"), the main communication grid is replaced with a focused set of 12-16 contextually relevant words for that routine. The parent controls when it appears and disappears. The child simply sees relevant words appear on their board -- no mode switching, no extra tabs.

This feature implements activity-based vocabulary organization (a core design principle) without adding UI complexity to the child's experience.

---

## Clinical Rationale (Marci)

Activity-based vocabulary is how communication is actually taught in naturalistic settings. During a home visit or therapy session, a clinician pulls out a context-specific board -- not the full device. This mirrors aided language stimulation best practices: surround the child with words relevant to what is happening RIGHT NOW.

Key clinical principles this feature follows:

- **Contextual relevance**: Children learn words faster when they map to real-time experiences
- **Aided language stimulation**: Parents/SLPs can model target words during the actual activity
- **Reduced cognitive load**: 12-16 focused words instead of navigating 24 folders
- **Adult-controlled deployment**: The clinician/parent makes the decision about when context helps, preventing the child from using activity boards as a crutch instead of building full-device competence
- **Core words persist**: The core word strip (I, want, don't want, more, help) remains visible during activities, reinforcing high-frequency vocabulary

**Why parent-controlled, not child-accessible**: In therapy, activity boards are a stepping stone. The child should always be building competence on the full board. If Activity were a permanent tab the child could access, they might default to it and never learn to navigate the full vocabulary. By making it parent/SLP-controlled, we ensure it is deployed with clinical intent.

---

## Current State

- Tab bar has 3 views: Talk, Schedule, Rewards
- No activity-based vocabulary organization exists
- All 415 words are organized taxonomically (by category: Food, Actions, Feelings, etc.)
- Parents can customize the board in edit mode but cannot create contextual overlays
- The design principles in CLAUDE.md call for activity-based organization but it has not been implemented

---

## Architecture Decision: How Do Activities Work?

**Option A**: Activity as a permanent tab in the bottom bar
- Pro: Always discoverable
- Con: Adds UI clutter the child sees; child can self-navigate to it (clinical concern); takes space from communication area

**Option B**: Activity as a parent-controlled overlay from Settings
- Pro: Zero UI impact on child's default experience; parent controls timing; no extra tabs
- Con: Slightly more taps for parent to activate (More -> Activities -> Choose -> Start)

**Option C**: Activity integrated with Visual Schedule
- Pro: Natural pairing (schedule says "bath time" -> suggest bath time words); leverages existing feature
- Con: Couples two features too tightly; not all activity use is schedule-driven

**Decision**: Option B as primary, with Option C as a future enhancement.

Activities are accessed through the existing menu/settings system. The parent activates an activity, the board transitions to a focused overlay, and the parent dismisses it when done. A future enhancement could let the Visual Schedule suggest activating a relevant activity when a scheduled routine begins.

---

## UI Design (Noah)

### Default State -- No Change

The child's default experience is unchanged. Talk tab shows the full AAC grid. No new tabs, no new buttons visible to the child.

### Activating an Activity (Parent Flow)

1. Parent taps Settings gear (already parent-gated with 3-tap lock)
2. New "Activities" section in settings menu
3. Shows available activity bundles as cards with icons
4. Parent taps an activity -> preview of included words
5. Parent taps "Start Activity"
6. Settings closes, board transitions to activity overlay

### Activity Overlay (Active State)

- Activity name displayed in a header banner with subtle background color change
- Close button (X) in the header -- parent-gated (requires 3-tap or PIN)
- Grid shows 12-16 activity-specific words in the standard grid layout
- Core word strip remains visible and functional
- Message bar remains visible and functional
- Tab bar remains but Talk is the active tab (no new tabs added)
- Subtle visual differentiation: slightly different background tint so the child has a gentle contextual cue

### Ending an Activity

- Parent taps X on the activity banner (behind parent gate)
- OR parent goes to Settings -> Activities -> "End Activity"
- Board transitions back to full Talk grid
- No words are lost, no positions change on the main board

### Visual Treatment

- Activity words follow the same Modified Fitzgerald Key color coding as the rest of the board
- Activity word buttons look identical to regular word buttons (same size, shape, tap behavior)
- Words add to message bar on tap, same as any other word
- The only visual difference is the header banner and subtle background tint

---

## Initial Activity Bundles (6)

### 1. Mealtime

**Context**: Breakfast, lunch, dinner, snack time -- any eating/drinking routine.

**Word List** (16 words):

| Word | Color (Fitzgerald Key) | Category |
|------|----------------------|----------|
| eat | green | verb |
| drink | green | verb |
| want | green | verb |
| open | green | verb |
| all done | green | verb |
| more | blue | descriptor |
| yummy | blue | descriptor |
| yucky | blue | descriptor |
| hot | blue | descriptor |
| cold | blue | descriptor |
| spoon | orange | noun |
| cup | orange | noun |
| bowl | orange | noun |
| water | orange | noun |
| please | pink | social |
| thank you | pink | social |

**Common scenarios**:
- Requesting food or drink ("I want water")
- Expressing preferences ("yucky", "yummy")
- Indicating temperature ("hot")
- Asking for more or signaling done ("more", "all done")
- Using manners ("please", "thank you")

---

### 2. Bath Time

**Context**: Bath, shower, washing hands, water play.

**Word List** (14 words):

| Word | Color (Fitzgerald Key) | Category |
|------|----------------------|----------|
| wash | green | verb |
| pour | green | verb |
| splash | green | verb |
| dry | green | verb |
| all done | green | verb |
| wet | blue | descriptor |
| warm | blue | descriptor |
| cold | blue | descriptor |
| more | blue | descriptor |
| water | orange | noun |
| towel | orange | noun |
| soap | orange | noun |
| bubbles | orange | noun |
| duck | orange | noun |

**Common scenarios**:
- Requesting water play actions ("splash", "pour")
- Indicating temperature preference ("warm", "cold")
- Requesting bath toys ("duck", "bubbles")
- Signaling readiness to end ("all done", "dry")

---

### 3. Playground

**Context**: Outdoor play, park, recess, backyard play.

**Word List** (15 words):

| Word | Color (Fitzgerald Key) | Category |
|------|----------------------|----------|
| go | green | verb |
| push | green | verb |
| slide | green | verb |
| swing | green | verb |
| climb | green | verb |
| run | green | verb |
| stop | green | verb |
| more | blue | descriptor |
| fast | blue | descriptor |
| high | blue | descriptor |
| my turn | pink | social |
| your turn | pink | social |
| help | green | verb |
| up | purple | preposition |
| down | purple | preposition |

**Common scenarios**:
- Requesting swing/slide actions ("push", "more", "fast")
- Turn-taking with peers ("my turn", "your turn")
- Requesting help on equipment ("help", "up")
- Directing play ("go", "stop", "run")

---

### 4. Bedtime

**Context**: Nighttime routine, nap time, winding down.

**Word List** (14 words):

| Word | Color (Fitzgerald Key) | Category |
|------|----------------------|----------|
| read | green | verb |
| sleep | green | verb |
| hug | green | verb |
| sing | green | verb |
| want | green | verb |
| tired | blue | descriptor |
| dark | blue | descriptor |
| more | blue | descriptor |
| scared | blue | descriptor |
| blanket | orange | noun |
| book | orange | noun |
| light | orange | noun |
| water | orange | noun |
| goodnight | pink | social |

**Common scenarios**:
- Requesting bedtime activities ("read", "sing", "hug")
- Expressing needs ("water", "blanket", "light")
- Communicating feelings ("tired", "scared")
- Social closeness ("hug", "goodnight")

---

### 5. Getting Dressed

**Context**: Morning routine, changing clothes, getting ready.

**Word List** (15 words):

| Word | Color (Fitzgerald Key) | Category |
|------|----------------------|----------|
| put on | green | verb |
| take off | green | verb |
| help | green | verb |
| zip | green | verb |
| all done | green | verb |
| want | green | verb |
| tight | blue | descriptor |
| itchy | blue | descriptor |
| cold | blue | descriptor |
| shirt | orange | noun |
| pants | orange | noun |
| shoes | orange | noun |
| socks | orange | noun |
| coat | orange | noun |
| this one | yellow | pronoun |

**Common scenarios**:
- Requesting help with dressing ("help", "zip")
- Expressing sensory discomfort ("tight", "itchy") -- critical for autistic children
- Making choices ("want", "this one")
- Sequencing steps ("put on shoes", "take off coat")
- Signaling completion ("all done")

---

### 6. Circle Time

**Context**: Preschool group activity, story time, music time, structured learning.

**Word List** (14 words):

| Word | Color (Fitzgerald Key) | Category |
|------|----------------------|----------|
| sing | green | verb |
| read | green | verb |
| listen | green | verb |
| look | green | verb |
| want | green | verb |
| my turn | pink | social |
| hi | pink | social |
| bye | pink | social |
| more | blue | descriptor |
| loud | blue | descriptor |
| quiet | blue | descriptor |
| song | orange | noun |
| book | orange | noun |
| friend | orange | noun |

**Common scenarios**:
- Participating in group activities ("sing", "my turn")
- Requesting repetition ("more", "read")
- Greeting peers ("hi", "bye")
- Communicating sensory needs ("loud", "quiet") -- essential for managing overstimulation
- Requesting choices ("want", "song", "book")

---

## Data Model

Activities are stored in the app's data layer alongside existing vocabulary data.

Each activity bundle contains:
- **id**: Unique identifier (e.g., "mealtime", "bathtime")
- **name**: Display name (e.g., "Mealtime")
- **icon**: ARASAAC symbol ID or emoji fallback
- **color**: Accent color for the activity header
- **words**: Array of word objects, each with:
  - **label**: Display text
  - **colorCategory**: Fitzgerald Key category (verb, noun, descriptor, pronoun, social, preposition)
  - **arasaacId**: Symbol ID for image (reuse existing symbol library)
  - **spanishLabel**: Spanish translation (bilingual support)
- **isCustom**: Boolean -- false for built-in bundles, true for parent-created ones
- **isActive**: Boolean -- whether this activity overlay is currently displayed

Storage approach:
- Built-in activities are defined in the JS source (not editable, always available)
- Parent customizations (added/removed words, custom activities) stored in localStorage
- Active activity state stored in app state (not persisted -- activity always defaults to OFF on app reload)

---

## Implementation Plan

### Subphase 1: Data Model and Activity Definitions

- Define the activity data structure in the app's JS
- Create the 6 built-in activity bundles with word lists, colors, and ARASAAC symbol IDs
- Add Spanish translations for all activity words
- Add activity state management (activeActivity, isActivityMode)

### Subphase 2: Settings UI -- Activity List

- Add "Activities" section to the Settings/parent menu
- Display activity bundles as tappable cards with icon and name
- Tapping a card shows word preview
- "Start Activity" button on the preview screen

### Subphase 3: Activity Overlay -- Grid Display

- When activity is started, replace the main grid with activity words
- Display activity header banner with name and close (X) button
- Core word strip remains visible
- Message bar remains functional
- Activity words behave identically to regular words (tap to add to message bar)
- Close button is parent-gated (3-tap lock)

### Subphase 4: Activity Overlay -- Visual Polish

- Subtle background tint change when activity is active
- Smooth transition animation (slide or fade) when activating/deactivating
- Activity header styling (rounded, colored banner)
- Responsive layout for activity grid (works on phone and tablet)

### Subphase 5: Integration and Edge Cases

- Handle app reload during active activity (activity should deactivate -- fresh start)
- Handle orientation change during activity
- Ensure speech output works for all activity words
- Ensure word prediction works with activity words
- Test with existing features (Schedule, Rewards, Quick Phrases) to prevent conflicts

### Subphase 6: Testing and Validation

- Manual browser testing (mobile and desktop)
- Screen reader testing for activity overlay
- Lighthouse audit (accessibility, performance)
- Test all 6 activity bundles end-to-end
- Validate Spanish translations speak correctly
- Test parent gate on close button

---

## Acceptance Criteria

1. Parent can access Activities from the settings menu
2. Parent can preview words in each activity bundle before starting
3. Parent can activate an activity, replacing the main grid with activity-specific words
4. Activity header shows the activity name and a parent-gated close button
5. Core word strip remains visible and functional during an activity
6. Message bar remains visible and functional during an activity
7. Activity words follow Modified Fitzgerald Key color coding
8. Activity words behave identically to regular words (tap to add, speech output)
9. Parent can end an activity, returning to the full Talk grid
10. Activity state does not persist across app reloads (always starts fresh)
11. All 6 built-in activities display correctly with proper words
12. Spanish translations are available for all activity words
13. Activity overlay is accessible (keyboard navigable, screen reader compatible)
14. Close button requires parent gate to dismiss (child cannot close it)
15. No impact on the child's default Talk experience when no activity is active

---

## Future Enhancements (Post-Launch)

- **Schedule integration**: When a scheduled routine begins, prompt parent to activate the matching activity
- **Custom activities**: Parent can create their own activity bundles with custom word selections
- **SLP sharing**: Export/import activity bundles via the existing .aacboard sharing format
- **Usage tracking**: Track which activities are used most, which words are tapped during activities
- **Additional bundles**: Marci is designing 6 more activities for the second wave
- **Activity suggestions**: Based on time of day, suggest relevant activities (morning -> Getting Dressed, evening -> Bedtime)

---

## Dependencies and Risks

**Dependencies**:
- ARASAAC symbol library (already integrated) for activity word images
- Parent gate system (already implemented) for close button protection
- Speech synthesis (already implemented) for activity word output
- Spanish language support (already implemented) for bilingual labels

**Risks**:
- Grid layout must accommodate varying word counts (12-16) without looking sparse or cramped
- Activity overlay must not interfere with existing tab navigation
- Must be clear to the child that they can still use core words during an activity
- Symbol availability: some activity-specific words may not have ideal ARASAAC symbols

---

## Technical Notes

- This is a single-file PWA. All implementation goes in index.html
- No build tools, no frameworks. Vanilla JS (ES6+)
- Follow existing code patterns for grid rendering, speech output, and parent gate
- Network-first service worker caching -- bump cache version on deploy
