# Activities Expansion -- Feature Plan

## Executive Summary

Triple down on Activities as a core differentiator. Six enhancements that transform Activities from static word lists into a dynamic, intelligent, therapy-aligned system. These features work together: smart suggestions reduce parent effort, vocabulary levels support progressive disclosure, activity insights give therapists actionable data, schedule integration connects daily routines to communication, sequencing mirrors clinical session structure, and expanded word limits give parents flexibility.

## Scope

| # | Feature | Description |
|---|---------|-------------|
| 1 | Smart Word Suggestions | Auto-suggest words when creating/naming an activity |
| 2 | Activity <-> Visual Schedule Integration | Tap a schedule step to launch its linked activity |
| 3 | Activity-Segmented Usage Insights | Track and display per-activity word usage data |
| 4 | Vocabulary Levels (Starter/Expanded) | Progressive disclosure within activities |
| 5 | Activity Sequencing (Routines) | Chain multiple activities into ordered flows |
| 6 | Expanded Word Limit + Pagination | Raise 16-word cap, add swipeable pages |

---

## Feature 1: Smart Word Suggestions

### Requirements
- When a parent types an activity name in Create Activity, suggest relevant words automatically
- Suggestions appear below the name field as a "Suggested Words" section
- Parent can accept all, accept individually, or ignore suggestions
- Suggestions are additive -- they populate the selected words list, parent can remove any
- Must work offline (no API calls)

### Architecture

**Suggestion Engine**: A keyword-to-words mapping embedded in code.

- Map common activity keywords to word sets:
  - "meal" / "food" / "eat" / "lunch" / "dinner" / "breakfast" / "snack" -> Mealtime words
  - "bath" / "wash" / "shower" -> Bath Time words
  - "play" / "park" / "playground" / "outside" -> Playground words
  - "bed" / "sleep" / "nap" / "night" -> Bedtime words
  - "dress" / "clothes" / "shirt" / "shoes" -> Getting Dressed words
  - "car" / "ride" / "drive" / "trip" -> Car Ride words
  - "art" / "draw" / "paint" / "color" / "craft" -> Art Time words
  - "book" / "read" / "story" / "library" -> Book Time words
  - "doctor" / "dentist" / "hospital" / "clinic" -> Doctor Visit words
  - "store" / "shop" / "grocery" / "market" -> Grocery Store words
  - "music" / "sing" / "song" / "dance" -> Circle Time words
  - "sensory" / "play-doh" / "sand" / "water table" -> Sensory Play words
  - "swim" / "pool" / "beach" / "water" -> water/swimming activity words
  - "haircut" / "barber" -> new suggested set (wait, sit, help, all done, scared, gentle, etc.)
  - Generic fallback: always suggest core words (I, want, help, more, no, all done)

- Match logic: split activity name into tokens, check each token against keyword map, merge unique word suggestions from all matches.

**UI**:
- Below the name input, show "Suggested Words" section when matches found
- Chips styled distinctly (dashed border or lighter shade) to differentiate from manually picked
- "Add All Suggestions" button to bulk-add
- Individual chip tap to add one suggestion
- Section hidden when no matches or all suggestions already selected

### Data Source
- Pull suggested words from existing ACTIVITY_BUNDLES word arrays where possible
- For new keyword sets (haircut, swim, etc.), define small inline word arrays
- All words must include: label, labelEs, color (Fitzgerald Key), icon

### Tasks

- 1.1: Define ACTIVITY_SUGGESTION_MAP constant with keyword -> word arrays
- 1.2: Write matchActivitySuggestions(name) function
- 1.3: Add "Suggested Words" UI section to Create Activity modal
- 1.4: Wire up input event on name field to trigger suggestions
- 1.5: Handle "Add All" and individual add interactions
- 1.6: Prevent duplicate suggestions (already selected words excluded)

### Acceptance Criteria
- Typing "mealtime" suggests 10+ relevant words
- Typing "swimming" suggests water-related words
- Typing gibberish shows no suggestions (no errors)
- Suggestions respect Fitzgerald Key colors
- Already-selected words do not appear in suggestions
- Works fully offline

---

## Feature 2: Activity <-> Visual Schedule Integration

### Requirements
- When a schedule step has a linked activity, tapping "Start" on that step launches the corresponding activity overlay
- Parents can link an activity to a schedule step during template editing
- Visual indicator on schedule steps that have linked activities
- Ending an activity returns user to the schedule view

### Architecture

**Current State**:
- Schedule lives in guiding-steps/index.html with its own IndexedDB
- Activities live in index.html with ACTIVITY_BUNDLES + localStorage custom activities
- No cross-references exist

**Integration Approach**:
- Extend the schedule step data model to include an optional `activityId` field
- The activityId references an activity from ACTIVITY_BUNDLES or custom activities by id
- During template editing, add an "Link Activity" option per step
- Show a picker of all available activities (built-in + custom)
- When a step becomes "current" and has an activityId, show a "Start Activity" button
- Tapping it navigates to the main AAC board and calls startActivity(activityId)

**Cross-App Communication**:
- Since guiding-steps is a separate HTML file, communication options:
  - Option A: localStorage event (`storage` event listener) -- write activityId to localStorage, main app listens and launches
  - Option B: URL parameter -- navigate to index.html?activity=mealtime
  - Option C: Merge schedule into main index.html (larger refactor)
- **Recommended: Option B** -- simplest, works with PWA navigation, no shared state complexity
- Main app checks URL params on load, if `activity` param exists, auto-launches that activity

**Step Data Model Extension**:
    {
      stepId: string,
      label: string,
      imageType: 'default' | 'custom',
      defaultImageKey: string,
      customImageKey: string | null,
      activityId: string | null     // NEW -- references activity by ID
    }

### Tasks

- 2.1: Extend step data model with optional activityId field
- 2.2: Add "Link Activity" UI to template step editor in guiding-steps
- 2.3: Build activity picker (list of available activities with icons/colors)
- 2.4: Show linked activity indicator on schedule step cards
- 2.5: Add "Start Activity" button on current step when activityId is set
- 2.6: Implement URL-param-based cross-app navigation
- 2.7: In main index.html, detect activity URL param on load and auto-start
- 2.8: Handle "activity ended" -> return to schedule (history.back or explicit nav)

### Dependencies
- Need shared access to activity IDs between the two HTML files
- Activity IDs must be stable (built-in IDs are already stable strings like "mealtime")
- Custom activity IDs use "custom-[timestamp]-[random]" format -- stable once created

### Acceptance Criteria
- Parent can link "Mealtime" activity to a "Breakfast" schedule step
- When "Breakfast" step is current, "Start Activity" button appears
- Tapping it opens the main AAC board with Mealtime activity loaded
- Ending the activity returns to the schedule
- Steps without linked activities work exactly as before
- Linked activity indicator visible on step card

---

## Feature 3: Activity-Segmented Usage Insights

### Requirements
- Track which activity was active when each word was pressed
- Display per-activity usage breakdowns in insights
- Show: most-used words per activity, activity frequency, time-in-activity
- Data feeds into parent reports and potential therapist sharing

### Architecture

**Extend Usage Event**:
- Current event: { v: 1, btnId: string, ts: number, source: string }
- Extended: { v: 1, btnId: string, ts: number, source: string, activityId: string | null }
- When activeActivity is set, recordUsageEvent includes activeActivity.id

**Activity Session Tracking**:
- Track activity start/end times for duration metrics
- New array: activitySessions = [{ activityId, startedAt, endedAt }]
- Stored in localStorage key: 'aac-activity-sessions'
- startActivity() creates new session entry
- endActivity() closes the session with endedAt timestamp

**Insights UI Extension**:
- New section in insights: "Activity Insights"
- Show: activity usage frequency (bar chart or ranked list)
- Per-activity drill-down: top words used, total presses, avg session duration
- Show: "This week: Mealtime (12 sessions, 89 words), Bath Time (8 sessions, 45 words)"
- Respect 90-day retention window same as main usage data

### Tasks

- 3.1: Extend recordUsageEvent to include activityId from activeActivity
- 3.2: Add activity session tracking (start/end timestamps) with localStorage persistence
- 3.3: Add trimming/retention logic for activity sessions (90-day window)
- 3.4: Build getActivityInsights() aggregation function
- 3.5: Add "Activity Insights" section to renderInsights() UI
- 3.6: Show per-activity word frequency breakdown
- 3.7: Show activity frequency and duration stats

### Backward Compatibility
- Existing usage events without activityId treated as activityId: null (free communication)
- No migration needed -- new field is additive

### Acceptance Criteria
- Word presses during an activity are tagged with that activity's ID
- Insights show which activities are used most
- Per-activity top words displayed
- Activity session durations tracked and shown
- Old usage data (pre-update) still displays correctly
- Data respects 90-day retention window

---

## Feature 4: Vocabulary Levels (Starter / Expanded)

### Requirements
- Each activity has two tiers: Starter (4-6 essential words) and Expanded (full word set)
- Parent can toggle between levels per activity
- Default to Starter for new communicators, Expanded for experienced
- Global setting: "Default vocabulary level" (Starter / Expanded)
- Per-activity override available

### Architecture

**Activity Word Metadata**:
- Each word in an activity gains a `tier` field: "starter" or "expanded"
- Starter words: the most essential words for that activity (always includes core words)
- Expanded words: the full set (includes starter + additional)

**Built-In Activities**:
- Mark first 4-6 words in each ACTIVITY_BUNDLES entry as tier: "starter"
- Remaining words as tier: "expanded"
- Starter selection criteria: core words first (I, want, help, more, no, all done), then highest-frequency activity words

**Custom Activities**:
- When creating a custom activity, parent can mark words as "starter" or "expanded"
- Default: first 6 selected words = starter, rest = expanded
- Toggle per word in the Create Activity modal

**Rendering**:
- When vocabulary level is "starter", renderGrid filters to tier === "starter" only
- When "expanded", show all words
- Visual indicator on activity preview showing current level
- Toggle button accessible during active activity (parent-gated)

**Settings**:
- Global default level setting in Settings -> Activities section
- Stored in localStorage: 'aac-vocab-level' ('starter' | 'expanded')
- Per-activity override stored in activity object: { ..., levelOverride: 'starter' | 'expanded' | null }

### Tasks

- 4.1: Add tier field to ACTIVITY_BUNDLES words (mark starter vs expanded)
- 4.2: Add global vocabulary level setting to Settings UI
- 4.3: Store and load vocabulary level preference from localStorage
- 4.4: Update renderGrid activity-mode branch to filter by tier
- 4.5: Add level toggle to activity preview (parent-gated)
- 4.6: Add tier marking UI to Create Activity modal
- 4.7: Update custom activity save/load to include tier data
- 4.8: Show level indicator on activity cards in Activities tab

### Acceptance Criteria
- Starter level shows 4-6 words per activity
- Expanded level shows all words
- Global default applies to all activities without overrides
- Per-activity override takes precedence over global
- Level toggle is parent-gated (child cannot switch)
- Custom activities support tier marking
- Switching levels does not lose any data

---

## Feature 5: Activity Sequencing (Routines)

### Requirements
- Parent can create a "Routine" -- an ordered list of activities
- Example: "Morning Routine" = Mealtime -> Getting Dressed -> Car Ride
- Starting a routine launches the first activity
- When parent ends an activity, the next one in the sequence is offered
- Routines appear in the Activities tab alongside individual activities

### Architecture

**Routine Data Model**:
    {
      id: 'routine-[timestamp]-[random]',
      name: string,
      nameEs: string,
      icon: emoji,
      color: hex,
      type: 'routine',
      activityIds: [string],        // Ordered list of activity IDs
      currentIndex: 0               // Track position when active (runtime only)
    }

**Storage**:
- Stored in localStorage: 'aac-routines' as JSON array
- Separate from custom activities to avoid type confusion

**Runtime State**:
- New global: activeRoutine = { routine, currentIndex }
- startRoutine(routineId) -> sets activeRoutine, calls startActivity(first activityId)
- endActivity() checks if activeRoutine is set:
  - If yes and more activities remain: show "Next: [Activity Name]" prompt with Start / End Routine buttons
  - If yes and no more activities: show "Routine Complete!" celebration, clear activeRoutine

**UI**:
- "Create Routine" button in Activities tab (alongside Create Activity)
- Create Routine modal: name, icon, color, then drag-sortable list of activities to add
- Activity picker shows all available activities with add/remove
- Routine cards in Activities tab show activity count and sequence preview
- Routine preview shows ordered list of activities with icons

### Tasks

- 5.1: Define routine data model and localStorage persistence
- 5.2: Add activeRoutine global state and management functions
- 5.3: Build "Create Routine" modal UI (name, icon, color, activity picker)
- 5.4: Add drag-sortable activity ordering in routine editor
- 5.5: Render routine cards in Activities tab (distinct from activity cards)
- 5.6: Implement startRoutine() and routine-aware endActivity()
- 5.7: Build "Next Activity" transition prompt between routine steps
- 5.8: Add routine completion celebration
- 5.9: Add routine preview overlay (like activity preview)
- 5.10: Support editing and deleting routines

### Acceptance Criteria
- Parent can create a routine with 2+ activities
- Starting a routine launches the first activity
- Ending an activity during a routine prompts the next one
- Completing all activities shows celebration
- Parent can end routine early at any point
- Routines persist across sessions
- Routine cards visually distinct from activity cards

---

## Feature 6: Expanded Word Limit + Pagination

### Requirements
- Raise the per-activity word limit from 16 to 32
- Activities with more than 16 words display across multiple pages
- Swipe or button navigation between pages
- Page indicator dots visible during activity

### Architecture

**Word Limit Change**:
- Update hard-coded limit from 16 to 32 in Create Activity save handler
- Update validation message accordingly

**Pagination in Activity Mode**:
- When activeActivity.words.length > 16, split into pages of 16 (or match grid capacity)
- Page size = getGridSize() columns x calculated rows (match current grid capacity)
- New state: activityPage = 0
- Render only words for current page slice

**Navigation**:
- Swipe left/right to change pages (touch events)
- Small dot indicators below the grid showing current page
- Optional: left/right arrow buttons at grid edges

**Grid Rendering Update**:
- renderGrid activity-mode branch slices words by page
- activityPage resets to 0 when starting an activity
- Page count = Math.ceil(words.length / pageSize)

### Tasks

- 6.1: Raise word limit constant from 16 to 32
- 6.2: Update Create Activity validation text
- 6.3: Add activityPage state variable and reset on startActivity
- 6.4: Update renderGrid activity-mode to slice words by page
- 6.5: Calculate pageSize based on grid capacity
- 6.6: Add page indicator dots below grid
- 6.7: Implement swipe navigation (touch start/end tracking)
- 6.8: Add arrow button fallback for non-touch devices
- 6.9: Update activity preview to show word count per page

### Acceptance Criteria
- Activities can have up to 32 words
- Activities with 16 or fewer words display exactly as before (no pagination)
- Activities with 17+ words show pagination dots
- Swipe navigates between pages
- Page indicator shows current position
- Arrow buttons work on desktop
- Grid layout consistent across pages

---

## Implementation Order

Recommended sequence based on dependencies and impact:

1. **Feature 1: Smart Word Suggestions** -- standalone, no dependencies, immediate parent value
2. **Feature 6: Expanded Word Limit + Pagination** -- standalone, enables larger activities for later features
3. **Feature 4: Vocabulary Levels** -- builds on activity word model, adds tier metadata
4. **Feature 3: Activity-Segmented Insights** -- extends usage tracking, no UI dependencies
5. **Feature 5: Activity Sequencing** -- depends on solid activity system, adds routines layer
6. **Feature 2: Schedule Integration** -- cross-app feature, most complex, benefits from all above being stable

---

## Accessibility Considerations (All Features)

- All new interactive elements must be keyboard accessible
- Touch targets minimum 44x44px
- Swipe navigation (Feature 6) must have button alternative
- Page indicators need ARIA labels ("Page 1 of 2")
- Activity level toggle needs clear labeling for screen readers
- Routine transition prompts must be announced to screen readers
- Color is never the sole indicator of state

## Performance Considerations

- Suggestion matching (Feature 1): simple string matching, no performance concern
- Usage event extension (Feature 3): one additional field per event, negligible
- Activity sessions (Feature 3): separate small array, trimmed to 90 days
- Pagination (Feature 6): reduces DOM nodes per render (better performance for large activities)
- Routines (Feature 5): small data model, minimal storage
