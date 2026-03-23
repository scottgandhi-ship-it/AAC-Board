# Visual Task Strips — Guiding Steps

## Summary

Extend the Rewards system to support **visual task strips** — multi-step sequences where each step has its own label and image, ending with a reward. This is a clinical standard (task analysis with contingency-based reinforcement) used daily by DTs, OTs, and BCBAs for teaching self-care skills to children with ASD ages 3-6.

**Requested by**: Developmental Therapist (clinical field request)
**Validated by**: Marci (Early Intervention Specialist) — strong clinical endorsement
**Reviewed by**: Steve (Quality Gate) — approved with revisions (all addressed below)

---

## Problem

The current Rewards system is a **simple counter**. Every step in a track is identical (same image, same label, just numbered 1-10). This works for abstract goals like "practice waiting 5 times" but fails for multi-step routines where each step is a distinct action.

Parents and therapists need to create task strips like:

> Pull pants down → Sit on potty → Pee → Wipe → Pull pants up → Flush → **REWARD**

Each step is a different action with a different image. The current system cannot represent this.

---

## Solution

Add a `steps` array to the existing reward track data model. When `steps` exists, each tile in the stepping stone path renders its own label and image instead of a generic number. When `steps` is absent, the track works exactly as it does today. Fully backward compatible.

---

## Data Model Change

### Current Track Object
```javascript
{
  id, taskLabel, targetCount, currentCount, rewardLabel,
  rewardImageKey, timerEnabled, timerDuration, timerStartedAt,
  status, position, createdAt,
  taskImageType, taskDefaultImageKey, taskImageKey
}
```

### Extended Track Object (additions only)
```javascript
{
  // ... all existing fields preserved ...
  steps: [                          // NEW — null/undefined = legacy counter mode
    {
      id: "step-1711270400000-0",   // Stable ID (timestamp + index at creation)
      label: "Pull pants down",     // Step display text
      imageType: "default",         // "default" | "uploaded" | "none"
      imageKey: "potty-pants-down", // Built-in library key or IndexedDB key (keyed by step.id)
    },
    // ... one entry per step
  ]
}
```

**Stable step IDs**: Each step gets a unique ID at creation time (`step-${Date.now()}-${index}`). Image keys in IndexedDB are keyed by step ID, not array index. This ensures reordering steps does not orphan or swap images.

### Target count derivation

When `steps` is present, `targetCount` must always equal `steps.length`. To prevent sync drift, all code reads step count through a helper:

```javascript
function getTargetCount(track) {
  return track.steps ? track.steps.length : track.targetCount;
}
```

`targetCount` is still written on save (for IndexedDB queries and backward compat) but never trusted as authoritative when `steps` exists.

### Backward compatibility

- Tracks without `steps` (null/undefined) work exactly as before
- Every function that reads `targetCount` switches to `getTargetCount(track)`
- Every function that renders tiles checks `track.steps` before accessing step data
- No DB migration needed — existing tracks are untouched, new field is additive

---

## Image Compression (all uploads)

**Applies globally, not just task strips.** Currently the codebase stores raw camera photos in IndexedDB with no compression. Task strips multiply this (up to 8 images per strip × 5 tracks = 40 images).

**Implementation**: Add a `compressImage(blob)` utility that:
1. Creates an offscreen canvas
2. Draws the image scaled to max 800px on the longest edge
3. Exports as JPEG at 0.8 quality
4. Returns the compressed blob

Call `compressImage()` before every `saveImage()` call — reward images, task images, step images, and story images. This is a global improvement, not task-strip-specific.

---

## UI Changes

### 1. Track Creation Flow

**Entry point**: Existing "New Track" button in Rewards tab.

**New choice screen** (after template picker if templates exist):
- **"Task Strip"** — multi-step routine with per-step images (NEW)
- **"Simple Counter"** — current behavior (count repetitions of one task)

**Task Strip creation/edit form**:
- **Strip title** (e.g., "Potty Training") — maps to `taskLabel`
- **Reward label** (e.g., "Sticker!") — maps to `rewardLabel`
- **Reward image** — upload or pick from library, maps to `rewardImageKey`
- **Steps editor**:
  - List of steps, each with label input + image picker (upload photo or pick built-in)
  - "Add Step" button (disabled at 8 steps)
  - Up/down arrow buttons to reorder (no drag-to-reorder — unreliable on iOS touch)
  - Delete (X) button per step
  - Minimum 2 steps enforced (Add Step auto-creates 2 blank steps on new strip)
  - Maximum 8 steps enforced (Add Step disabled, shows "8 step maximum")
- **Timer toggle** — existing functionality, unchanged
- **Edit mode**: Same form, pre-populated with existing step data. If track has progress (`currentCount > 0`), require reset before allowing step removal or reorder. Adding steps at the end is always allowed.

### 2. Stepping Stone Path (renderPath)

**When track has `steps` array**:
- Each tile shows the step's image (large, centered) with label below
- Tile states unchanged: completed (green check overlay, 0.7 opacity), active (accent border, gentle pulse), locked (0.45 opacity)
- Reward icon anchored at end of path, always visible, "locked" appearance until all steps done
- Wrapping grid layout (same grid logic as current tiles, responsive columns based on step count)

**When track has no `steps` array**:
- Existing numbered tile behavior, unchanged

### 3. Step Completion

- Tap active tile to complete (existing `handleTileTap` behavior)
- Steps must be completed in order — locked tiles are not tappable (already enforced)
- Haptic feedback on completion (already exists)
- Speak step label on completion: "Pull pants down — done!"
- Progress persists on app close (already exists via IndexedDB save after each tap)

### 4. Parent Undo

- **Long press (800ms)** on a completed step to uncomplete it
- Visual feedback: tile pulses after 400ms to indicate hold is registering, completes undo at 800ms
- Only available outside kids mode
- Reverts tapped step to active, all subsequent steps re-lock
- Updates `currentCount` and saves to DB
- No confirmation needed (low-risk, easily reversible by re-tapping)
- Accidental trigger prevention: 800ms hold duration + visual feedback at 400ms gives parent time to release if unintended

### 5. Celebration

- Existing celebration flow triggers when all steps complete (unchanged)
- Reward image, confetti, sound (respects sensory-quiet mode) — all existing

### 6. Reset

- Existing reset button resets `currentCount` to 0 (unchanged, works for both modes)
- Task strip is reusable daily without re-creation

---

## Pre-Loaded Templates

Ship with 5 built-in task strip templates using built-in SVG icons:

### 1. Potty Training (6 steps)
1. Pull pants down
2. Sit on potty
3. Go pee/poop
4. Wipe
5. Pull pants up
6. Flush

### 2. Handwashing (6 steps)
1. Turn on water
2. Wet hands
3. Get soap
4. Rub hands together
5. Rinse hands
6. Dry hands

### 3. Brushing Teeth (5 steps)
1. Get toothbrush
2. Put on toothpaste
3. Brush teeth
4. Spit and rinse
5. Put toothbrush away

### 4. Getting Dressed (5 steps)
1. Underwear
2. Pants
3. Shirt
4. Socks
5. Shoes

### 5. Bedtime Routine (5 steps)
1. Put on pajamas
2. Brush teeth
3. Go potty
4. Read a book
5. Lights off

Templates include default reward labels ("Great job!", "You did it!") and can be customized after creation.

---

## Built-In Step Image Library

Small, focused set of simple SVG icons for the 5 pre-loaded templates (~25-30 icons). Parents can swap any icon for a real photo of their child's environment via photo upload.

Full illustrated library with categories (Bathroom, Getting Ready, Mealtime, etc.) deferred to v2. For v1, the emphasis is on **photo upload** as the primary image source, with built-in icons as sensible defaults for templates.

---

## Functions Requiring Modification

### Must branch on `track.steps` existence:

| Function | Line | Change |
|----------|------|--------|
| `renderPath(track)` | 5032 | Render per-step image+label tiles when `steps` exists |
| `handleTileTap(track)` | 5005 | Speak step label instead of "X out of Y" when `steps` exists |
| `getGridCols(count)` | 4996 | No change needed (already count-based) |
| `renderRewards()` | 4923 | No change needed (delegates to renderPath) |
| `renderTaskImage(track)` | 4889 | Skip task image rendering for task strips (images are per-step) |
| `triggerCelebration(track)` | 5275 | No change needed (already uses rewardLabel/rewardImageKey) |
| `openRewardConfig(trackId)` | 5351 | Show step editor UI for task strip tracks |
| `btn-reward-save handler` | 5433 | Save `steps` array, sync `targetCount`, handle per-step images |
| `btn-reward-save-template` | 5545 | Include `steps` in saved template |
| `openRewardConfigFromTemplate` | 5615 | Load `steps` from template |
| `resetTrack handler` | 5790 | No change needed (already resets `currentCount` to 0) |

### New helper functions:
| Function | Purpose |
|----------|---------|
| `getTargetCount(track)` | Returns `steps.length` or `targetCount` — single source of truth |
| `compressImage(blob)` | Resize to 800px max edge, JPEG 0.8 quality — used by all image uploads |
| `isTaskStrip(track)` | Returns `!!track.steps` — readable convenience check |
| `generateStepId()` | Returns `step-${Date.now()}-${Math.random().toString(36).slice(2,6)}` |

---

## Implementation Plan

### Phase 1: Data model + creation + edit flow
- Add `getTargetCount()`, `isTaskStrip()`, `generateStepId()` helpers
- Add `compressImage()` utility and wire into all existing image upload paths
- Extend track object with `steps` array
- Add "Task Strip vs Simple Counter" choice to creation flow
- Build step editor UI (add/remove/reorder with up/down arrows, image picker per step)
- Edit mode: same form pre-populated, require reset before removing/reordering steps with progress
- Validation: 2-8 steps, each step needs at least a label
- Save/load with backward compatibility (tracks without `steps` work as before)

### Phase 2: Rendering + interaction
- Update `renderPath()` to check for `steps` array
- Render per-step image + label tiles when present
- Reward icon visible at end of strip
- Step completion speaks step label
- Long-press undo on completed steps (parent mode only, 800ms hold, 400ms visual feedback)
- Update all `targetCount` reads to use `getTargetCount()`

### Phase 3: Templates + polish
- Build 5 pre-loaded task strip templates with built-in SVG icons (~25-30 icons)
- Add template detection on first load (similar to `gs-sample-loaded` pattern)
- Template picker shows task strip templates alongside existing counter templates
- Save existing task strip as template (existing pattern, extended with `steps`)

---

## Constraints

- **Max 8 steps per strip** (hard cap, enforced in UI)
- **Min 2 steps per strip** (1 step = just use First-Then / simple counter)
- **Sequential completion only** — no skipping steps
- **Max 5 tracks per parent** (existing limit, unchanged)
- **No prompting hierarchy in v1** — deferred to therapist mode (v2)
- **No timers on individual steps** — time pressure increases anxiety (Marci)
- **No audio narration per step in v1** — deferred
- **No drag-to-reorder in v1** — up/down arrows only (iOS touch reliability)
- **Edit with progress**: adding steps at end allowed; removing/reordering requires reset first

---

## Files Modified

- `guiding-steps/index.html` — data model, creation UI, render logic, templates, image compression
- No new files (single-file architecture)

---

## Out of Scope (v2+)

- Prompting hierarchy / therapist data mode
- Audio narration per step (TTS reads instruction aloud)
- Video models per step
- Progress graphing over time
- Print-friendly export
- Share task strips between caregivers
- Integration with Yappie AAC
- Drag-to-reorder steps
- Full illustrated step image library (beyond template defaults)
