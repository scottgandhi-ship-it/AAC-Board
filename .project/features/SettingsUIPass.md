# Settings UI Pass

## Executive Summary

Parents and SLPs are missing settings altogether. Two problems:
1. Getting Started section is a long list of 8 accordion items that dominates the settings screen
2. The category tabs (Communication, Accessibility, Customize, Data) are small pill buttons that get lost, especially on mobile

## Requirements

1. **Getting Started** -> Collapse into a single dropdown/collapsible section. User taps to expand, sees the tips inside. Closed by default so it doesn't pollute the screen.
2. **Category tabs** -> Make them unmissable. Turn them into prominent, full-width stacked tabs or a clear tab bar that parents and SLPs will actually notice and use.

## Current State

### Getting Started (lines 2564-2662)
- `#getting-started-section` contains 8 `.guide-item` accordion entries
- Each has a `.guide-title` button and `.guide-content` expandable region
- All visible at once, only content is collapsible -- titles always shown
- Takes ~100 lines of vertical space before the tabs

### Category Tabs (lines 2665-2670)
- `.settings-nav` is a horizontal scrolling flex container
- 4 pill buttons: Communication, Accessibility, Customize, Data & Privacy
- Small (8px 16px padding, 0.85rem font, 36px min-height)
- Styled as outlined pills -- look like filters, not primary navigation
- Easy to scroll past on mobile

## Architecture

### Change 1: Getting Started Dropdown

Wrap the entire Getting Started section in a single collapsible container:
- Show only an "h3 + chevron" row (like the guide items themselves, but as a parent wrapper)
- Clicking it expands/collapses the entire list of 8 tips
- Default state: **collapsed**
- When expanded, the existing accordion behavior inside still works

HTML changes:
- Add a clickable header/toggle to `#getting-started-section`
- Wrap the 8 guide-items in a container div that is hidden by default
- Add `.getting-started-collapsed` / `.getting-started-expanded` CSS states

JS changes:
- Add click handler for the Getting Started toggle
- Persist expanded/collapsed state in localStorage (key: `aac-getting-started-expanded`)

### Change 2: Category Tabs Redesign

Replace the small horizontal pill buttons with a prominent vertical tab list or a segmented control that cannot be missed.

Option A -- **Vertical stacked buttons** (recommended):
- Each tab is a full-width, clearly labeled button
- Active tab has a bold highlight (filled background, not just border)
- List appears directly below Parent Mode section (after Getting Started collapses)
- Only the active category's content shows below

Option B -- **Segmented control bar**:
- A sticky/prominent bar with 4 equal segments
- Larger text, bolder active state
- More compact than Option A but still highly visible

**Recommendation**: Option A (vertical stacked buttons) because:
- Full-width buttons are impossible to miss
- Works great on mobile (no horizontal scrolling)
- Each label has room for a subtitle/description
- Feels like clear navigation, not a filter

CSS changes:
- `.settings-nav` -> vertical flex, gap, no horizontal scroll
- `.settings-category-btn` -> full-width, larger padding, clearer active state
- Active state: filled background with color, not just a border change

## Task Breakdown

### Task 1: Getting Started Collapsible (HTML + CSS + JS)
- Add collapsible wrapper with toggle button
- CSS for expanded/collapsed states
- JS click handler + localStorage persistence
- Default to collapsed

### Task 2: Category Tabs Redesign (CSS primarily)
- Restyle `.settings-nav` to vertical layout
- Restyle `.settings-category-btn` to full-width prominent buttons
- Stronger active state styling
- Ensure mobile-first sizing (large touch targets)

### Task 3: Testing
- Verify on mobile (touch targets, scroll behavior)
- Verify tab switching still works
- Verify Getting Started expand/collapse
- Verify localStorage persistence
- Accessibility: keyboard nav, screen reader announcements

## Accessibility

- Getting Started toggle needs `aria-expanded`
- Tabs must retain `role="tablist"` / `role="tab"` semantics
- Focus management on tab switch
- Touch targets 44px+

## Acceptance Criteria

- [ ] Getting Started section is collapsed by default, expandable with one tap
- [ ] Tips inside Getting Started still have individual accordion behavior
- [ ] Category tabs are full-width, prominent, impossible to miss
- [ ] Active tab has a clear visual distinction
- [ ] All settings still accessible and functional
- [ ] Works on mobile (tested on device)
- [ ] Keyboard and screen reader accessible
