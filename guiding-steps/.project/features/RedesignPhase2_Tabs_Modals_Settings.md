# Redesign Phase 2: Tabs + Modals + Settings (PR-2 through PR-5 combined)

## Executive Summary

Complete the Storybook Canvas visual port by re-skinning Schedule, Steps, Stories, and Settings tabs plus all associated modals. Lands the long-press Done interaction (0.3s default, 0.2-0.4s configurable). Removes Nunito font load; the app is now fully on Fraunces + Inter. Service worker bumped v16 to v17.

Ships as a single PR `feature/redesign-phase2 -> master`. Implementation proceeds tab-by-tab with sim-test after each tab so regressions are caught locally before the final diff.

## Scope

### In scope

1. **Schedule tab** -- numbered spine progress, step rows, bottom action buttons (Set up schedule / Edit templates)
2. **Schedule modals** -- Edit Templates, New Schedule, Edit Schedule (all using shared modal shell)
3. **Long-press Done interaction** -- 0.3s default, 0.2-0.4s configurable in Settings. Applies to Schedule "Done" and Steps "Done" buttons.
4. **Steps tab** -- task strip rows, bottom action buttons (New chart / Configure / more)
5. **Steps modals** -- New Reward Chart (template list), New Task Strip (without timer toggle), Edit Task Strip (without timer)
6. **Stories tab** -- scrolling list with Recent / This month sections, create-new dashed card at end
7. **Reader** -- full-screen page card with speaker button, page-turn indicator, close/print header
8. **Stories modals** -- Choose a Story sheet, Edit Story Details, Edit Story Page
9. **Settings sheet** -- grouped sections (Child, Routines, Accessibility, Data, Progress, About) using card pattern from design
10. **Font cleanup** -- remove Nunito `<link>` now that all screens are on Fraunces + Inter
11. **Service worker** -- cache bump v16 to v17; keep existing cache strategy

### Out of scope (confirmed earlier in session)

- Countdown timer toggle in Steps (backing feature exists on reward chart completion only; per-step timer drop decided 2026-04-19)
- Co-parent sharing rows in Settings or Edit Story Details
- iCloud backup row in Settings
- Per-page voice notes (recorded audio) in Edit Story Page
- Story search field in Choose a Story sheet
- "Recently removed" / Restore in Choose a Story
- Multi-voice picker UI on Edit Story Details
- Read-aloud-on-open toggle per story
- Reading level / text size in stories (Settings) -- not implemented today
- Celebration sounds toggle in Settings -- already covered by existing "Quiet mode"

Rule: port only what exists today. If the mockup shows a feature that isn't implemented, drop it from the port.

## Architecture

### Token migration strategy

Each tab's CSS gets a new scoped block using `--gs-*` tokens. Legacy `--chrome-*` tokens can remain in `:root` for now; after this PR they are unreferenced. A follow-up cleanup PR can remove them.

Font migration: after all tabs are ported, remove the `<link href="https://fonts.googleapis.com/css2?family=Nunito...">` line. The app will be fully on self-hosted Fraunces + Inter.

### Shared modal shell

Create a reusable modal CSS pattern:
- Fixed overlay with dimmed backdrop (`rgba(27,29,46,0.28)` plus 1.5px blur)
- Floating card, 14px inset, `--gs-bg` background, 22px radius, 1px `--gs-hair` border
- Shadow: `0 8px 30px rgba(27,29,46,0.18), 0 24px 60px rgba(27,29,46,0.12)`
- Header: 22px padding top, Fraunces 24px title
- Content area: scrollable when content overflows
- Footer: action buttons in a grid row with 8px gap, top border hairline

Reuse across all 7 modals. Each modal opens from an existing settings/edit affordance. Focus management: focus moves to modal title on open, focus trap within modal, Escape closes, focus returns to activator on close.

### Long-press Done interaction

New helper in JS: `bindLongPressDone(button, onConfirm)`.

Behavior:
- Start timer on pointerdown / touchstart
- Animate the ring's `stroke-dashoffset` from full to zero over the duration
- At duration reached, call `onConfirm()` and reset
- Cancel timer and reset ring on ANY of: pointerup, touchend, pointerleave, **pointercancel** (iOS system gestures, incoming calls), or **visibilitychange** (app backgrounded)
- **Re-entry rule:** if user releases early and re-presses, always restart the ring from zero. No resume.
- **Movement threshold:** if pointer moves more than 10px from pointerdown origin, cancel the timer (treat as scroll intent).
- Duration read from `localStorage['gs-long-press-duration']` (default 300ms; clamped 200-400ms)
- Haptic pulse on confirm (existing `navigator.vibrate` pattern)
- Respects `prefers-reduced-motion`: ring fill is instant, but the timer still runs so the user still has to hold
- **Screen reader announcement:** on FIRST pointerdown of a press, fire "Hold to confirm" via a shared `aria-live="polite"` region. On confirm, fire "Confirmed." Do not re-announce on re-entry or movement. Guard with a per-press flag.

Visual: 52px circle button, indigo background, white check icon; ring overlay in `--gs-accent-deep` at 2.5px stroke that fills CCW during hold.

New Settings control: segmented group "Long-press duration" with 0.2s / 0.3s / 0.4s options, default 0.3s.

### Per-tab visual spec

#### Schedule tab
- Top bar: `eyebrow` (e.g., "Tuesday - April 19") + display-font title ("Morning Routine")
- Progress row: "Step X of Y" + thin rule + estimated time
- Step spine (each step): numbered circle on left (indigo if active/done, outline if upcoming), vertical connector line, step card with 48px icon tile + label
  - Active step: white card with shadow, icon tile in `--gs-accent-soft`, long-press Done button on right
  - Done steps: strikethrough label, opacity 0.55
  - Upcoming: transparent card, muted icon tile
- Bottom action row: "Set up schedule" and "Edit templates" (card-style buttons)
- Keep existing visible-steps setting (parent view shows all, child view shows N)

#### Steps tab
- Top bar: eyebrow "<Chart Name> - task strip" + display-font title
- Progress row: "Step X of Y" + rule + reward hint text
- Task strip rows: rectangular card with icon tile + label + (on active row) long-press Done ring
  - Active: border-left 4px `--gs-accent`, white card with shadow
  - Done: opacity 0.5, strikethrough label
- Bottom action row: "New chart" / "Configure" / overflow button in a 2:2:44px grid
- Preserve existing track tabs row (horizontal scroll)

#### Stories tab
- Top bar: eyebrow "Social stories - N saved" + display-font title
- Scrollable body between top bar (~140px) and bottom bar (~170px)
- Section labels ("Recent", "This month") in uppercase muted caption style
- Story rows: 14px card with 80px square image tile + title (Fraunces 18) + meta line + 3 inline actions ("Open" accent, "Edit"/"Share" soft-ink)
- Create-new row at end: dashed border, plus icon, "Create a new story"
- Bottom bar: "New story" (primary indigo) + "Import" (outline)
- Soft gradient fade at bottom of scroll region

#### Reader
- Header: 38px circular close button (left) + page indicator "Title - 1 / 7" (center) + 38px print button (right)
- Page card: large rounded card with image area (colored background + story SVG) and text area
  - Speaker button: 44px circle in bottom-right of image area, indigo speaker icon
  - Text: small "Page One" eyebrow + Fraunces 22 page text
- Controls: chevron prev (disabled on first) + page dots + chevron next (indigo filled)
- Swipe gestures preserved from existing reader

#### Settings
- Re-render existing Settings overlay with new card pattern
- Section groups:
  - **Child** -- child name, voice for read-aloud
  - **Routines** -- visible steps (segmented 2/3/4), quiet mode (already maps to celebration sounds inverse)
  - **Accessibility** -- reduce motion toggle, high-contrast toggle, long-press duration (segmented 0.2/0.3/0.4s)
  - **Data** -- export schedules / stories / strips buttons, progress report accordion, share progress
  - **About** -- companion info, version
- Rows: 16px padding, 14px card-border-top / hairline dividers between rows within a section, section label in uppercase caption above each card

### Coach mark selector preservation (locked)

Coach marks in `GSCoachMarks.SEQUENCES.schedule` reference:
- `.sched-step.current` -- the active step row
- `.sched-step-done-btn` -- the Done button on the active row

These class names MUST be preserved on the new Schedule markup. Do not rename during the visual port; renaming introduces a two-axis change (visual + behavior) that's harder to review and revert. Visual styling uses separate class names; class names consumed by `GSCoachMarks` stay untouched.

### Icon mapping

Existing 43 task icons and 35 story SVGs stay as they are -- they already match the new palette's icon tokens. In places where Claude Design uses emoji fallbacks (shirt, bowl, blocks, apple, tree, etc.), first try to match an existing SVG; if no match, render the emoji as fallback inside the same 48px tile.

Tab bar icons: keep existing five icons but re-color using `--gs-accent` for active, `--gs-ink-muted` for inactive. Active indicator: 24px pill, 3px tall, under the icon (matches spec).

### State and storage

No schema changes. New localStorage key: `gs-long-press-duration` (string integer milliseconds, default "300"). Added to the existing "Reset all to defaults" handler.

## Task Breakdown (sim-test after each tab)

**Commit discipline:** each task gets its own commit on `feature/redesign-phase2`. Do not squash during implementation -- granular commits preserve revert boundaries if a task introduces regression. Final PR merges with `--squash` for clean master history.

### Task 0: Baseline screenshots
- Uninstall and redeploy current master build on iPhone 17 Pro Max sim
- Walk through onboarding to stable state; capture screenshots of Schedule, Steps, Stories, Reader (one story open), Settings
- Save to `guiding-steps/.design/baseline/phase2-before/` (local, not committed)
- These are the before-half of the non-regression acceptance criterion

### Task 1: Shared modal shell + long-press helper
- Add `.gs-modal-*` CSS classes (overlay, card, header, body, footer, buttons)
- Add `GSLongPress` object with `bind(button, onConfirm, options)` method
- Add `gs-long-press-duration` to state / settings

### Task 2: Schedule tab port
- Replace current `#view-schedule` render with new spine layout
- Wire long-press Done to replace single-tap Done
- Bottom action row restyle
- Sim-test: walk a schedule start-to-finish, confirm step completion and new step advance

### Task 3: Schedule modals port
- Edit Templates, New Schedule, Edit Schedule using shared modal shell
- Preserve existing save / delete / export flows
- Sim-test: open each modal, create / edit / cancel

### Task 4: Steps tab port
- Replace current `#view-rewards` (legacy ID) render with task strip layout
- Track tabs row restyle
- Long-press Done on active row
- Sim-test: complete several steps on an existing track

### Task 5: Steps modals port
- New Reward Chart (template picker), New Task Strip (no timer), Edit Task Strip (no timer)
- Preserve existing add / remove / reorder step logic (reorder arrows live in edit modals only, NOT on active task strip -- respects existing feedback rule)
- Sim-test: create a new chart from template, edit an existing chart

### Task 6: Stories tab port
- Replace current `#view-stories` grid with scrolling list + Recent/This month sections
- Bottom bar with New story + Import
- Sim-test: scroll list, open a story, import a story

### Task 7: Reader port
- Restyle `#reader-overlay` (or existing reader ID) with new page card and controls
- Speaker button wired to existing TTS
- Sim-test: swipe through pages, tap speaker

### Task 8: Stories modals port
- Choose a Story sheet (templates + yours)
- Edit Story Details (title, description, cover, Save/Delete/Cancel only -- no share toggle, no read-aloud toggle)
- Edit Story Page (image, text, page reel; no voice note recording)
- Sim-test: create story from template, edit a page, save

### Task 9: Settings port
- Re-render `#settings-overlay` with section cards
- Add long-press duration segmented control
- Remove any UI for dropped features (no co-parent row, no iCloud row)
- Sim-test: toggle each setting, verify persistence

### Task 10: Cleanup and exit checks
- Remove Nunito `<link>` from `<head>`
- Bump `CACHE_NAME` v16 to v17 in `sw.js` (no new asset paths added to `ASSETS` list -- version bump alone evicts old CSS)
- Remove any now-unused CSS for old styles (keep `--chrome-*` token definitions for now; any unused classes can be swept)
- **Exit check 1:** grep ported CSS for any `font-family: Nunito` references -- should return zero
- **Exit check 2:** grep for `.sched-*`, `.reward-*`, `.story-*`, `.settings-*` CSS rules still referencing `--chrome-*` -- should return zero in ported selectors
- Sim-test: fresh install, full app walkthrough, airplane-mode second launch

### Task 11: PR + review
- Commit surgically (sync has already propagated www/ and ios/public/)
- Open PR `feature/redesign-phase2 -> master`
- Run `/review` on the PR
- Address findings and merge

## Integration Points

- **Service worker:** cache v16 to v17 to evict old CSS. No new asset paths added to the `ASSETS` list -- the version bump alone triggers an activate that clears the old cache. Cache strategy is unchanged: HTML / JS / CSS stay network-first; only `/fonts/*.woff2` are cache-first (immutable). Font list unchanged from v16 (Fraunces / Inter already cached).
- localStorage: add `gs-long-press-duration` (string ms, default "300", clamped 200-400). Added to the existing "Reset all to defaults" handler.
- IndexedDB: no schema changes
- Capacitor: no native config changes. The `.design/` reference folder is NOT in the iOS bundle (Capacitor `webDir` is `www/` only; `.design/` sits outside).
- Existing coach marks: `GSCoachMarks.SEQUENCES.schedule` references `.sched-step.current` and `.sched-step-done-btn`. These class names are preserved verbatim on the new markup (see Coach mark selector preservation section above).

## Accessibility

- All interactive targets >= 44x44 px
- Modal focus management: focus to title, Tab trap, Escape closes, focus returns
- Color contrasts (verified in PR-1 for token set) carry over
- Long-press ring state announced to screen readers via `aria-live="polite"` region: "Hold to confirm" / "Confirmed"
- Dots, progress indicators, and segmented controls use `role="progressbar"` or `role="radiogroup"` as appropriate (not `tablist`)

## Acceptance Criteria

Per tab:
- [ ] Schedule tab renders in new spine layout; step advance works; long-press Done works (0.3s default)
- [ ] Edit Templates / New Schedule / Edit Schedule modals render and round-trip (create, save, cancel, delete)
- [ ] Steps tab renders in task strip layout; step completion works; long-press Done works
- [ ] New Reward Chart / New Task Strip / Edit Task Strip modals render and round-trip; NO timer toggle visible
- [ ] Stories tab scrolls; Recent and This month sections render; create-new row present
- [ ] Reader renders with new page card; TTS works; page turn works both directions
- [ ] Choose a Story / Edit Story Details / Edit Story Page modals render; NO share toggle, NO read-aloud-on-open toggle, NO voice-note recorder
- [ ] Settings renders in new grouped card pattern; long-press duration control present and persists (0.2s / 0.3s / 0.4s)
- [ ] Nunito link removed; all text renders in Fraunces or Inter
- [ ] Service worker cache bumped; airplane-mode second launch still renders correctly
- [ ] Onboarding flow still works end-to-end (PR-1 regression check)
- [ ] Coach marks still fire after onboarding complete
- [ ] Existing feedback rule respected: NO reorder arrows on active schedule or task strip rows -- only in edit modals

Long-press Done behavior:
- [ ] Release before duration cancels with no confirm; ring resets to zero
- [ ] Re-press after early release restarts ring from zero (no resume)
- [ ] Pointer movement greater than 10px from origin cancels the timer (scroll intent)
- [ ] `pointercancel` and `visibilitychange` cancel the timer cleanly
- [ ] `prefers-reduced-motion` still requires the full hold duration (ring fill is instant; timer unchanged)
- [ ] Screen reader announces "Hold to confirm" once per press, "Confirmed." on success; no spam on movement

Non-regression:
- [ ] Non-regression screenshots captured BEFORE this PR for all five screens (Schedule, Steps, Stories, Settings, Reader) -- used to compare post-merge visuals
- [ ] Device test on physical iPhone before TestFlight push

## Testing Plan

- Sim-test after each of the 10 implementation tasks (not batched at the end)
- Full walkthrough on iPhone 17 Pro Max simulator at the end of Task 10
- Airplane-mode second-launch test to verify SW cache
- `prefers-reduced-motion` toggle in iOS settings to verify reduced ring animation
- Keyboard navigation through modals (external keyboard on sim)
- Device install on physical iPhone before any TestFlight push

## Risk Notes

- Largest PR by scope in the project's history. Sim-test-per-task is the mitigation; if any task shows meaningful regression, pause and fix before continuing.
- Coach mark selectors may break if step class names change. If `.sched-step.current` or `.sched-step-done-btn` are renamed, update `GSCoachMarks.SEQUENCES.schedule` in the same commit as the Schedule port.
- Long-press Done is a behavior change for users who have completed onboarding before. The 300ms duration is short enough that muscle-memory tap users will still trigger it; worth watching feedback post-launch.
- Legacy `--chrome-*` tokens stay in `:root` to avoid breaking any third-party CSS or utility classes that might still reference them. Cleanup is a separate future PR.
- The `.design/` reference folder is not needed in production; it ships in this PR for source-of-truth reasons but adds zero runtime weight.
