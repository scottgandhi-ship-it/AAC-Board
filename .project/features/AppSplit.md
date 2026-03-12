# AAC Board / Guiding Steps App Split

## Executive Summary

Split the AAC Board PWA into two focused apps based on SLP/DT feedback:
- **AAC Board**: Communication board + Activities (new tab) + all existing AAC features
- **Guiding Steps**: Visual Schedules + Reward Tracker + Social Stories (future)

Both apps share the same design system, aesthetic, and interaction patterns.
Guiding Steps lives at `AAC-Board/guiding-steps/` for knowledge sharing during development.

## Motivation

- SLPs need a focused communication tool during 30-minute therapy sessions
- Schedule/Rewards serve behavioral/structural functions -- different clinical moments
- Activities is the bridge between AAC and real life -- deserves its own tab
- 1x1 grid support requested by SLPs for onboarding (Yes/No, Stop/Go)

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Shared styles | Design token copy from AAC Board root vars | No build tools, single-file pattern |
| Project location | `AAC-Board/guiding-steps/` subdirectory | Knowledge sharing, single repo during dev |
| Data isolation | Own IndexedDB (`guiding-steps`), own localStorage prefix (`gs-`) | No cross-app data dependency |
| Service worker | Independent `sw.js`, cache name `guiding-steps-v1` | Clean PWA install identity |
| App pattern | Single-file PWA (index.html + sw.js + manifest.json) | Matches AAC Board architecture |

## Phased Execution Plan

### Phase A: Scaffold Guiding Steps (THIS PHASE)
- [x] Create directory structure
- [x] Create manifest.json with Guiding Steps identity
- [x] Create sw.js with network-first caching
- [x] Create index.html scaffold with shared design system
- [x] Shared CSS: root variables, fonts, body, views, tab bar, toast, header, parent mode, sensory, celebration, confetti
- [x] Shared JS: IndexedDB infrastructure, showToast, parent mode, sensory preferences, speak/TTS
- [x] Tab bar: Schedule, Rewards, Settings
- [x] Settings modal: Parent mode, sensory preferences
- [x] Create planning and notes docs

### Phase B: Copy Schedule Feature to Guiding Steps
- [ ] Copy Schedule CSS (~400 lines: schedule content, steps, header, empty/done states, parent controls)
- [ ] Copy Template Editor Modal CSS + HTML
- [ ] Copy Activity Picker Modal CSS + HTML
- [ ] Copy Schedule HTML (view-schedule, template list, template editor, activity picker)
- [ ] Copy DEFAULT_SCHEDULE_ACTIVITIES constant (30+ activities with SVG icons)
- [ ] Copy Schedule DB helpers (loadTemplates, saveTemplate, deleteTemplateFromDB, loadActiveSchedule, saveActiveSchedule, clearActiveSchedule)
- [ ] Copy Schedule JS logic (initSchedules, renderSchedule, completeCurrentStep, openTemplateList, activateTemplate, openTemplateEditor, renderEditorSteps, swapSteps, openActivityPicker, renderDefaultActivities)
- [ ] Copy Schedule event listeners
- [ ] Copy Spanish translation strings for schedule
- [ ] Adapt DB calls to use `guiding-steps` database
- [ ] Test independently

### Phase C: Copy Rewards Feature to Guiding Steps
- [ ] Copy Rewards CSS (~850 lines: track tabs, path area, task tiles, reward card, active screen, config modal, task image picker)
- [ ] Copy Rewards HTML (view-rewards, reward config modal, task image picker)
- [ ] Copy DEFAULT_TASK_IMAGES constant
- [ ] Copy Reward DB helpers (loadTracks, saveTrack, deleteTrackFromDB)
- [ ] Copy Rewards JS logic (initRewards, renderRewards, handleTileTap, renderPath, renderRewardCard, renderTrackTabs, renderRewardActive, startRewardTimer, clearRewardTimer, triggerCelebration, spawnConfetti, openRewardConfig)
- [ ] Copy Sound effects (getAudioCtx, playDing, playTaDa)
- [ ] Copy Task Image Picker logic
- [ ] Copy Spanish translation strings for rewards
- [ ] Adapt DB calls to use `guiding-steps` database
- [ ] Test independently

### Phase D: Remove Schedule from AAC Board
- [ ] Delete Schedule view HTML
- [ ] Delete Schedule CSS (~620 lines: 2386-3007)
- [ ] Delete Schedule JS functions and event listeners
- [ ] Delete Schedule DB stores (or leave dead -- bump IDB version either way)
- [ ] Remove `tab-schedule` from tab bar HTML
- [ ] Update `getTabViewMap()` to remove `tab-schedule`
- [ ] Remove `initSchedules()` from boot sequence
- [ ] Clean up `updateUIStrings()` schedule references
- [ ] Remove Schedule translation strings from LANG_ES
- [ ] Delete Template List, Template Editor, Activity Picker modals (HTML)
- [ ] Delete DEFAULT_SCHEDULE_ACTIVITIES constant
- [ ] Delete Schedule DB helpers

### Phase E: Remove Rewards from AAC Board
- [ ] Delete Rewards view HTML
- [ ] Delete Rewards CSS (~850 lines: 1539-2385)
- [ ] Delete Rewards JS functions and event listeners
- [ ] Remove `tab-rewards` from tab bar HTML
- [ ] Update `getTabViewMap()` to remove `tab-rewards`
- [ ] Remove `initRewards()` from boot sequence
- [ ] Clean up `updateUIStrings()` reward references
- [ ] Remove Reward translation strings from LANG_ES
- [ ] Delete Reward Config Modal, Task Image Picker Modal (HTML)
- [ ] Delete DEFAULT_TASK_IMAGES constant
- [ ] Delete Reward DB helpers and sound effect functions
- [ ] Remove reward-specific responsive CSS (lines 3025-3059)
- [ ] Remove reward-specific high-contrast CSS (lines 3146-3152)
- [ ] Decide: keep or remove Celebration overlay (may be needed by Activities)

### Phase F: Add Activities Tab to AAC Board
- [ ] Add `view-activities` container with tabpanel role
- [ ] Add Activities tab button in tab bar (Talk / Activities / Settings)
- [ ] Update `getTabViewMap()` to include `tab-activities`
- [ ] Design and build Activities feature (new functionality)
- [ ] 1x1 grid support for onboarding (separate task, may be Phase G)

### Phase G: Polish Both Apps
- [ ] Bump sw.js cache versions in both apps
- [ ] Test both apps independently (offline, install flow, all features)
- [ ] Verify no dead code or orphaned references
- [ ] Mobile device testing
- [ ] Lighthouse audit (90+ all categories)
- [ ] Deploy both apps

## Dependencies and Risks

### Tightly Coupled Areas
1. **IndexedDB schema**: Single `openDB()` creates all stores. Removing schedule/rewards stores requires version bump.
2. **Tab system**: `getTabViewMap()` hard-codes schedule/rewards. `switchTab`, ARIA attrs all wired to current 3 tabs.
3. **Translation strings**: Schedule/reward strings embedded in LANG_ES object.
4. **Image store sharing**: Reward images use same `images` IDB store as AAC button images (keyed with `reward-` and `task-` prefixes). No conflict on removal.
5. **`init()` boot sequence**: Calls `initRewards()` and `initSchedules()` at top level.
6. **Celebration overlay**: Currently only used by rewards. May be needed by Activities in AAC Board.
7. **Sound effects**: Tied to sensory preference system.

### What Will Break on Removal (Phases D/E)
- Tab bar renders with only Talk + Settings (need Activities tab first or simultaneously)
- `updateUIStrings()` tries to set innerHTML on removed schedule/rewards elements
- `backNavBtn` click handler references "Schedule or Rewards" in comment
- Sensory high-contrast CSS targets `.reward-card` and `.task-tile` -- orphaned but harmless

### Mitigation: Copy-Then-Delete Order
- Copy features to Guiding Steps first (Phases B+C)
- Verify Guiding Steps works independently
- Then remove from AAC Board (Phases D+E)
- Add Activities tab simultaneously with removal (Phase F)
- Both features remain working in AAC Board during transition

## Existing Users Consideration (Reggie's Feedback)
- Existing AAC Board users already have schedule/rewards data
- When removing features, the IDB stores with their data will remain untouched (unused stores persist)
- We do NOT delete user data -- just stop rendering those views
- Guiding Steps starts fresh (no migration needed for v1)
- Future: consider data export from AAC Board -> import to Guiding Steps

## Acceptance Criteria

### Guiding Steps App
- Standalone PWA that installs independently
- Visual Schedules feature works identically to current AAC Board implementation
- Reward Tracker feature works identically to current AAC Board implementation
- Same design system (colors, fonts, spacing, interactions)
- Parent mode with auto-lock timer
- Sensory preferences (reduced motion, high contrast, quiet mode)
- Network-first service worker, works offline
- Lighthouse 90+ all categories

### AAC Board (Post-Split)
- No schedule or rewards code remains
- Activities tab replaces Schedule/Rewards tabs
- 3-tab layout: Talk / Activities / Settings
- All existing AAC features unaffected
- No broken references or dead code
- Lighthouse 90+ all categories
