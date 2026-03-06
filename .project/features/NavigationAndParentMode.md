# Navigation Infrastructure & Parent Mode

## Status: PLANNING
## Priority: Phase 0 -- required before Reward Tracker and Visual Schedules

---

## Executive Summary

Add a bottom tab bar for switching between three app views (Talk, Schedule, Rewards) and implement an app-wide parent/child mode toggle that controls editing across all features. This is the foundation that both Visual Schedules and Reward Tracker depend on.

---

## Requirements

1. Replace the current #bottom-bar (settings gear only) with a 3-tab navigation bar
2. Three tabs: Talk (AAC board), Schedule (visual schedules), Rewards (reward tracker)
3. The AAC board must continue to function identically inside the Talk tab
4. An app-wide parent mode toggle (lock icon) replaces the current per-feature edit mode
5. Parent mode requires a deliberate unlock action to prevent accidental child access
6. All views respect parent/child mode -- edit controls only visible in parent mode

---

## Architecture Overview

### Current Layout (body flex column)

    #message-bar (fixed height)
    #grid-container (flex: 1)
    #bottom-bar (fixed height, settings gear only)

### New Layout (body flex column)

    #app-header (lock icon for parent mode, view-specific title)
    #view-talk (message-bar + grid-container -- existing AAC board)
    #view-schedule (placeholder for Visual Schedules feature)
    #view-rewards (placeholder for Reward Tracker feature)
    #tab-bar (3-tab navigation, replaces #bottom-bar)

Only one view is visible at a time. Tab bar is always visible.

### View Switching

- Each view is a div with display:none by default
- Active view gets display:flex (column)
- Switching tabs: hide current view, show target view, update active tab styling
- No page reload, no routing -- pure DOM show/hide

### Tab Bar Design

- 3 equal-width tabs across the bottom
- Each tab: icon (inline SVG) + label text
- Tab 1: Talk (speech bubble icon)
- Tab 2: Schedule (list/checklist icon)
- Tab 3: Rewards (star icon)
- Active tab: filled icon + bold label + brand color accent
- Inactive tabs: outline icon + muted label
- Height: 56-64px
- Touch targets: full tab width, full tab height (well above 44px minimum)
- Background: #e8e8e8 (matches current bottom-bar)

### Parent Mode

- Small lock icon in #app-header (top-right corner)
- Default state: locked (child mode)
- Unlock action: tap lock icon 3 times within 2 seconds
- Visual indicator: when unlocked, lock icon changes to open-lock, header gets a subtle colored top-border (2px solid orange or similar)
- Auto-lock: after 5 minutes of inactivity in parent mode, auto-lock back to child mode
- State stored in JS variable (not persisted -- always starts locked on app launch)

### Parent Mode Effects by View

**Talk tab (parent mode ON):**
- Settings gear appears in header (or a small edit icon)
- Tapping buttons opens edit modal (current edit mode behavior)
- Add button control visible

**Talk tab (parent mode OFF):**
- No settings access
- Tapping buttons speaks the word and adds to message bar (current default behavior)

**Schedule tab (parent mode ON):**
- Edit/create schedule template controls visible
- Reorder and add/remove step controls

**Schedule tab (parent mode OFF):**
- Current schedule displayed
- Only interaction: tap current step to mark done

**Rewards tab (parent mode ON):**
- Configure track, change reward, reset controls visible

**Rewards tab (parent mode OFF):**
- Reward track path visible
- Only interaction: tap "I did it!" button

### Settings Migration

The current settings modal contains:
- Edit Buttons (toggle edit mode) -- replaced by parent mode
- Add Button -- moves to parent mode header action in Talk tab
- Voice settings -- moves to a settings icon within Talk tab header (parent mode only)
- Reset to defaults -- moves to settings within Talk tab (parent mode only)

The global settings overlay remains but is only accessible in parent mode from the Talk tab.

---

## Task Breakdown

### Task 0.1: Create #app-header
- Add a header bar at the top of body (above all views)
- Contains: view title (centered), lock icon (right side)
- Lock icon is always visible (so parent can always unlock)
- Minimal height: 40-44px
- Background: white or light grey, subtle bottom border

### Task 0.2: Create #tab-bar
- Replace #bottom-bar with #tab-bar
- 3 tabs with inline SVG icons and text labels
- Wire up click handlers to switch active view
- Active tab styling (filled icon, brand color text)
- Default active tab: Talk

### Task 0.3: Wrap AAC board in #view-talk
- Move #message-bar and #grid-container inside a new #view-talk div
- Verify AAC board functions identically (speak, folders, message bar)
- #view-talk is display:flex, flex-direction:column, flex:1 when active

### Task 0.4: Create placeholder views
- #view-schedule: centered text "Visual Schedules -- coming soon" (placeholder)
- #view-rewards: centered text "Reward Tracker -- coming soon" (placeholder)
- Both hidden by default, shown when their tab is active

### Task 0.5: Implement parent mode toggle
- Lock icon in #app-header
- 3-tap detection (within 2 seconds)
- parentMode boolean state variable
- Visual indicator on unlock (icon change + header border)
- Auto-lock timer (5 minute inactivity reset)

### Task 0.6: Retrofit AAC board to use parent mode
- Remove the old editMode toggle from settings
- Parent mode ON in Talk tab -> tapping buttons opens edit modal
- Parent mode OFF in Talk tab -> normal speak behavior
- Settings gear only appears in header when parent mode ON
- Add Button only accessible in parent mode

### Task 0.7: Verify and test
- All AAC board functionality preserved
- Tab switching works
- Parent mode lock/unlock works
- Auto-lock timer works
- Toast notification on parent mode toggle
- Keyboard accessibility for tabs and lock icon

---

## Integration Points

- IndexedDB: no schema changes needed for this phase
- Service worker: no changes needed
- manifest.json: no changes needed (app name stays "AAC Board" -- it now does more, but the manifest name can be updated later)

---

## Accessibility Considerations

- Tab bar buttons must have aria-label and role="tab"
- Tab container has role="tablist"
- View panels have role="tabpanel" and aria-labelledby pointing to their tab
- Active tab has aria-selected="true"
- Lock icon button has clear aria-label ("Unlock parent mode" / "Lock parent mode")
- Focus management: when switching tabs, focus moves to the view panel
- All interactive elements keyboard accessible (Tab, Enter, Space)

---

## Acceptance Criteria

- [ ] Bottom tab bar with 3 tabs renders correctly on phone and tablet
- [ ] Tapping Talk tab shows AAC board, Schedule/Rewards show placeholders
- [ ] AAC board works identically inside the Talk tab (speak, folders, message bar, edit)
- [ ] Lock icon visible in header; 3-tap unlocks parent mode
- [ ] Parent mode shows edit controls; child mode hides them
- [ ] Auto-lock after 5 minutes of inactivity
- [ ] Tab bar touch targets are at least 44px tall
- [ ] Screen reader announces tab names and active state correctly
- [ ] No visual regressions on the AAC board grid layout
