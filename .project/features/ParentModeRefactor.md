# Parent Mode Refactor: Visible Settings

## Executive Summary

Remove the hidden long-press Parent Mode gate. Make the settings button always visible. Move the Parent Mode toggle into the settings panel. Parents can always find settings without learning a hidden gesture.

**Why**: The hidden 3-tap lock interaction creates a discoverability problem that is worse than the problem it solves. Parents who can't find settings can't customize the board. Commercial AAC devices (TouchChat, Proloquo2Go, LAMP) all use visible settings access.

**Risk of kids tapping settings**: Low-impact and recoverable. Nothing in settings is destructive. Guard rails (PIN, hold-to-confirm) can be added later based on real usage data.

## Scope

This is a quick refactor -- approximately 80 lines deleted, 20 lines added. The existing code already separates gate (how you enter parent mode), state (the parentMode boolean and setParentMode function), and UI consequences (.parent-mode CSS class). Only the gate changes.

## Changes

### Remove

- Long-press IIFE (~lines 5368-5400): touchstart/mousedown/mouseup/mouseleave handlers, lockHoldTimer, PARENT_HOLD_MS
- #btn-lock HTML element (~lines 2901-2905)
- #btn-lock CSS rules (~lines 932-973)
- lockHoldTimer variable declaration and PARENT_HOLD_MS constant
- Lock icon references inside setParentMode() (icon toggling, title changes)
- The "if (!parentMode) return" guard on the settings button click handler

### Modify

- #btn-parent-settings CSS: change display:none to display:flex (always visible)
- setParentMode(): remove lock icon toggling, keep parent-active header style, .parent-mode body class, toast, and auto-lock timer
- Simplify or remove updateParentModeUI() since its main job was toggling settings button visibility

### Add

- Parent Mode toggle inside #settings-panel as the first section
  - Simple toggle switch or button that calls setParentMode(true/false)
  - Label: "Parent Mode" with brief description: "Unlocks editing and customization"
- Gear icon color change when parent mode is active (e.g., stroke goes from #555 to #FF8F00) as a persistent visual signal

### Keep (unchanged)

- parentMode boolean and setParentMode() state management
- .parent-mode CSS class on document.body and all downstream consumers
- Auto-lock timer (PARENT_AUTO_LOCK_MS) -- safety net so board returns to child mode
- parent-active header style (orange border)
- All existing parent-mode-gated UI (edit buttons, insights, etc.)

## Behavior

- Settings button (gear icon) is always visible in #app-header, left side
- Tapping gear opens the settings panel regardless of parent mode state
- Parent Mode toggle is the first item in settings
- When parent mode is toggled ON: settings panel stays open (parent likely wants to change other settings)
- When parent mode is toggled OFF: settings panel closes automatically
- Gear icon changes color when parent mode is active
- Auto-lock timer still fires, reverting to child mode after inactivity

## Cleanup Verification

After refactor, grep for these to confirm nothing is orphaned:
- btn-lock
- lock-icon
- lockHoldTimer
- PARENT_HOLD_MS
- holding (CSS class)

## Acceptance Criteria

- [ ] Settings button (gear) is always visible in header
- [ ] Tapping gear opens settings panel without needing parent mode
- [ ] Parent Mode toggle is the first section in settings panel
- [ ] Toggling parent mode ON keeps settings panel open
- [ ] Toggling parent mode OFF closes settings panel
- [ ] Gear icon changes color when parent mode is active
- [ ] Auto-lock timer still works (reverts to child mode after inactivity)
- [ ] All existing parent-mode-gated UI still works (.parent-mode class)
- [ ] No orphaned references to lock button, hold timer, or holding class
- [ ] No lock icon visible anywhere in the app
- [ ] Ship as a single atomic commit
