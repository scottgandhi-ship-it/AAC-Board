# 4.3 Guided Setup -- Notes

## Current Status
Phase 2: Implementing -- all tasks complete, ready for testing

## Agent Review Summary
- Pat: Simplified demo to static coach marks, phased scope down, approved v2
- Reggie: Target 30s not 60s, delayed Done button, "change anytime" reassurance, approved v2
- Robert: Defensive rendering, module-object pattern, consolidated localStorage, protect speak(), approved v2
- Marci: Multimodal communication sentence on welcome screen, "give them a voice" copy, clinical sign-off

## Scope Decisions
- REMOVED: AAC Guide (all topics) -- overkill for v1
- REMOVED: Contextual tips engine (day-based tips) -- overkill for v1
- REMOVED: Common Mistakes to Avoid section
- REMOVED: Lock-press toast (replaced by always-visible settings via Parent Mode Refactor)
- SIMPLIFIED: Animated demo replaced with static coach marks
- ADDED: Mid-onboarding interruption handling
- ADDED: Child-grab escape hatch (tap outside dismisses)
- ADDED: "You can change this anytime" under grid picker
- ADDED: "Done" button delayed until parent taps a word

## Prerequisite
Parent Mode Refactor -- DONE

## Implementation Checklist

### Phase A: Onboarding Flow
- [x] A1: Onboarding module scaffold (module object, localStorage key, init integration)
- [x] A2: Welcome screen HTML/CSS (headline, multimodal sentence, Get Started)
- [x] A3: Grid picker integration into onboarding flow
- [x] A4: Coach marks demo (3 callouts on real board, delayed Done button)
- [x] A5: Interruption handling (resume from current step, stale step validation)

## Architecture Notes
- Onboarding module (const Onboarding = {}) with init/showStep/showCoachMarks/complete/dismiss
- Consolidated localStorage key: aac-onboarding (version, complete, currentStep, date)
- Grid picker reused for step 2 with onboarding-mode extras (reassurance text, dots)
- finalizeInit() extracted from init() so grid picker path also runs full setup
- showGridPicker accepts onComplete callback, stores via _gridPickerCallback
- Defensive rendering: grid renders first, onboarding overlays on top
- Coach marks use pointer-events:none overlay with pass-through taps to real board
- Child-grab escape: tap outside overlay content dismisses and completes onboarding

## Issues and Resolutions
- Grid picker had duplicate heading with onboarding step 2 -- resolved by hiding onboarding overlay during step 2 and adding reassurance/dots directly to grid picker overlay
- showGridPicker once-bound handlers did not re-register callback on resume -- resolved by storing callback in _gridPickerCallback variable

## Validation Progress
(pending testing)
