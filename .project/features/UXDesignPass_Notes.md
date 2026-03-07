# UX Design Pass - Implementation Notes

## Current Status
IMPLEMENTING -- Subphases A and B complete, awaiting device testing

## Implementation Checklist

### Subphase A: Touch Target Fixes (P0)
- [x] A.1: Message bar buttons 44px minimum on all breakpoints (was 40px on <360px)
- [x] A.2: Track tabs min-height 36px -> 44px, added padding and flex centering
- [x] A.3: Edit modal image buttons -> 2x2 grid layout, min-height 44px
- [x] A.4: Template step reorder buttons 32px -> 40px
- [x] A.5: Settings checkboxes -> 24px with accent-color, label rows min-height 44px

### Subphase B: High Impact Visual (P1)
- [x] B.1: Grid cell image sizing (width: 70%, max-height: 60%, min-height: 24px, aspect-ratio: 1)
- [x] B.2: Reward card locked state (grayscale 0.7->0.4, opacity 0.5->0.7, label #999->#666)
- [x] B.3: Landscape orientation support (new @media block for max-height: 500px landscape)
- [x] B.4: Color picker -> visual swatches (6 Fitzgerald Key circles, selected ring, labels)
- [x] B.5: Prediction strip edge fade (CSS mask-image gradient, right 15% fades)
- [x] B.6: Done schedule step opacity 0.45 -> 0.6 with green tint (#F1F8E9)

### Subphase C: Tablet and Polish (P2)
- [ ] C.1: Tablet layout improvements (wider grids, larger modals, better spacing) -- DEFERRED
- [x] C.2: Folder/word cell visual consistency (matched 3px border, same shadow/active as word cells)
- [x] C.3: Core strip visual weight (purple-tinted background, inner shadow, border tint)
- [x] C.4: Folder label visibility (1.15rem, #333, purple underline bar, fit-content width)
- [x] C.5: Top words label width (90px -> 110px, 130px on tablets)
- [x] C.6: Weekly chart today bar -> var(--bar-bg) brand purple
- [x] C.7: Border radius normalization (16px -> --radius-lg, 12px -> --radius-md)
- [x] C.8: 6x6 label minimum font size (0.55rem -> 0.6rem)
- [x] C.9: Core strip min-width 56px + overflow-x auto with hidden scrollbar

### Subphase D: Nice to Have (P3)
- [ ] D.1: Loading skeleton for symbol download
- [ ] D.2: Empty schedule state illustration
- [ ] D.3: Collapsible settings sections
- [ ] D.4: Insights cards tablet max-width
- [ ] D.5: Weekly chart empty day bar height
- [ ] D.6: Default focus-visible indicators
- [ ] D.7: Message word overflow fade hint
- [ ] D.8: Current step "NOW" badge
- [ ] D.9: Step image sizing on tablets

## Issues and Resolutions
(none yet)

## Validation Progress
- [ ] Verify all interactive elements >= 44px on all breakpoints
- [ ] Test landscape mode on phone
- [ ] Test color swatch picker in edit modal (including core word disabled state)
- [ ] Verify prediction strip fade effect
- [ ] Verify reward card locked state is recognizable
- [ ] Verify schedule done steps look "completed" not "broken"
- [ ] Test on mobile device
