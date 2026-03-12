# App Split Implementation Notes

## Current Status: Phase G Complete (AAC Board only) -- Guiding Steps iteration in progress separately

## Checklist

### Phase A: Scaffold Guiding Steps
- [x] Create directory structure (guiding-steps/.project/features/)
- [x] Create manifest.json
- [x] Create sw.js
- [x] Create index.html scaffold with shared design system
- [x] Create planning doc (AppSplit.md)
- [x] Create notes doc (this file)
- [x] Developer review and approval

### Phase B: Copy Schedule Feature
- [x] Schedule CSS (steps, template editor, activity picker, template list)
- [x] Schedule HTML (view + 3 modals: template list, template editor, activity picker)
- [x] DEFAULT_SCHEDULE_ACTIVITIES constant (30 activities with inline SVGs)
- [x] DEFAULT_TEMPLATES constant (6 pre-built templates)
- [x] Schedule DB helpers (loadTemplates, saveTemplate, deleteTemplateFromDB, loadActiveSchedule, saveActiveSchedule, clearActiveSchedule)
- [x] Schedule JS logic + event listeners (initSchedules, renderSchedule, completeCurrentStep, template management, activity picker)
- [x] Spanish translations removed (English-only for Guiding Steps v1)
- [ ] Independent testing

### Phase C: Copy Rewards Feature
- [x] Rewards CSS (tracker, grid, tiles, cards, config, task image picker)
- [x] Rewards HTML (view + 2 modals: reward config, task image picker)
- [x] DEFAULT_TASK_IMAGES constant (25 task images with inline SVGs)
- [x] Reward DB helpers (loadTracks, saveTrack, deleteTrackFromDB)
- [x] Rewards JS logic + event listeners (initRewards, renderRewards, handleTileTap, renderPath, renderRewardCard, renderTrackTabs, renderRewardActive, openRewardConfig, all config handlers)
- [x] Sound effects (playDing, playTaDa using AAC Board quality audio: setValueAtTime/linearRampToValueAtTime)
- [x] Celebration system (triggerCelebration with reward image loading, spawnConfetti)
- [x] Spanish translations removed (English-only for Guiding Steps v1)
- [ ] Independent testing

### Phase D: Remove Schedule from AAC Board
- [x] Delete HTML, CSS, JS
- [x] Update tab system
- [x] Clean up translations
- [x] Fix orphaned closing brace in updateUIStrings()
- [x] Developer testing -- validated

### Phase E: Remove Rewards from AAC Board
- [x] Delete HTML, CSS, JS
- [x] Update tab system
- [x] Clean up translations
- [x] Clean up responsive/sensory CSS
- [x] Fix LANG_ES/SYMBOL_KEYWORDS references -> getLangEs()/getSymbolKeywords()
- [x] Developer testing -- validated

### Phase F: Add Activities Tab to AAC Board
- [x] Convert activities-overlay to view-activities tabpanel
- [x] Add tab-activities button to tab bar (Talk / Activities / Settings)
- [x] Update getTabViewMap() with tab-activities entry
- [x] Remove btn-open-activities from Settings (now a tab)
- [x] Remove overlay open/close handlers, replace with tab-based rendering
- [x] Clean up stale activities-overlay references in startActivity/customize handlers
- [x] Add Activities to updateUIStrings() tab titles
- [x] Developer testing -- validated

### Phase G: Polish Both Apps
- [x] Dead code scan -- removed orphaned taskImages/taskCategories translations from _buildLangEs()
- [x] No other orphaned references found (CSS, JS, HTML all clean)
- [x] Bumped sw.js cache v42 -> v43
- [ ] Lighthouse audit (AAC Board)
- [ ] Mobile device testing (AAC Board)
- [ ] Offline testing (AAC Board)
- [ ] Deploy (AAC Board)
- [ ] Guiding Steps polish (deferred -- active iteration)

## Issues and Resolutions
- Syntax error: Removing schedule/rewards i18n strings from updateUIStrings() left an orphaned comment and extra closing brace. Fixed by removing the dead code.
- Runtime crash: updateChildNamePhrase() and openReorderOverlay() referenced removed globals LANG_ES and SYMBOL_KEYWORDS. Replaced with getLangEs() and getSymbolKeywords() function calls.
- Guiding Steps missing views: Closing div tags for view-schedule and view-rewards were omitted during Phase B+C, causing all content after schedule to be nested inside a display:none div. Fixed by adding missing closing tags.

## Deviations from Plan
- IDB version bump (Phase D checklist item) not needed -- DB version was already 3 and no stores were added/removed in the upgrade handler.
