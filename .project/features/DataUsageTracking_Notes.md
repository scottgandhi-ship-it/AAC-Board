# Data & Usage Tracking - Implementation Notes

## Current Status
IMPLEMENTED -- awaiting device testing

## Implementation Checklist

### Phase 2A: Data Collection Layer
- [x] Task 2A.1: Usage event recording (recordUsageEvent, localStorage, hybrid 90-day + 15K cap)
- [x] Task 2A.2: Aggregation helpers (frequencies, daily counts, streak, totals, pre-computed summary)

### Phase 2B: Insights Tab UI
- [x] Task 2B.1: Tab bar and view scaffold (tab-insights, view-insights, parent-mode gating)
- [x] Task 2B.2: Summary cards (total words, words today, streak)
- [x] Task 2B.3: Top 10 words horizontal bar chart with Fitzgerald Key colors
- [x] Task 2B.4: 7-day activity vertical bar chart with today highlighted
- [x] Task 2B.5: Export CSV and clear data buttons

### Phase 2C: Integration
- [x] Task 2C.1: Hook recording into all tap handlers (grid, core strip, predictions, search)
- [x] Task 2C.2: Dashboard refresh on tab switch

### Phase 2D: Polish
- [x] Task 2D.1: CSS styling (cards, charts, responsive)
- [x] Task 2D.2: Reset integration (clear usage on full reset)

## Review Feedback Addressed
- Steve: Fixed applyGrammar null crash (split into two checks)
- Steve: Removed dead FIRST_SECOND_PRONOUNS constant
- Steve: parentMode guard inside recordUsageEvent itself
- Steve: CSV exports human-readable word labels
- Robert: Hybrid 90-day + 15K cap instead of flat 10K
- Robert: Pre-computed summary updated incrementally (O(1) per tap)
- Robert: Schema version field v:1 on events

## Issues and Resolutions
(none yet)

## Validation Progress
(not started)
