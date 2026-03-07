# 4.3 Guided Setup -- Notes

## Current Status
Phase 1: Planning -- awaiting developer approval

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
Parent Mode Refactor must be completed first. See ParentModeRefactor.md.

## Implementation Checklist

### Phase A: Onboarding Flow
- [ ] A1: Onboarding module scaffold (module object, localStorage key, init integration)
- [ ] A2: Welcome screen HTML/CSS (headline, multimodal sentence, Get Started)
- [ ] A3: Grid picker integration into onboarding flow
- [ ] A4: Coach marks demo (3 callouts on real board, delayed Done button)
- [ ] A5: Interruption handling (resume from current step, stale step validation)

## Issues and Resolutions
(none yet)

## Validation Progress
(pending implementation)
