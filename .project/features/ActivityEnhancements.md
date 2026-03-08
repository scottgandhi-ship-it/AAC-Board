# Activity Enhancements -- Premium Placement, Templates, Clinical Word Review

## Executive Summary

Three interconnected improvements to Activity Overlays:
1. **Premium UI Placement** (Noah): Promote Activities from Settings > Customize to its own top-level tab
2. **Activity Templates** (New Feature): Let SLPs/parents create custom activities with word selections and export them as shareable templates
3. **Clinical Word Review** (Marci): Fix core word gaps, remove low-frequency fringe words, fix color coding inconsistencies across all 12 overlays

## Requirements

### 1. Activities Tab (Noah's Recommendation)

**Current state**: Activities buried 4 taps deep in Settings > Customize > Activities section.

**Target state**: Activities gets its own top-level tab, second position in bottom nav.

Tab bar changes:
- New order: Talk | Activities | Schedule | Rewards | [gear icon]
- Settings gear demotes to icon-only button (no label, flex: 0 0 48px, color #bbb default)
- Activities tab shows full-view picker when tapped
- Parent mode gate: if parent mode off, tapping triggers unlock challenge; if on, shows picker directly

Activities tab view:
- Header: "Choose an Activity" with subtitle "Focus the board on words for this routine"
- Activity cards: 2-column grid, min 80px tall, generous padding
- Each card: icon (1.8rem) + label (0.9rem, 600 weight) + soft color accent bar on left
- Active activity: highlighted state with "End Activity" button
- Bottom: subtle "Manage Activities" link -> opens Settings > Customize

Settings > Customize retains Activities editing section (for future custom activity creation).

### 2. Activity Templates (Export/Share)

**Goal**: SLPs and parents can create custom activities with specific word selections, then export them as shareable .aactemplate files (JSON) that others can import.

**Create Activity flow** (in Activities tab, parent mode):
- "Create Activity" card at end of activity grid (+ icon, dashed border)
- Modal flow:
  - Step 1: Name the activity, pick an icon (emoji picker or preset list), pick accent color
  - Step 2: Select words from existing vocabulary (searchable list grouped by folder) or add new words
  - Step 3: Preview the activity overlay and confirm
- Custom activities saved to localStorage alongside ACTIVITY_BUNDLES
- Custom activities appear in the Activities tab alongside defaults
- Parent can edit or delete custom activities (long-press or edit button)

**Export flow**:
- Each activity card gets a share/export button (visible in parent mode)
- Exports a .aactemplate JSON file containing: activity name, icon, color, words array (with all properties: id, label, labelEs, color, icon, symbolKw)
- Uses Web Share API on mobile, download on desktop
- Default activities can also be exported (for SLPs to share curated bundles)

**Import flow**:
- "Import Activity" button in Activities tab or Settings > Customize
- Accepts .aactemplate files
- Preview imported activity before adding
- Validates structure, deduplicates IDs

### 3. Clinical Word Review (Marci's Audit)

**Systemic fixes**:
- Every overlay gets consistent core words: I (yellow), want (green), no (pink), help (green), more (blue), all done (green)
- Fix "all done" color: always green (verb) across all overlays
- Fix "yucky" in Sensory Play: change from pink to blue (descriptor)

**Per-activity word changes**:

**Mealtime** (16 words):
- ADD: I (yellow), no (pink)
- REMOVE: bowl
- Net: 17 -> drop to 16 by removing "thank you" if needed, or keep at 17

**Bath Time** (14 words):
- ADD: I (yellow), help (green), no (pink), out (purple)
- REMOVE: duck
- Net: 17

**Playground** (15 words):
- ADD: I (yellow), no (pink), want (green)
- REMOVE: high (redundant with "up")
- Net: 17

**Bedtime** (14 words):
- ADD: I (yellow), no (pink), help (green), all done (green)
- REMOVE: dark (covered by scared + light)
- Net: 17

**Getting Dressed** (15 words):
- ADD: I (yellow), no (pink)
- REMOVE: zip (overly specific; help covers it)
- Net: 16

**Circle Time** (14 words):
- ADD: I (yellow), help (green), no (pink)
- REMOVE: friend (too abstract for target level)
- Net: 16

**Car Ride** (14 words):
- ADD: no (pink), help (green), all done (green)
- REMOVE: are we there (luxury phrase; go + home covers it)
- Net: 16

**Sensory Play** (15 words):
- ADD: help (green), no (pink), all done (green), stop (green)
- REMOVE: cool (ambiguous), bubbles (fringe)
- CHANGE: yucky from pink to blue
- Net: 16 (drop "mix")

**Book Time** (14 words):
- ADD: want (green), no (pink), where (yellow)
- REMOVE: see (redundant with look)
- Net: 16

**Doctor Visit** (14 words):
- ADD: no (pink), want (green), stop (green)
- REMOVE: turn (ambiguous), body (too abstract)
- CHANGE: all done from blue to green
- Net: 15

**Art Time** (15 words):
- ADD: no (pink), more (blue), all done (green)
- REMOVE: pretty (adult-driven), on (low priority)
- Net: 16

**Grocery Store** (15 words):
- ADD: help (green), stop (green)
- REMOVE: yummy (not eating yet), in (put + pointing covers it)
- CHANGE: all done from blue to green
- Net: 15

## Architecture Overview

All changes are within index.html:
- Tab bar HTML: ~line 3851
- Tab bar CSS: ~line 1692
- ACTIVITY_BUNDLES data: ~line 5630
- Activity overlay JS: ~line 8354
- Settings Customize section: ~line 4072

New code needed:
- Activities tab view HTML
- Activities tab switching logic
- Custom activity creation modal + logic
- Export/import template functions
- localStorage for custom activities

## Task Breakdown

### Phase A: Clinical Word Review (data-only, low risk)
- [ ] Update all 12 ACTIVITY_BUNDLES word arrays per Marci's recommendations
- [ ] Fix color coding inconsistencies (all done -> green everywhere, yucky -> blue)
- [ ] Add Spanish translations for all new words
- [ ] Add ARASAAC symbolKw for all new words

### Phase B: Activities Tab Promotion (UI restructure)
- [ ] Add Activities tab to bottom nav HTML
- [ ] Update tab bar CSS (5 items, gear icon compact)
- [ ] Create Activities tab view HTML (picker layout)
- [ ] Add tab switching logic for Activities
- [ ] Move activity cards rendering to new tab view
- [ ] Add parent mode gate on Activities tab
- [ ] Update Settings > Customize to retain editing only
- [ ] Test active activity highlighting and end-activity flow

### Phase C: Activity Templates (new feature)
- [ ] Add "Create Activity" card UI
- [ ] Build activity creation modal (name, icon, color, word picker)
- [ ] Implement custom activity storage (localStorage)
- [ ] Add export function (.aactemplate JSON)
- [ ] Add import function with validation
- [ ] Add share/export button to each activity card
- [ ] Wire up Web Share API for mobile export

### Phase D: Validation
- [ ] Test all 12 updated word overlays
- [ ] Test Activities tab navigation flow
- [ ] Test parent mode gate on Activities tab
- [ ] Test custom activity create/edit/delete
- [ ] Test export/import round-trip
- [ ] Mobile device testing
- [ ] Bump sw.js cache version

## Acceptance Criteria

- Activities accessible in 2 taps from Talk (tab + card)
- All 12 overlays contain I, want, no, help, more, all done as core words
- All "all done" buttons are green across every overlay
- Custom activities can be created with selected words
- Activities can be exported as .aactemplate and imported on another device
- Parent mode gate prevents child access to Activities tab
- Settings gear still accessible (icon-only, far right)
- No regression in existing activity overlay functionality
