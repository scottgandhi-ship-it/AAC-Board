# Data & Usage Tracking

## Executive Summary

Add a lightweight analytics dashboard (parent-mode only) that tracks which words the child uses, how often they communicate, and trends over time. All data stays on-device (localStorage). Presented as an "Insights" tab visible only in parent mode. Gives parents and SLPs concrete data for IEP meetings and therapy planning without cloud infrastructure.

## Requirements

1. Track button taps with timestamps (word ID, timestamp, was-it-modeled or independent)
2. Word frequency counts -- which words used most, least
3. Communication sessions -- words per session, sessions per day
4. Simple dashboard: top 10 words, daily word count chart (7-day sparkline), total stats
5. All data local (privacy-first, no network)
6. Optional CSV export for SLPs
7. Parent-mode only -- children never see the stats tab
8. Reset/clear data option

## Architecture Overview

### Data Model

**Event log** stored in localStorage as `aac-usage-log`:

    { btnId: string, ts: number, source: "independent"|"modeled" }

- Capped at 10,000 events (rolling window, oldest trimmed on write)
- Batched writes: accumulate in memory, flush every 2 seconds
- Source field: "independent" by default, "modeled" reserved for future Modeling Mode feature

**Aggregated stats** computed on-demand from the event log (no separate store needed at this scale).

### UI Placement

- New "Insights" tab in tab bar -- only visible when parentMode is true
- Tab icon: bar chart SVG
- View panel: `view-insights` with same structure as other views
- When parent mode locks, tab hides and switches to Talk if active

### Dashboard Sections

**1. Summary Cards (top row)**
- Total words spoken (all time)
- Words today
- Streak: consecutive days with at least 1 word

**2. Top Words (main section)**
- Top 10 most-used words as a horizontal bar chart
- Each bar shows word label, count, and Fitzgerald Key color
- Tapping a bar does nothing (read-only)

**3. 7-Day Activity (sparkline)**
- Simple bar chart showing word count per day for last 7 days
- Day labels (Mon, Tue, etc.)
- Today's bar highlighted

**4. Export & Reset (bottom)**
- "Export CSV" button -- downloads usage log as CSV file
- "Clear usage data" button -- confirmation dialog, then wipe

### What NOT to Build (Keep It Simple)

- No cloud sync, no accounts, no server
- No real-time charts or animation (static render on tab switch)
- No separate IndexedDB store (localStorage is fine for 10K events at ~40 bytes each = ~400KB)
- No modeling vs independent distinction yet (field exists but all events are "independent" until Modeling Mode ships)
- No hourly breakdowns, no word categories chart, no comparison periods

## Task Breakdown

### Phase 2A: Data Collection Layer

**Task 2A.1: Usage event recording**
- Create `usageLog` array in memory, loaded from localStorage on init
- `recordUsageEvent(btnId, source)` function
- Called from: grid cell click handler, core strip click handler, prediction chip click handler
- Debounced save to localStorage every 2 seconds (same pattern as bigrams)
- Cap at 10,000 events; trim oldest when exceeded
- Dependencies: None
- Acceptance: Tapping buttons stores events; page reload preserves them

**Task 2A.2: Aggregation helpers**
- `getWordFrequencies()` -> Map of btnId to count, sorted descending
- `getDailyWordCounts(days)` -> Array of { date, count } for last N days
- `getTodayCount()` -> number
- `getStreak()` -> number of consecutive days with usage
- `getTotalCount()` -> number
- Dependencies: Task 2A.1
- Acceptance: Correct counts verified against manual tap sequences

### Phase 2B: Insights Tab UI

**Task 2B.1: Tab bar and view scaffold**
- Add tab button `tab-insights` to tab bar HTML (bar chart SVG icon)
- Add `view-insights` div with tabpanel role
- Add to TAB_VIEW_MAP
- Tab hidden by default; shown/hidden in setParentMode()
- If insights tab is active when parent mode locks, switch to Talk
- Dependencies: None
- Acceptance: Tab appears in parent mode, hides when locked

**Task 2B.2: Summary cards**
- Three cards in a flex row: Total Words, Words Today, Day Streak
- Large number + label below
- Styled consistently with existing reward cards
- Rendered on tab switch (not live-updating)
- Dependencies: Task 2A.2
- Acceptance: Numbers update correctly after tapping words and switching to Insights

**Task 2B.3: Top 10 words chart**
- Section with heading "Most Used Words"
- Horizontal bars: colored by Fitzgerald Key, width proportional to max count
- Each bar shows: icon + label on left, count on right
- Cap at top 10
- Empty state: "No usage data yet. Start talking!"
- Dependencies: Task 2A.2
- Acceptance: Bars render in correct order, colors match word types

**Task 2B.4: 7-day activity chart**
- Section with heading "This Week"
- 7 vertical bars (Mon-Sun), height proportional to max day
- Today's bar uses accent color, others use gray
- Day labels below bars
- Zero days show as tiny 2px bar (not invisible)
- Dependencies: Task 2A.2
- Acceptance: Correct day mapping, today highlighted

**Task 2B.5: Export and reset**
- "Export as CSV" button -> generates and downloads file
- CSV columns: word, button_id, timestamp (ISO), source
- "Clear all usage data" button -> confirm -> wipe log
- Both in a settings-section style container at bottom
- Dependencies: Task 2A.1
- Acceptance: CSV downloads with correct data; clear empties dashboard

### Phase 2C: Integration

**Task 2C.1: Hook recording into tap handlers**
- Grid cell click: recordUsageEvent(btn.id, 'independent')
- Core strip click: recordUsageEvent(btn.id, 'independent')
- Prediction chip click: recordUsageEvent(pred.id, 'independent')
- Do NOT record in parent mode (editing, not communicating)
- Dependencies: Task 2A.1
- Acceptance: All three tap paths produce events; parent mode taps do not

**Task 2C.2: Dashboard refresh on tab switch**
- When switching to insights tab, call renderInsights()
- Rebuild all sections fresh (no caching needed at this scale)
- Dependencies: Phase 2B complete
- Acceptance: Dashboard reflects latest data after each tab switch

### Phase 2D: Polish

**Task 2D.1: CSS styling**
- Summary cards: rounded corners, subtle shadow, large centered number
- Bar chart: CSS-only (div widths), no canvas or SVG chart library
- Responsive: cards stack on very narrow screens
- Tab icon matches existing tab style
- Dependencies: Phase 2B complete
- Acceptance: Visually consistent with rest of app

**Task 2D.2: Reset integration**
- "Reset all to defaults" in settings should also clear usage log
- Dependencies: Task 2B.5
- Acceptance: Full reset clears everything including usage data

## Integration Points

- **Tab bar HTML**: New tab button
- **TAB_VIEW_MAP**: New entry
- **setParentMode()**: Show/hide insights tab
- **Grid cell click handler**: Record event
- **Core strip click handler**: Record event
- **Prediction chip click handler**: Record event
- **init()**: Load usage log from localStorage
- **Reset all to defaults**: Clear usage log

## Accessibility Considerations

- Bar chart bars need aria-label with word name and count
- Summary cards use semantic heading structure
- Export button has clear label
- Tab follows existing ARIA tab pattern (role="tab", aria-controls, aria-selected)
- All touch targets 44x44px minimum

## Mobile Considerations

- Summary cards: 3-column on wide, stack vertically on narrow (< 360px)
- Bar chart scrollable if needed (unlikely with 10 items)
- 7-day chart fits in viewport width (7 bars + gaps)
- Export triggers native file download dialog

## Acceptance Criteria

1. Tapping any word button records a timestamped event
2. Parent mode taps are NOT recorded
3. Insights tab visible only in parent mode
4. Summary cards show correct totals
5. Top 10 chart shows most-used words with Fitzgerald Key colors
6. 7-day chart shows daily activity with today highlighted
7. CSV export downloads correct data
8. Clear data wipes everything and dashboard shows empty state
9. Data persists across page reloads
10. 10,000 event cap prevents unbounded storage growth
11. "Reset all to defaults" also clears usage data
