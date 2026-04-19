# Redesign PR-1: Design Tokens + Onboarding

## Executive Summary

First of five PRs porting the Claude Design "Storybook Canvas" direction into Guiding Steps. This PR lands the design system foundation (color tokens, fonts, shadow, radii) and re-skins the Onboarding flow. The source is `.design/lib/direction-c.jsx` and `.design/lib/c-onboarding.jsx`; the canvas is the spec.

Subsequent PRs (visuals-only, features already ship): PR-2 Schedule + modals, PR-3 Steps + modals, PR-4 Stories + Reader + editors, PR-5 Settings.

## Requirements

- Add a single set of Guiding Steps design tokens (CSS custom properties) layered on top of, not replacing, the existing `--chrome-*` vars. New work consumes the new tokens; existing screens stay on the old vars until their PR lands.
- Self-host Fraunces (display) and Inter (body) as WOFF2 in the repo so the app stays offline-first (PWA rule).
- Re-skin the Onboarding overlay to match the three Claude Design slides: Welcome, Child name, Three tools. Content, dots indicator, primary/skip buttons, and motif illustrations all match the spec.
- Preserve existing Onboarding behavior: child name input, skip handling, completion flag in localStorage, exit to Schedule tab.
- No changes to Schedule, Steps, Stories, or Settings tabs in this PR.

## Out of scope (this PR)

- Schedule tab visual redesign (PR-2)
- Steps tab visual redesign (PR-3)
- Stories/Reader/editor visual redesign (PR-4)
- Settings visual redesign (PR-5)
- Long-press Done interaction — added in PR-2 per Scott 2026-04-19 decision
- Countdown timer toggle in Steps — dropped entirely per Scott 2026-04-19 decision

## Architecture

### Design tokens

All new tokens go into the existing `<style>` block in `index.html` under a new `:root` rule. Naming prefix: `--gs-*` to distinguish from legacy `--chrome-*`. Both coexist during the 5-PR rollout.

Color tokens (from `direction-c.jsx` `C`):

- `--gs-bg: #FBF6EC` (warm ivory canvas)
- `--gs-bg-alt: #F0E8D6`
- `--gs-card: #FFFFFF`
- `--gs-ink: #1B1D2E`
- `--gs-ink-soft: #4A4D63`
- `--gs-ink-muted: #8F8FA3`
- `--gs-accent: #4F46B8` (single indigo accent)
- `--gs-accent-soft: #E2DFF6`
- `--gs-accent-deep: #2E2782`
- `--gs-warn: #C5553A` (delete-only)
- `--gs-hair: rgba(27, 29, 46, 0.1)`
- `--gs-hair-soft: rgba(27, 29, 46, 0.05)`
- `--gs-shadow: 0 1px 2px rgba(27,29,46,0.04), 0 8px 24px rgba(27,29,46,0.06)`

Type tokens:

- `--gs-font-display: "Fraunces", Georgia, serif`
- `--gs-font-body: "Inter", -apple-system, system-ui, sans-serif`

Radius tokens (from canvas usage):

- `--gs-radius-sm: 10px`
- `--gs-radius-md: 12px`
- `--gs-radius-lg: 14px`
- `--gs-radius-xl: 18px`
- `--gs-radius-modal: 22px`
- `--gs-radius-pill: 99px`

Icon palette tokens (used by existing SVG icon library when mapped to the new look):

- `--gs-icon-warm: #E07B3E`
- `--gs-icon-warm-pale: #F7D9BF`
- `--gs-icon-cool: #4F46B8`
- `--gs-icon-cool-pale: #E2DFF6`
- `--gs-icon-neutral: #E6DEC9`
- `--gs-icon-neutral-deep: #A69A7B`

### Fonts

- Add `/guiding-steps/fonts/` directory.
- Ship only the weights PR-1 uses: **Fraunces 400, Inter 500, Inter 600** (3 files). Inter 400 and Inter 700 are deferred to the PR that first needs them.
- Source: Google Fonts download, Latin-only subset to minimize PWA payload.
- **Payload ceiling: 250 KB total for all font files in PR-1.** If exceeded, cut Inter 500 first (can fall back to 600 for now).
- **Licensing:** both fonts are SIL Open Font License (OFL). Commit `fonts/OFL.txt` alongside the WOFF2 files with the full license text. Plan includes no modification or redistribution beyond what OFL permits.
- Declare with `@font-face` using `font-display: swap` so text renders immediately on old cache.
- **Preload the two most-visible weights** (Fraunces 400 and Inter 600) with `<link rel="preload" as="font" type="font/woff2" crossorigin>` in `<head>` to avoid iOS WKWebView flash of fallback serif on first launch.
- Download via fetch is NOT used; files land in the repo and are served by the service worker cache.
- Service worker cache list updated to include the new font paths. **Cache version bumps `guiding-steps-v15` -> `guiding-steps-v16`.**
- **Caching strategy:** keep network-first for HTML and top-level assets; fonts are immutable so serve cache-first for `/fonts/*.woff2` (they will never change without a filename change, safe to cache-first).

### Onboarding markup changes

Existing onboarding overlay ID: `#gs-onboarding-overlay`. Its inner structure is swapped to three slides matching `c-onboarding.jsx`. Slide classes: `.gs-onb-slide`, `.gs-onb-slide.active`.

Slide 1 - Welcome:
- Motif: rising sun with face and rays (inline SVG, direct port of `OnbMotif1` in c-onboarding.jsx)
- Headline: "Every day is a little easier when your child knows what's next." (Fraunces 32)
- Body: "Guiding Steps helps your child follow routines, earn rewards, and understand social situations." (Inter 15)
- Primary button: "Get started"
- Secondary text button: "Skip"
- Dots indicator: 1 of 3

Slide 2 - Child name:
- Motif: friendly child character (inline SVG, port of `OnbMotif2`)
- Headline: "Who are we helping today?" (Fraunces 30)
- Body: "We'll use their name to make stories and schedules feel personal."
- Section label: "CHILD'S NAME"
- Input: existing child-name input, re-skinned with indigo focus border
- Primary button: "Next" (disabled until name entered; existing validation kept)
- Secondary text button: "Skip for now"
- Dots indicator: 2 of 3

Slide 3 - Three tools:
- Headline: "Three tools, one app." (Fraunces 30)
- Body: "Use them together or on their own."
- Three rows: Schedules / Steps / Stories with icons in indigo-soft tiles and descriptive sub-copy
- Primary button: "Let's go" (completes onboarding, marks flag in localStorage, closes overlay)
- Dots indicator: 3 of 3

Slide transitions: existing slide-advance logic kept. Dots animate width (22 px active, 7 px inactive).

### Icon mapping for slide 3

Maps to existing SVG tab icons if a close match exists. If the existing tab icons render well at 32 px inside a 48 px soft-indigo tile, reuse them. Otherwise, add a lightweight flat port of the spec icons (TabIcons.schedule / steps / stories in `shared.jsx`).

### Compatibility

- Old `--chrome-*` tokens left in place so Schedule / Steps / Stories / Settings keep rendering untouched.
- `body` font-family is NOT switched globally in PR-1. Onboarding explicitly opts in via scoped rules on `#gs-onboarding-overlay *`. PR-2 onward flips each tab scope.
- No visual change to the tab bar in this PR.

## Task Breakdown

### Task 1: Font hosting
- Create `guiding-steps/fonts/` directory
- Add Fraunces-Regular.woff2 and Inter-Regular/Medium/SemiBold/Bold.woff2
- Add `@font-face` declarations in `index.html` `<style>` block
- Add font file paths to service worker cache list
- Bump `sw.js` cache version

### Task 2: Design tokens
- Add new `:root` block with all `--gs-*` tokens above
- Keep `--chrome-*` untouched
- Document in an inline CSS comment that this is the new token set used by redesign screens

### Task 3: Onboarding shell
- Restructure `#gs-onboarding-overlay` inner HTML to the three-slide model
- New CSS scoped to `#gs-onboarding-overlay` consuming `--gs-*` tokens
- Dots indicator component shared across slides

### Task 4: Slide content
- Inline SVG for sun motif (slide 1) and child-character motif (slide 2)
- Slide 3 three-tool rows with icons + copy
- All copy matches spec exactly

### Task 5: Logic preservation
- Keep existing onboarding JS (child name persistence, skip handling, completion flag, slide advance)
- Re-bind any event listeners to new element IDs
- Verify the "skip for now" path still writes the completion flag so onboarding doesn't re-appear

### Task 6: Sync and deploy
- Run `npm run sync` to copy HTML into `www/` and mirror into iOS native
- Install on iPhone 17 Pro Max simulator for validation (per test-before-deploy rule)

## Integration Points

- Service worker cache: new font files added to CACHE_FILES list; cache version bumped so old clients refresh
- localStorage: existing `gs-onboarding-complete` flag kept
- IndexedDB: no changes
- Capacitor: no native config changes

## Accessibility

- All three slide primary buttons >= 44x44 px
- **Dots indicator semantics:** do NOT use tablist/tab roles (dots are not focusable tabs). Use `role="progressbar"` on the container with `aria-valuenow="{currentSlide}"`, `aria-valuemin="1"`, `aria-valuemax="3"`, and a visually-hidden `<span>` reading "Step 2 of 3" that updates with the slide.
- Headline contrast ratio: #1B1D2E on #FBF6EC = 14.4:1 (passes AA for all text sizes)
- Body contrast ratio: #4A4D63 on #FBF6EC = 7.1:1 (passes AA)
- Motif SVGs marked `aria-hidden="true"`; slide container has `aria-labelledby` pointing at the headline
- Input field has associated `<label>` "Child's name"; focus ring is visible and uses `--gs-accent`
- prefers-reduced-motion honored: slide transition becomes instant, dot width animation removed

### Focus management (modal overlay behavior)

- **On open:** focus moves to the slide headline (`tabindex="-1"` on the `<h1>` so it can receive programmatic focus)
- **Focus trap:** Tab and Shift+Tab cycle only within `#gs-onboarding-overlay`; first element wraps to last and vice versa
- **Escape key:** triggers the Skip action on slides 1 and 2 (same as "Skip" button); on slide 3 triggers "Let's go" (onboarding complete)
- **On close:** focus returns to the element that originally triggered onboarding (or `document.body` if first-launch)
- All interactive elements inside the overlay have visible focus indicators using `outline: 2px solid var(--gs-accent); outline-offset: 2px;`

## Acceptance Criteria

- [ ] Fresh install on iPhone 17 Pro Max sim shows slide 1 with correct colors, Fraunces headline, and sun motif
- [ ] Slide 2 motif renders correctly; child name input persists typing
- [ ] Slide 3 Three tools rows render with correct icons and indigo tiles
- [ ] Completing onboarding (Let's go) lands on Schedule tab and does not re-trigger on restart
- [ ] Skipping from slide 1 or 2 completes onboarding (flag written)
- [ ] App runs offline immediately after first load; fonts load from service worker cache on second launch
- [ ] **Non-regression proof:** full-screen screenshots of Schedule, Steps, Stories, Settings captured on iPhone 17 Pro Max sim BEFORE the PR branch, and again AFTER implementation; zero pixel delta on root layout (minor anti-aliasing acceptable, structural changes not). Screenshots attached to PR description.
- [ ] Lighthouse accessibility score 90+ on Onboarding screens
- [ ] Touch targets on primary buttons >= 44x44 px on device

## Testing Plan

- Device install on iPhone 17 Pro Max simulator: clean install (uninstall first), walk the three slides
- Airplane mode test: reload app after first load, confirm fonts still render
- prefers-reduced-motion: toggle in iOS Simulator Settings, verify no slide animation
- Keyboard-only nav through the overlay (external keyboard on sim)
- Ensure onboarding does not re-appear after completion (localStorage persistence check)

## Risk Notes

- Font bundle (Fraunces 400 + Inter 500 + Inter 600, Latin-only WOFF2) budgeted at 250 KB max. Measure at end of Task 1; if over, drop Inter 500 and fall back to 600.
- **iOS WKWebView flash of unstyled text:** Capacitor runs inside WKWebView, which can show Georgia fallback for 100-300 ms on first launch even with local fonts. Mitigation: `<link rel="preload" as="font">` for the two most-visible weights. Residual flash after mitigation is accepted as a one-time first-launch cost.
- If the service worker cache bump races with font availability, there may be one-load flash of unstyled serif fallback (Georgia). `font-display: swap` limits the impact.
- Inline SVG motifs are ~80-120 lines each. Keeping them inline (not external files) matches the single-file PWA architecture rule.
- Screenshot-diff non-regression check is manual (no automated visual regression tooling in repo yet). Acceptable for a single-developer velocity; revisit if PR-2..5 find drift.
