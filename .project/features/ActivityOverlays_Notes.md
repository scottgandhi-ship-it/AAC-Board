# Activity Overlays -- Implementation Notes

**Status**: PLANNING
**Phase**: Phase 2 (Enhance)
**Priority**: P1
**Plan document**: ActivityOverlays.md
**Created**: 2026-03-08

---

## Current Status

PLANNING -- Feature plan created, awaiting developer approval before implementation.

---

## Context

- Parent/SLP-controlled contextual vocabulary overlays
- 6 initial activity bundles: Mealtime, Bath Time, Playground, Bedtime, Getting Dressed, Circle Time
- Marci (clinical) and Noah (UX) reviewed and approved the approach
- Key decision: Activities are NOT a tab -- they are parent-activated overlays from Settings
- Second wave of 6 additional activities being designed by Marci

---

## Design Decisions Log

| Decision | Choice | Rationale |
|----------|--------|-----------|
| UI placement | Parent-controlled overlay, not a tab | Avoids UI clutter; keeps child on full board by default; clinical best practice |
| Word count per activity | 12-16 words | Enough for meaningful communication; not so many that cognitive load increases |
| Activity persistence | Does not persist across reloads | Activity should always be intentionally activated by adult |
| Close button protection | Parent-gated (3-tap lock) | Child should not be able to dismiss the activity overlay |
| Word behavior | Identical to regular words | Consistency for motor planning; no new interaction patterns to learn |

---

## Implementation Checklist

### Subphase 1: Data Model and Activity Definitions
- [ ] Define activity data structure
- [ ] Create 6 built-in activity bundles with word lists
- [ ] Add ARASAAC symbol IDs for all activity words
- [ ] Add Spanish translations for all activity words
- [ ] Add activity state management (activeActivity, isActivityMode)

### Subphase 2: Settings UI -- Activity List
- [ ] Add "Activities" section to Settings menu
- [ ] Display activity cards with icons and names
- [ ] Add word preview when tapping an activity card
- [ ] Add "Start Activity" button on preview

### Subphase 3: Activity Overlay -- Grid Display
- [ ] Replace main grid with activity words when active
- [ ] Display activity header banner with name
- [ ] Add parent-gated close (X) button
- [ ] Ensure core word strip remains visible
- [ ] Ensure message bar remains functional
- [ ] Activity words behave identically to regular words

### Subphase 4: Activity Overlay -- Visual Polish
- [ ] Subtle background tint change
- [ ] Smooth transition animation
- [ ] Activity header styling
- [ ] Responsive layout testing

### Subphase 5: Integration and Edge Cases
- [ ] Handle app reload during active activity
- [ ] Handle orientation change
- [ ] Verify speech output for all activity words
- [ ] Verify word prediction compatibility
- [ ] Test with existing features (Schedule, Rewards, Quick Phrases)

### Subphase 6: Testing and Validation
- [ ] Manual browser testing (mobile + desktop)
- [ ] Screen reader testing
- [ ] Lighthouse audit
- [ ] Test all 6 activity bundles end-to-end
- [ ] Validate Spanish translations
- [ ] Test parent gate on close button

---

## Changes Made

(None yet -- planning phase)

---

## Issues and Resolutions

(None yet)

---

## Validation Progress

(Not started)
