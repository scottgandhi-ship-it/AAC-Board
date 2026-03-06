# Reward Tracker

## Status: PLANNING
## Priority: Phase 2 -- after Navigation & Parent Mode
## Dependencies: NavigationAndParentMode must be complete

---

## Executive Summary

A visual progress-based reward system where parents configure a task (e.g., "Pee in the potty"), a target count (e.g., 5), and a reward (e.g., "iPad time"). The child's view shows a stepping-stone path leading to the reward. Each time the task is completed, a stone fills in. When all stones are filled, a celebration plays and the reward is earned. Parents can swap the reward at any time without resetting progress.

---

## Requirements

1. Parents can create reward tracks with a task label, target count (2-10), reward label, and optional reward image
2. Visual presentation as a path of stepping stones leading to the reward
3. One large "I did it!" button for marking progress
4. Celebration animation when the reward is earned
5. Optional countdown timer for timed rewards
6. Support up to 5 active reward tracks, displayed one at a time with tabs to switch
7. Parent can swap the reward (label + image) at any time without resetting progress
8. Manual reset after reward is claimed (not automatic daily reset)
9. All progress persists in IndexedDB -- never lose a child's earned steps
10. Audio feedback on progress (speech synthesis + simple tone)

---

## Architecture Overview

### Data Model

New IndexedDB object store: **rewardTracks** (keyPath: "id")

    Track schema:
    {
      id: string (e.g., "track-1709234567890"),
      taskLabel: string (e.g., "Pee in the potty"),
      targetCount: number (2-10),
      currentCount: number (0 to targetCount),
      rewardLabel: string (e.g., "iPad time"),
      rewardImageKey: string or null (key in images store, prefixed "reward-{trackId}"),
      timerEnabled: boolean,
      timerDuration: number (minutes, 0 if disabled),
      timerStartedAt: number or null (timestamp when reward timer started),
      status: string ("active" | "reward-earned" | "timer-running" | "timer-complete"),
      position: number (display order among tracks),
      createdAt: number (timestamp)
    }

Images stored in existing **images** store with key prefix "reward-{trackId}".

### IndexedDB Version Bump

Bump DB_VERSION from 1 to 2. In onupgradeneeded:
- If upgrading from v1: create rewardTracks store
- Existing buttons and images stores unchanged

### UI Structure (inside #view-rewards)

**Child mode layout:**

    [Track selector tabs] (small row at top, only if 2+ tracks exist)
    [Stepping stone path] (main visual area, flex:1)
    [I did it! button] (large, bottom of view)

**Parent mode additions:**
- "Configure" button in header area
- "Reset Track" button (appears after reward earned)
- "New Track" button (if fewer than 5 tracks)

### Stepping Stone Path Visual

- A curved or S-shaped path of N circular stones (where N = targetCount)
- Each stone: ~50-60px diameter circle
- Empty stone: outlined circle, muted color
- Filled stone: solid fill with bright color, subtle glow/shadow
- The path winds across the screen to fit all stones without scrolling
- Layout algorithm:
  - 2-4 stones: single horizontal row, centered
  - 5-7 stones: gentle S-curve (row of 3-4, then row of remaining, connected by path line)
  - 8-10 stones: S-curve with 3 rows
- Reward icon sits at the end of the path, larger than stones (~80px), with a subtle pulsing glow animation (CSS keyframes, slow pulse, not flashy)
- A drawn path line (SVG or CSS border) connects the stones visually

### "I Did It!" Button

- Full width, 80px tall minimum
- Bright green background (#43A047 to match speak button)
- Large text: "I did it!" in bold
- Positioned at the bottom of the rewards view (above tab bar)
- On tap:
  1. Brief cooldown (button greys out for 1.5 seconds to prevent double-tap)
  2. Increment currentCount
  3. Save to IndexedDB immediately
  4. Animate the next stone filling in (scale-up + color fill, 0.3s)
  5. Play a short "ding" tone (Web Audio API -- see Audio section)
  6. Speak progress: "3 out of 5!" using speech synthesis
  7. If currentCount === targetCount, trigger celebration

### Celebration Sequence

When reward is earned:
1. All stones pulse once together
2. Reward image/label scales up to center of screen
3. Confetti particles burst from behind reward (CSS animation -- 20-30 small colored divs with randomized position, rotation, and fall animation over 2-3 seconds)
4. Play a "ta-da!" tone (ascending 3-note chime via Web Audio API)
5. Speak: "You earned [rewardLabel]!"
6. After 3 seconds, transition to "reward active" state
7. Track status changes to "reward-earned"

### Reward Active State

- Reward image displayed prominently in center
- Large text: "[rewardLabel]!"
- If timer enabled:
  - Start countdown display: "28:45 remaining" in large font
  - Timer calculated from stored timerStartedAt timestamp (survives app close/reopen)
  - When timer expires: gentle chime, display "Time's up!", status -> "timer-complete"
- If no timer: just displays the reward until parent resets

### Timer Implementation

- On reward earned (if timerEnabled): store Date.now() as timerStartedAt, status -> "timer-running"
- Display: calculate remaining = timerDuration * 60000 - (Date.now() - timerStartedAt)
- Update display every second via setInterval
- If remaining <= 0: show "Time's up!", clear interval, status -> "timer-complete"
- On app reopen: recalculate from stored timestamp (handles app close during timer)
- No pause button (intentional -- avoids negotiation)

### Track Selector (Multiple Tracks)

- Small horizontal row of mini-tabs at top of rewards view
- Each tab shows: track task label (truncated) + mini progress indicator (e.g., "3/5")
- Active track tab is highlighted
- Only shown when 2+ tracks exist (single track hides the row)
- Tapping a tab switches which track is displayed full-screen below

### Parent Mode: Configure Track

Opens a modal (consistent with existing edit-overlay pattern):

    Track Configuration Modal:
    - Task label (text input, no placeholder)
    - Steps needed (number stepper: - / value / +, range 2-10)
    - Reward label (text input, no placeholder)
    - Reward image (upload button + preview, same pattern as AAC button images)
    - Timer toggle (on/off)
    - Timer duration (dropdown: 5, 10, 15, 20, 30, 45, 60 minutes -- only visible if timer on)
    - [Save] [Cancel] [Delete Track] buttons

### Parent Mode: Reset Track

- Button appears when track status is "reward-earned", "timer-running", or "timer-complete"
- On tap: confirm dialog "Reset this track? Progress will start over."
- Resets: currentCount -> 0, status -> "active", timerStartedAt -> null
- Reward configuration stays the same

### Parent Mode: Swap Reward

- Parent opens Configure for the track
- Changes reward label, image, or timer settings
- Saves without touching currentCount
- Progress preserved, only the reward changes

---

## Audio Design

### "Ding" Tone (Progress)
- Web Audio API: OscillatorNode, sine wave
- Single note: 880Hz (A5), 150ms duration
- Gain envelope: quick attack (10ms), sustain, quick decay (50ms)
- Play on every "I did it!" tap

### "Ta-da!" Tone (Reward Earned)
- Web Audio API: 3 sequential notes
- Notes: C5 (523Hz, 150ms) -> E5 (659Hz, 150ms) -> G5 (784Hz, 300ms)
- Each note with gain envelope
- Total duration: ~600ms
- Play at start of celebration sequence

### Audio Initialization
- Create AudioContext on first user interaction (required by browsers)
- Reuse the same context for all tones
- No external audio files needed

---

## Task Breakdown

### Task 2.1: IndexedDB schema upgrade
- Bump DB_VERSION to 2
- Add rewardTracks object store in onupgradeneeded
- Handle upgrade from v1 (existing stores stay intact)
- Add CRUD helpers: loadTracks, saveTrack, deleteTrack

### Task 2.2: Default state and data model
- Define track schema in JS
- On first load of rewards view: if no tracks exist, show "No reward tracks yet" message with prompt to create one (parent mode only)
- Wire up track loading in init()

### Task 2.3: Stepping stone path renderer
- Function that takes targetCount and currentCount, renders the path
- SVG-based path line connecting stone positions
- CSS-styled circles for stones (filled vs empty)
- Responsive layout: path adapts to container width
- Reward icon at the end of the path

### Task 2.4: "I did it!" button and progress logic
- Render the button below the path
- Tap handler: increment, save, animate, audio, speak
- Cooldown state (1.5s) to prevent double-tap
- Disable button when track status is not "active"

### Task 2.5: Audio system
- AudioContext creation on first interaction
- playDing() function
- playTaDa() function
- Integrate with progress and celebration

### Task 2.6: Celebration animation
- CSS keyframes for confetti particles
- Reward scale-up animation
- Celebration sequence orchestration (timing of visual + audio + speech)
- Transition to reward-active state after celebration

### Task 2.7: Timer system
- Timer display component
- setInterval countdown with timestamp-based calculation
- Timer expiry handling
- Persistence across app close/reopen

### Task 2.8: Track selector tabs
- Render track tabs when 2+ tracks exist
- Switch active track on tab tap
- Mini progress indicator per tab

### Task 2.9: Parent mode -- track configuration modal
- Modal HTML structure (matches existing edit modal pattern)
- Form fields: task label, steps stepper, reward label, reward image, timer toggle/duration
- Save, Cancel, Delete handlers
- "New Track" button (when fewer than 5)

### Task 2.10: Parent mode -- reset and reward swap
- Reset button visibility logic
- Reset handler with confirmation
- Reward swap (edit track, save without resetting count)

### Task 2.11: Integration and testing
- Wire rewards view into tab navigation
- Verify parent mode controls visibility
- Test full flow: create track -> mark progress -> earn reward -> reset
- Test timer across app close/reopen
- Test with 1, 3, and 5 tracks
- Accessibility: screen reader announces progress, button labels, celebration

---

## Accessibility Considerations

- "I did it!" button: large touch target (80px+), clear aria-label
- Stepping stones: aria role="progressbar" with aria-valuenow and aria-valuemax
- Progress spoken aloud on each increment ("3 out of 5")
- Celebration audio respects device volume (no sudden loud sounds)
- Confetti animation uses prefers-reduced-motion media query to disable for users who need it
- Track tabs are keyboard accessible
- Timer display has aria-live="polite" for screen reader updates

---

## Acceptance Criteria

- [ ] Reward track can be created with task label, count, reward label, and optional image
- [ ] Stepping stone path renders correctly for counts 2-10
- [ ] "I did it!" taps increment progress with visual, audio, and speech feedback
- [ ] Double-tap prevention (cooldown) works
- [ ] Celebration plays when reward earned (visual + audio + speech)
- [ ] Timer counts down correctly and survives app close/reopen
- [ ] Timer expiry shows "Time's up!" with audio cue
- [ ] Multiple tracks switch correctly via tabs
- [ ] Reward can be swapped without losing progress
- [ ] Reset clears progress but keeps configuration
- [ ] All progress persists in IndexedDB across app restarts
- [ ] Parent mode controls hidden in child mode
- [ ] Touch targets meet 44px minimum
- [ ] Screen reader can navigate the full reward flow
- [ ] Confetti disabled when prefers-reduced-motion is set
