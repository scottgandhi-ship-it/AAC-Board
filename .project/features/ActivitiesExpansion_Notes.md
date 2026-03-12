# Activities Expansion -- Implementation Notes

## Current Status: IMPLEMENTING

## Feature Checklist

### Feature 1: Smart Word Suggestions
- [x] 1.1: Define ACTIVITY_SUGGESTION_MAP constant
- [x] 1.2: Write matchActivitySuggestions(name) function
- [x] 1.3: Add "Suggested Words" UI section to Create Activity modal
- [x] 1.4: Wire up input event on name field to trigger suggestions
- [x] 1.5: Handle "Add All" and individual add interactions
- [x] 1.6: Prevent duplicate suggestions

### Feature 2: Activity <-> Visual Schedule Integration
- [x] 2.1: Extend step data model with optional activityId
- [x] 2.2: Add "Link Activity" UI to template step editor
- [x] 2.3: Build activity picker for schedule steps (built-in + custom from localStorage)
- [x] 2.4: Show linked activity indicator on step cards (badge + editor indicator)
- [x] 2.5: Add "Talk" button on current step with linked activity
- [x] 2.6: Implement URL-param cross-app navigation (../index.html?activity=id)
- [x] 2.7: Detect activity URL param on main app load, auto-start activity
- [ ] 2.8: Handle activity ended -> return to schedule (deferred -- user navigates manually)

### Feature 3: Activity-Segmented Usage Insights
- [x] 3.1: Extend recordUsageEvent with activityId
- [x] 3.2: Add activity session tracking (start/end timestamps)
- [x] 3.3: Add trimming/retention for activity sessions (90-day)
- [x] 3.4: Build getActivityInsights() aggregation
- [x] 3.5: Add "Activity Insights" section to insights UI
- [x] 3.6: Per-activity top-5 word frequency breakdown
- [x] 3.7: Activity frequency, total words, avg duration stats

### Feature 4: Vocabulary Levels (Starter/Expanded)
- [x] 4.1: Define STARTER_WORDS map for built-in activities (6 core words each)
- [x] 4.2: Add global vocab level setting to Settings
- [x] 4.3: Store/load vocab level from localStorage
- [x] 4.4: Update renderGrid to filter by tier via getActivityWords()
- [x] 4.5: Add level toggle to activity preview (parent-gated)
- [x] 4.6: Add tier marking in Create Activity (first 6 = starter, star indicator)
- [x] 4.7: Custom activities save tier field per word
- [x] 4.8: Show "Starter" badge on activity cards when applicable

### Feature 5: Activity Sequencing (Routines)
- [x] 5.1: Define routine data model + localStorage persistence
- [x] 5.2: Add activeRoutine state and management functions
- [x] 5.3: Build "Create Routine" modal UI (name, icon, activity picker)
- [ ] 5.4: Add drag-sortable activity ordering (deferred -- tap-to-remove works for now)
- [x] 5.5: Render routine cards in Activities tab with sequence preview
- [x] 5.6: Implement startRoutine() and routine-aware endActivity()
- [x] 5.7: Build "Next Activity" transition prompt overlay
- [x] 5.8: Add routine completion toast
- [ ] 5.9: Add routine preview overlay (deferred -- tap starts directly)
- [ ] 5.10: Support editing and deleting routines (deferred)

### Feature 6: Expanded Word Limit + Scroll
- [x] 6.1: Raise word limit from 16 to 32
- [x] 6.2: Update Create Activity validation text
- [x] 6.3: Render all activity words in scrollable grid (matches Talk section UX)
- REVISED: Removed pagination (dots, arrows, swipe) in favor of vertical scroll for consistency with main Talk grid

## Implementation Order
1. Feature 1: Smart Word Suggestions
2. Feature 6: Expanded Word Limit + Pagination
3. Feature 4: Vocabulary Levels
4. Feature 3: Activity-Segmented Insights
5. Feature 5: Activity Sequencing
6. Feature 2: Schedule Integration

## Issues and Resolutions
(none yet)

## Session Log
- 2026-03-11: Planning docs created, awaiting approval
- 2026-03-12: Plan approved. Feature 1 (Smart Word Suggestions) implemented -- keyword map, suggestion engine, UI, "Add All" button, duplicate prevention
- 2026-03-12: Feature 6 (Expanded Word Limit + Pagination) implemented -- 32-word cap, page calculation by grid size, dot indicators, prev/next buttons, swipe navigation, preview page count
- 2026-03-12: Feature 4 (Vocabulary Levels) implemented -- STARTER_WORDS map, global setting, per-activity override, getActivityWords() filter, starter badge on cards
- 2026-03-12: Feature 3 (Activity-Segmented Insights) implemented -- activityId on usage events, session tracking, getActivityInsights(), insights UI with per-activity cards
- 2026-03-12: Feature 5 (Activity Sequencing) implemented -- routine data model, Create Routine modal, routine cards, startRoutine/advanceRoutine, transition prompt, routine-aware endActivity
- 2026-03-12: Feature 2 (Schedule Integration) implemented -- activityId on steps, activity linker in editor, "Talk" button on linked steps, URL-param navigation, auto-start on main app load
