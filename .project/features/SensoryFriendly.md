# Sensory-Friendly Options

## Executive Summary

Add a sensory preferences system that lets caregivers reduce visual stimulation, increase contrast, and control audio feedback. All preferences accessible from parent mode settings, persisted in localStorage, and respecting OS-level accessibility settings as defaults.

## Requirements

1. Reduced animations toggle -- minimize or eliminate motion (scale, slide, confetti, glow pulses)
2. High contrast mode -- stronger borders, bolder text, higher color saturation for readability
3. Quieter UI option -- mute celebration sounds (playDing, playTaDa), reduce or remove confetti
4. Settings panel for sensory preferences in parent mode
5. Persist preferences across sessions (localStorage)
6. Respect OS-level prefers-reduced-motion and prefers-contrast as defaults

## Architecture Overview

### Design Principles

- **Non-destructive**: Sensory settings layer on top via CSS classes on body element
- **OS-aware**: Read prefers-reduced-motion and prefers-contrast media queries as initial defaults
- **Three toggles**: Reduced Motion, High Contrast, Quiet Mode -- each independent
- **Body class approach**: Toggle classes on document.body (e.g., `sensory-reduced-motion`, `sensory-high-contrast`, `sensory-quiet`) and use CSS to override animations/styles
- **Single-file**: All CSS overrides inline in existing style block

### Current State

The app already has:
- Partial prefers-reduced-motion support (lines 1556-1562) covering reward/celebration animations
- 8 CSS @keyframes animations
- 15+ CSS transition rules
- 2 audio functions (playDing, playTaDa) via Web Audio API
- Confetti spawner (30 pieces per celebration)
- Glow/pulse infinite animations on reward cards and task tiles

### What Needs to Change

**Reduced Motion** (body.sensory-reduced-motion):
- Disable ALL @keyframes animations (popIn, slideDown, tileGlow, tilePop, rewardCardGlow, rewardPulse, celebrationPop, confettiFall)
- Reduce transitions to instant (0s duration) or very short (0.05s max)
- Remove scale transforms on :active states (keep color feedback only)
- Hide confetti pieces entirely
- Replace slide/pop entrances with simple opacity fades or instant appearance

**High Contrast** (body.sensory-high-contrast):
- Increase border widths on grid cells (1px -> 2px solid)
- Darken text colors (#555 -> #111, #888 -> #444)
- Add visible borders to all buttons and interactive elements
- Increase focus indicator visibility (3px solid outline)
- Boost Fitzgerald Key colors to higher saturation versions
- White background on cells (remove subtle gradients/shadows)
- Stronger active/selected state indicators

**Quiet Mode** (body.sensory-quiet):
- Mute playDing() and playTaDa() sounds
- Reduce celebration overlay duration (3500ms -> 2000ms)
- Reduce confetti count (30 -> 0)
- Toast notifications still appear (visual feedback preserved)
- Speech synthesis unaffected (that's the core function)

## Task Breakdown

### Phase 2A: CSS Override Classes

**Task 2A.1: Reduced motion CSS overrides**
- Add body.sensory-reduced-motion selector block
- Override all @keyframes to animation: none
- Override all transitions to transition: none or 0.05s
- Override :active transforms to background-color change only
- Hide .confetti-piece elements
- Replace celebration pop with instant display
- Dependencies: None
- Acceptance: With class applied, zero motion on screen except speech output

**Task 2A.2: High contrast CSS overrides**
- Add body.sensory-high-contrast selector block
- Increase cell borders: 2px solid rgba(0,0,0,0.3)
- Darken all text by overriding color variables
- Boost Fitzgerald Key color variables to high-saturation versions:
  - --color-yellow: #F9A825 (deeper gold)
  - --color-green: #2E7D32 (darker green)
  - --color-red: #C62828 (deeper red)
  - --color-blue: #1565C0 (darker blue)
  - --color-pink: #AD1457 (deeper pink)
  - --color-orange: #E65100 (deeper orange)
- Add 3px solid focus outlines on all focusable elements
- White cell backgrounds, remove box-shadows for cleaner look
- Bold labels on grid cells
- Dependencies: None
- Acceptance: All text passes WCAG AAA (7:1 contrast ratio), buttons clearly delineated

**Task 2A.3: Quiet mode JS guards**
- Add check in playDing(): if body has sensory-quiet class, return early
- Add check in playTaDa(): if body has sensory-quiet class, return early
- Add check in spawnConfetti(): if body has sensory-quiet class, skip confetti
- Reduce celebration duration when quiet: 3500ms -> 2000ms
- Dependencies: None
- Acceptance: No sounds play, no confetti spawns, celebration still shows briefly

### Phase 2B: Settings UI

**Task 2B.1: Add sensory settings section to settings panel**
- New settings-section in settings panel HTML with heading "Sensory Preferences"
- Three toggle switches (styled checkboxes):
  - "Reduce motion" -- minimize animations and movement
  - "High contrast" -- bolder colors and borders
  - "Quiet mode" -- mute sounds and effects
- Helper text under each toggle explaining what it does
- Dependencies: Phase 2A complete
- Acceptance: Three toggles visible in parent mode settings

**Task 2B.2: Wire up toggle persistence and body class management**
- On toggle change: add/remove body class, save to localStorage
- Keys: aac-sensory-reduced-motion, aac-sensory-high-contrast, aac-sensory-quiet
- On app init: read localStorage values, apply body classes
- On app init: if no stored preference, check OS media queries as defaults:
  - prefers-reduced-motion: reduce -> auto-enable reduced motion
  - prefers-contrast: more -> auto-enable high contrast
- Dependencies: Task 2B.1
- Acceptance: Settings persist across sessions, OS defaults respected on first launch

### Phase 2C: Polish

**Task 2C.1: Verify all animations covered**
- Audit every animation and transition in the app with reduced motion enabled
- Verify confetti, celebration, glow pulses, prediction pop-in, toast slide all suppressed
- Verify tap feedback still provides some visual indication (background color change)
- Dependencies: Phase 2B complete
- Acceptance: Zero unexpected motion with reduced-motion enabled

**Task 2C.2: Test high contrast with all Fitzgerald Key colors**
- Verify each color category is readable in high contrast mode
- Test cell text legibility on boosted color backgrounds
- Verify focus indicators visible on all interactive elements
- Dependencies: Phase 2B complete
- Acceptance: All color categories pass WCAG AA minimum, core words clearly readable

## Integration Points

- **body element**: Receives sensory class toggles
- **playDing() / playTaDa()**: Guard checks added at function entry
- **spawnConfetti()**: Guard check added at function entry
- **triggerCelebration()**: Duration reduced in quiet mode
- **Settings panel HTML**: New section with three toggles
- **init()**: Apply saved sensory preferences on startup
- **Existing prefers-reduced-motion CSS** (lines 1556-1562): Superseded by the new comprehensive override block

## Accessibility Considerations

- Toggle switches must be keyboard accessible (native checkboxes)
- Toggle labels must be associated with inputs
- Settings section heading for screen reader navigation
- High contrast mode must not break any existing ARIA labels or roles
- Reduced motion must preserve essential state feedback (selected, active, disabled)

## Mobile Considerations

- Toggles must have 44x44px touch targets
- Settings panel already scrollable on mobile -- no layout changes needed
- High contrast mode tested on both light and dark ambient conditions

## Acceptance Criteria

1. Three independent toggles in parent mode settings
2. Reduced motion eliminates all animation and transform motion
3. High contrast boosts all colors and borders for readability
4. Quiet mode mutes all sounds and confetti
5. Speech synthesis (core function) unaffected by any sensory setting
6. OS-level preferences auto-detected on first launch
7. Settings persist across sessions via localStorage
8. All grid buttons still clearly show Fitzgerald Key color coding in both modes
9. WCAG AA contrast ratios maintained (AAA in high contrast mode)
