# Redesign PR-1: Tokens + Onboarding -- Notes

## Status
Phase 1 -- Plan drafted, awaiting developer approval

## Branch
`feature/redesign-pr1-tokens-onboarding` (off `develop`)

## Implementation Checklist

### Phase 1: Planning
- [x] Read all Claude Design source files
- [x] Feature audit of current app
- [x] Conflict resolution with developer (long-press Done -> PR-2, timer -> drop)
- [x] Plan document written
- [ ] Plan approved by developer

### Phase 2: Implementation
- [ ] Task 1: Font hosting (WOFF2 files, @font-face, SW cache update)
- [ ] Task 2: Design tokens (:root block with --gs-* vars)
- [ ] Task 3: Onboarding shell (structure + scoped CSS)
- [ ] Task 4: Slide content (motifs + copy)
- [ ] Task 5: Logic preservation (event bindings, completion flag)
- [ ] Task 6: Sync and deploy (npm run sync, sim install)

### Phase 3: Validation
- [ ] Fresh-install walkthrough on iPhone 17 Pro Max sim
- [ ] Offline font loading verified
- [ ] Reduced motion toggle verified
- [ ] Lighthouse accessibility 90+
- [ ] No regression on existing tabs (visual diff)
- [ ] Open PR from feature branch to develop
- [ ] Run /review on the PR
- [ ] Address review findings
- [ ] Merge to develop

## Open Questions
(resolved 2026-04-19: Google Fonts download, Latin-only subset)

## Issues / Deviations
(none yet)
