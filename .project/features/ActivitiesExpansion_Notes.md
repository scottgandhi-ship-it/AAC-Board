# Activities Expansion -- Implementation Notes

## Current Status: PLANNING -- awaiting approval

## Feature Checklist

### Feature 1: Smart Word Suggestions
- [ ] 1.1: Define ACTIVITY_SUGGESTION_MAP constant
- [ ] 1.2: Write matchActivitySuggestions(name) function
- [ ] 1.3: Add "Suggested Words" UI section to Create Activity modal
- [ ] 1.4: Wire up input event on name field to trigger suggestions
- [ ] 1.5: Handle "Add All" and individual add interactions
- [ ] 1.6: Prevent duplicate suggestions

### Feature 2: Activity <-> Visual Schedule Integration
- [ ] 2.1: Extend step data model with optional activityId
- [ ] 2.2: Add "Link Activity" UI to template step editor
- [ ] 2.3: Build activity picker for schedule steps
- [ ] 2.4: Show linked activity indicator on step cards
- [ ] 2.5: Add "Start Activity" button on current step
- [ ] 2.6: Implement URL-param cross-app navigation
- [ ] 2.7: Detect activity URL param on main app load
- [ ] 2.8: Handle activity ended -> return to schedule

### Feature 3: Activity-Segmented Usage Insights
- [ ] 3.1: Extend recordUsageEvent with activityId
- [ ] 3.2: Add activity session tracking (start/end)
- [ ] 3.3: Add trimming/retention for activity sessions
- [ ] 3.4: Build getActivityInsights() aggregation
- [ ] 3.5: Add "Activity Insights" section to insights UI
- [ ] 3.6: Per-activity word frequency breakdown
- [ ] 3.7: Activity frequency and duration stats

### Feature 4: Vocabulary Levels (Starter/Expanded)
- [ ] 4.1: Add tier field to ACTIVITY_BUNDLES words
- [ ] 4.2: Add global vocab level setting to Settings
- [ ] 4.3: Store/load vocab level from localStorage
- [ ] 4.4: Update renderGrid to filter by tier
- [ ] 4.5: Add level toggle to activity preview (parent-gated)
- [ ] 4.6: Add tier marking UI to Create Activity modal
- [ ] 4.7: Update custom activity save/load for tier data
- [ ] 4.8: Show level indicator on activity cards

### Feature 5: Activity Sequencing (Routines)
- [ ] 5.1: Define routine data model + localStorage persistence
- [ ] 5.2: Add activeRoutine state and management functions
- [ ] 5.3: Build "Create Routine" modal UI
- [ ] 5.4: Add drag-sortable activity ordering
- [ ] 5.5: Render routine cards in Activities tab
- [ ] 5.6: Implement startRoutine() and routine-aware endActivity()
- [ ] 5.7: Build "Next Activity" transition prompt
- [ ] 5.8: Add routine completion celebration
- [ ] 5.9: Add routine preview overlay
- [ ] 5.10: Support editing and deleting routines

### Feature 6: Expanded Word Limit + Pagination
- [ ] 6.1: Raise word limit from 16 to 32
- [ ] 6.2: Update Create Activity validation text
- [ ] 6.3: Add activityPage state and reset on startActivity
- [ ] 6.4: Update renderGrid to slice words by page
- [ ] 6.5: Calculate pageSize based on grid capacity
- [ ] 6.6: Add page indicator dots below grid
- [ ] 6.7: Implement swipe navigation
- [ ] 6.8: Add arrow button fallback for desktop
- [ ] 6.9: Update activity preview for paginated word count

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
