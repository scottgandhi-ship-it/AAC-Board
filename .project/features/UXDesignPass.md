# Juno's UX/UI Design Pass -- Full App Review

## Executive Summary

A comprehensive mobile-first and tablet-optimized design review of every screen in the AAC Board app. The goal is to deliver the best possible experience on phones and tablets while preserving all existing design decisions: Fitzgerald Key color coding, core word positioning, motor planning consistency, and the single-file PWA architecture.

**Constraints (DO NOT CHANGE):**
- Fitzgerald Key color assignments (verbs=green, nouns=orange, etc.)
- Core word strip content, order, and persistent visibility
- Motor planning: no word positions may move
- Grid template sizes (3x3, 4x4, 6x6) and their column behavior
- Feature set and screen structure (Talk, Schedule, Rewards, Insights)
- Single-file architecture (index.html)

---

## Screen-by-Screen Findings and Recommendations

---

### 1. TALK SCREEN (Main Communication Grid)

**1.1 Grid Cells -- Image Sizing**
- ISSUE: Cell images use `max-width: 70%; max-height: 55%` with no minimum. On 6x6 grids on small phones, symbols render tiny and hard to recognize.
- ISSUE: No explicit `width`/`height` on `<img>` elements causes layout shift as images load asynchronously (emoji flashes then swaps to ARASAAC symbol).
- FIX: Set `width: 70%; height: auto; min-height: 28px` on cell images. For 6x6, increase image allocation to `max-height: 60%`. Add `aspect-ratio: 1` to the image container area to reserve space and eliminate layout shift.

**1.2 Grid Cells -- Label Readability on 6x6**
- ISSUE: On 6x6 grids, label font clamps to `0.55rem` minimum -- nearly unreadable on phones.
- FIX: Raise 6x6 label minimum to `0.6rem`. For cells with ARASAAC symbols, the image does the heavy lifting -- labels are secondary but must remain legible for caregivers.

**1.3 Grid Cells -- Visual Depth and Consistency**
- ISSUE: Word cells use colored gradients with a 3px bottom border "press" effect, while folder cells use white backgrounds with pastel gradients. The visual language is inconsistent -- folders look like cards, words look like candy buttons.
- FIX: Unify the tactile language. Give folder cells the same 3px bottom-border press affordance as word cells. Keep the pastel folder gradients (they aid navigation) but match the shadow and border treatment to word cells for consistency.

**1.4 Grid Cell Tap Feedback**
- OBSERVATION: `:active` state uses `scale(0.92) translateY(2px)` which is excellent physical button feedback. No changes needed.

**1.5 Message Bar -- Small Phone Squeeze**
- ISSUE: On screens < 360px, bar buttons shrink to 40x40px, violating the project's 44px minimum touch target rule.
- FIX: Keep buttons at 44x44px minimum on all breakpoints. Reduce message bar padding and gap instead to reclaim space. On very small screens, consider hiding the search button (least-used action) behind a long-press or settings option.

**1.6 Message Bar -- Word Chip Overflow**
- ISSUE: `max-height: 80px` with `overflow-y: auto` means long sentences create a scrollable area within the bar. On small phones (max-height: 60px), this is cramped.
- FIX: Increase small-phone max-height to 68px (2 lines). Add a subtle gradient fade at the bottom edge when content overflows to signal scrollability.

**1.7 Prediction Strip -- Scroll Affordance**
- ISSUE: Horizontal scrollbar is hidden (`scrollbar-width: none`). Users have no visual cue that more predictions exist off-screen.
- FIX: Add a subtle right-edge fade gradient (white-to-transparent) when the strip has overflow content. This is a standard mobile pattern for horizontal scroll areas.

**1.8 Prediction Strip -- Chip Sizing**
- OBSERVATION: Chips at `padding: 8px 16px` with 1rem font are well-sized for touch. No changes needed.

**1.9 Core Word Strip -- Horizontal Pressure**
- ISSUE: Buttons use `flex: 1; min-width: 0` which allows them to compress to unreadable widths if more core words are added.
- FIX: Set `min-width: 56px` on core strip buttons. If 5 buttons exceed the viewport width, the strip should become horizontally scrollable (`overflow-x: auto`) rather than compressing. This future-proofs the design.

**1.10 Core Word Strip -- Visual Weight**
- ISSUE: Core strip background (`#F5F5F5 -> #EEEEEE`) is visually flat compared to the vibrant prediction bar and message bar above it. It fades into the background.
- FIX: Increase strip background to a slightly warmer tone with a subtle inner shadow: `box-shadow: inset 0 1px 3px rgba(0,0,0,0.06)`. This adds just enough depth to frame the core words without competing with the Fitzgerald Key colors.

**1.11 Folder Label -- Visibility**
- ISSUE: Folder label at `1.05rem; color: #555` is understated. When navigating into a folder, the user needs a clear "you are here" signal.
- FIX: Bump to `1.15rem; font-weight: 800; color: #333`. Add a small colored underline bar (4px, using the folder's gradient color) to visually connect the label to the folder's identity.

---

### 2. VISUAL SCHEDULE SCREEN

**2.1 Step Layout -- Touch Targets**
- OBSERVATION: Steps at `min-height: 72px` (88px for current) with full-width tap area are excellent. No changes needed.

**2.2 Current Step -- Visual Prominence**
- ISSUE: Current step uses `border-left: 4px solid var(--bar-bg)` and a purple background tint. This is good but subtle on phones held in bright sunlight.
- FIX: Increase border-left to `5px`. Add a subtle left-pointing chevron or "NOW" badge to the current step for pre-literate users who can't read the "Tap when done" hint.

**2.3 Done Steps -- Opacity**
- ISSUE: Done steps at `opacity: 0.45` look disabled/broken. A child might think something is wrong.
- FIX: Use `opacity: 0.6` and add a green-tinted background (`#F1F8E9`) instead of gray (`#f5f5f5`). The green reinforces "completed = good" at a glance.

**2.4 Step Image Sizing**
- ISSUE: Step images at 52x52 (60x60 current) are functional but could be larger on tablets.
- FIX: On 768px+ screens, increase to `68px x 68px` (current: `76px x 76px`) for better visual impact.

**2.5 All-Done State**
- OBSERVATION: Clean, centered layout with 80px green circle. Effective. No changes needed.

**2.6 Empty State**
- ISSUE: No visual content in the empty state beyond text. Parents opening this tab for the first time see nothing engaging.
- FIX: Add a simple illustration placeholder (large schedule icon or an SVG of a clipboard) with helper text explaining what schedules do and how to start.

---

### 3. REWARD TRACKER SCREEN

**3.1 Track Tabs -- Touch Targets**
- ISSUE: Track tabs have `min-height: 36px`, violating the 44px minimum.
- FIX: Increase to `min-height: 44px; padding: 10px 16px`.

**3.2 Stepping Stone Tiles -- Image Layout**
- OBSERVATION: Recent improvement (PR #24) fills tiles with activity images. Checkmark overlays on completed tiles are clear. Good work.

**3.3 Stepping Stone Grid -- Tablet Optimization**
- ISSUE: Grid is capped at `max-width: 420px` (500px on tablets). On a 10" iPad in landscape, this leaves massive empty margins.
- FIX: On 768px+ screens, increase max-width to `600px` and allow slightly larger tiles. On 1024px+ landscape, consider a 2-column layout with path on one side and reward card on the other.

**3.4 Reward Card -- Visual Hierarchy**
- ISSUE: The locked reward card uses `border: 3px dashed` which looks incomplete/broken rather than "coming soon."
- FIX: Use `border: 3px solid #e0e0e0` for locked state (dashed -> solid). Keep the dashed-to-solid transition only for the unlocked celebration moment. Add a subtle lock icon overlay on the reward image itself.

**3.5 Reward Card -- Locked State Readability**
- ISSUE: Locked icon with `filter: grayscale(0.7) opacity(0.5)` plus label at `color: #999` makes the reward nearly invisible. The child should still see WHAT they're working toward.
- FIX: Reduce grayscale to `0.4` and opacity to `0.7`. Keep label at `color: #666`. The reward should be desaturated but recognizable -- building anticipation, not hiding information.

**3.6 Celebration Overlay**
- OBSERVATION: White overlay with blur, pop animation, confetti -- well-designed and joyful. Quiet mode properly suppresses sound/confetti. No changes needed.

**3.7 Active Tile Glow Animation**
- OBSERVATION: The pulsing purple glow (`tileGlow 2s infinite`) effectively draws attention to the next tile. Good.

---

### 4. INSIGHTS SCREEN (Parent Mode)

**4.1 Summary Cards -- Tablet Layout**
- ISSUE: Cards use `flex: 1` in a row, which works fine on phones but looks thin and spread-out on tablets.
- FIX: On 768px+ screens, set `max-width: 200px` per card and center the row. This prevents cards from stretching to fill wide screens.

**4.2 Top Words Chart -- Bar Colors**
- OBSERVATION: Bars use Fitzgerald Key colors correctly. Accessible, informative. Good.

**4.3 Top Words Chart -- Label Truncation**
- ISSUE: Labels fixed at `width: 90px` with `text-overflow: ellipsis`. Multi-word button labels (e.g., "chocolate milk", "don't want") get clipped.
- FIX: Increase label width to `110px` on phones, `130px` on tablets. Alternatively, allow labels to wrap to 2 lines with `white-space: normal; line-height: 1.2`.

**4.4 Weekly Chart -- Today Highlight**
- ISSUE: Today's bar uses `#4CAF50` (green) which is the same color used for "done" and "save" actions. It doesn't stand out as "today."
- FIX: Use the app's brand purple (`var(--bar-bg)`) for today's bar. This creates a stronger visual connection to the app's identity and differentiates "today" from "completed."

**4.5 Weekly Chart -- Empty State**
- ISSUE: If a day has zero words, the bar is `min-height: 2px` which is invisible.
- FIX: Increase to `min-height: 4px` and use a lighter shade so empty days are still visible as a baseline.

**4.6 Export/Reset -- Button Layout**
- OBSERVATION: Flex row with equal buttons works well. Danger styling on clear button is appropriate. No changes needed.

---

### 5. SETTINGS PANEL

**5.1 Checkbox Touch Targets**
- ISSUE: Grammar and sensory checkboxes are `20px x 20px` inline-styled. These are difficult to tap.
- FIX: Style checkbox labels as full-width tappable rows with `min-height: 44px; padding: 10px 0`. The label already wraps the checkbox so the entire row is tappable, but the visual hit area needs to be clearer. Consider replacing native checkboxes with toggle switches matching the reward config's toggle style for visual consistency.

**5.2 Grid Size Picker -- Feedback**
- ISSUE: Active grid size uses `border-color: var(--bar-bg)` which is subtle.
- FIX: Add a checkmark badge or filled radio indicator to the active option. This gives instant confirmation of the current selection.

**5.3 Section Organization**
- OBSERVATION: Logical grouping (Buttons, Voice, Grid, Grammar, Symbols, Sensory, Predictions, Data). No reordering needed.

**5.4 Panel Max Height**
- ISSUE: `max-height: 85vh` with 9 sections means a lot of scrolling on phones.
- FIX: No structural change needed, but add section dividers with slightly more spacing (`margin-bottom: 24px` instead of 18px) and consider collapsible sections for rarely-used groups (Symbols, Data) to reduce scroll depth.

---

### 6. EDIT MODAL

**6.1 Image Action Buttons -- Touch Targets**
- ISSUE: Upload/Camera/Symbol/Clear buttons have `padding: 8px 12px` producing ~36px effective height. Below 44px minimum.
- FIX: Increase to `padding: 12px 14px; min-height: 44px`. Stack in a 2x2 grid rather than a single row to maintain width on small screens.

**6.2 Color Picker**
- ISSUE: Using a native `<select>` dropdown for Fitzgerald Key colors means users see text labels ("yellow", "green") without seeing the actual color until selected.
- FIX: Replace with a row of tappable color swatches (circles, 36px diameter, with 44px touch area via padding). Each swatch uses the Fitzgerald Key gradient. Selected swatch gets a checkmark overlay or thick border. This is more intuitive and faster.

**6.3 Image Preview**
- ISSUE: Preview at `80x80px` is adequate but cramped within the modal.
- FIX: Increase to `96x96px` and center it above the image action buttons for clearer visual hierarchy.

---

### 7. TEMPLATE EDITOR MODAL

**7.1 Step Reorder Buttons -- Touch Targets**
- ISSUE: Up/down/delete buttons at `32x32px` are the most severe touch target violation in the app. These are used by parents managing schedules.
- FIX: Increase to `min-width: 40px; min-height: 40px` with `padding: 4px`. Group move-up and move-down into a single drag handle (grip icon) to reduce button count. Alternatively, keep discrete buttons but at 44px.

**7.2 Step Row Layout**
- ISSUE: Image (36x36), label, and 3 action buttons (32x32 each) create a cramped row on phones.
- FIX: Increase step image to `44x44px`. Use icon-only buttons at `40x40px` with adequate spacing (gap: 4px -> 8px).

---

### 8. CROSS-CUTTING IMPROVEMENTS

**8.1 Tablet Layout (768px+)**
- ISSUE: The tablet breakpoint only adjusts gap and max-width. The app looks like a stretched phone rather than a tablet-native experience.
- FIX:
  - Talk screen: Increase grid gap to 14px, cell padding to 12px 8px. Allow grid container to use more horizontal space (remove restrictive max-widths).
  - Schedule: Widen step rows, larger images, increase padding.
  - Rewards: Allow wider path grid (600px max-width).
  - Settings/Edit modals: Increase max-width to 480px/440px respectively.
  - General: On landscape tablets (1024px+), consider side-by-side layouts where appropriate (e.g., message bar + predictions on left, grid on right).

**8.2 Landscape Orientation**
- ISSUE: No landscape-specific styles exist. On phones in landscape, the header + message bar + prediction strip + core strip consume most of the viewport height, leaving minimal grid space.
- FIX: Add `@media (orientation: landscape) and (max-height: 500px)` rules:
  - Reduce app-header height to 36px
  - Reduce message bar min-height to 44px with tighter padding
  - Reduce core strip padding to 4px 8px
  - Reduce tab bar min-height to 44px
  - This reclaims ~40px of vertical space for the grid

**8.3 Consistent Border Radius**
- OBSERVATION: The app has a radius system (`--radius-lg: 20px, --radius-md: 14px, --radius-sm: 10px`) but some elements use hardcoded values (e.g., `24px` on folders, `16px` on task tiles, `12px` on insight cards).
- FIX: Audit and normalize: modals/cells = `--radius-lg`, buttons/inputs = `--radius-md`, chips/badges = `--radius-sm`. This creates visual rhythm without changing the look dramatically.

**8.4 Focus Indicators**
- OBSERVATION: Focus styles exist for high contrast mode (3px outline) but default focus indicators are browser-default in normal mode.
- FIX: Add a visible focus-visible ring on all interactive elements: `outline: 2px solid var(--bar-bg); outline-offset: 2px`. This benefits keyboard/switch-access users without affecting touch users.

**8.5 Loading States**
- ISSUE: No loading states for ARASAAC symbol download. Grid renders with emoji, then images pop in asynchronously.
- FIX: During initial symbol download, show a subtle skeleton shimmer on cells where symbols are loading. After download completes, render cleanly.

**8.6 Safe Area Handling**
- OBSERVATION: Header and tab bar correctly use `env(safe-area-inset-*)`. Good. No changes needed.

---

## Priority Matrix

### P0 -- Must Fix (Touch Target Violations)
- 1.5: Message bar buttons 40px on small phones -> 44px minimum
- 3.1: Track tabs 36px -> 44px minimum
- 6.1: Edit modal image buttons ~36px -> 44px minimum
- 7.1: Template step buttons 32px -> 40-44px minimum
- 5.1: Settings checkboxes -> larger tappable rows or toggle switches

### P1 -- High Impact Visual Improvements
- 1.1: Grid cell image sizing (min-height, layout shift prevention)
- 3.4+3.5: Reward card locked state (less invisible, more anticipation)
- 8.2: Landscape orientation support
- 6.2: Color picker -> visual swatches
- 1.7: Prediction strip scroll affordance (fade edge)
- 2.3: Done step opacity (0.45 -> 0.6 with green tint)

### P2 -- Polish and Tablet Optimization
- 8.1: Tablet-specific layout improvements
- 1.3: Folder/word cell visual consistency
- 1.10: Core strip visual weight
- 1.11: Folder label visibility
- 4.3: Top words label width
- 4.4: Weekly chart today color -> brand purple
- 8.3: Border radius normalization
- 1.2: 6x6 label minimum font size
- 1.9: Core strip min-width + overflow scroll

### P3 -- Nice to Have
- 8.5: Loading skeleton for symbol download
- 2.6: Empty schedule state illustration
- 5.4: Collapsible settings sections
- 4.1: Insights cards tablet max-width
- 4.5: Weekly chart empty day bar height
- 8.4: Default focus-visible indicators
- 1.6: Message word overflow fade hint
- 2.2: Current step "NOW" badge
- 2.4: Step image sizing on tablets

---

## Implementation Approach

This work should be done in **4 subphases**, each independently testable:

**Subphase A: Touch Target Fixes (P0)**
- All touch target violations fixed
- Estimated: ~50 lines of CSS changes
- Test: verify all interactive elements >= 44px on all breakpoints

**Subphase B: High Impact Visual (P1)**
- Image sizing, reward card, landscape, color picker, prediction fade, step opacity
- Estimated: ~150 lines of CSS + ~40 lines of JS (color picker)
- Test: visual review on phone + tablet, portrait + landscape

**Subphase C: Tablet and Polish (P2)**
- Tablet breakpoint improvements, visual consistency, border radius normalization
- Estimated: ~100 lines of CSS
- Test: tablet testing (iPad or equivalent), compare 3x3/4x4/6x6

**Subphase D: Nice to Have (P3)**
- Loading skeletons, empty states, collapsible sections, focus indicators
- Estimated: ~80 lines of CSS + ~30 lines of JS
- Test: full regression across all screens

---

## Files Changed

- `index.html` only -- CSS and minor JS modifications
- `sw.js` -- bump cache version after each subphase

---

## Acceptance Criteria

1. ALL interactive elements meet 44px minimum touch target on all breakpoints
2. Grid cells display symbols without layout shift (space reserved before load)
3. App is usable in landscape orientation on phones
4. Tablet screens (768px+) use available space effectively
5. Locked rewards are desaturated but recognizable (not invisible)
6. Prediction strip signals overflow with edge fade
7. Settings toggles are visually consistent (all toggle switches or all checkboxes)
8. Color picker uses visual swatches instead of text dropdown
9. No Fitzgerald Key colors changed
10. No core word positions changed
11. No motor planning violations introduced
12. Lighthouse accessibility score maintained or improved
