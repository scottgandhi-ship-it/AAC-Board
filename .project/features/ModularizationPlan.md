# AAC Board -- Modularization Plan

## Executive Summary

Split the monolithic index.html (12,983 lines / ~77K tokens) into separate CSS and JS module files while preserving the no-build-tool, vanilla JS architecture. The app will continue to work as a single-page app loaded from index.html, but CSS and JS will be organized into logical, maintainable files loaded via standard link/script tags.

This plan is informed by the iOS Conversion plan (Capacitor with webDir: "www/") and the App Split plan (Guiding Steps separation). Module boundaries are drawn to align with both.

## Rollback Strategy

**Baseline tag:** `pre-modularization` (commit b475d31)

This tag marks the last known-good monolithic version of index.html before any extraction work begins. If modularization breaks the app beyond quick repair, the full rollback procedure is:

    git checkout pre-modularization -- index.html sw.js
    rm -rf css/ js/
    git add -A && git commit -m "Rollback: restore monolithic index.html"

**Per-phase rollback:** Each phase ends with a commit. To undo only the most recent phase:

    git revert HEAD

**Per-step rollback:** Each extraction step is its own commit. To undo the last step:

    git revert HEAD

**When to rollback vs fix forward:**
- Single function broke after extraction -> fix forward (move the function, adjust references)
- Multiple features broken, unclear root cause -> revert the last step's commit
- App completely non-functional after a phase -> revert to the phase start commit
- Full disaster, nothing works -> restore from pre-modularization tag

**Validation gate:** Before starting each new phase, the current state must pass the /validate skill. If it fails, fix before proceeding -- never start a new phase on a broken base.

## Requirements

1. No build tools, bundlers, transpilers, or frameworks introduced
2. The app must work identically before and after each extraction step
3. Files must work in both browser (served from file/HTTPS) and Capacitor WKWebView
4. Offline-first: service worker cache list must be updated with every new file
5. ES modules (import/export) are the preferred loading mechanism where supported
6. All extracted files must live in a flat or shallow directory structure compatible with Capacitor www/ sync
7. Each phase must keep the app fully functional -- no "big bang" migration

## Current File Map

### CSS Sections (Lines 14-3141 inside style tag)

| Line Range | Section | Approx Lines | Proposed Module |
|------------|---------|--------------|-----------------|
| 14-99 | Root variables, resets, design tokens | 86 | css/tokens.css |
| 101-118 | Body and html base styles | 18 | css/tokens.css |
| 120-200 | Message bar (.bar-btn, #message-bar, #message-words) | 81 | css/message-bar.css |
| 206-383 | Grid (#grid-container, #grid, .cell, folder colors, Fitzgerald colors) | 178 | css/grid.css |
| 385-431 | Prediction bar | 47 | css/grid.css |
| 432-475 | Core word strip | 44 | css/grid.css |
| 476-535 | Grid size adjustments (grid-1 through grid-6, early learner) | 60 | css/grid.css |
| 537-741 | Word picker modal | 205 | css/modals.css |
| 742-995 | Onboarding overlay, grid picker, coach marks | 254 | css/onboarding.css |
| 996-1003 | Search result cell colors | 8 | css/grid.css |
| 1006-1500 | Settings modal, accordion, export/import, folder selection, PWA install, getting started | 495 | css/settings.css |
| 1501-1815 | Activity overlay, activity cards, create activity, walkthrough | 315 | css/activities.css |
| 1817-1955 | Guided vocabulary stories | 139 | css/activities.css |
| 1957-2034 | Activity preview overlay | 78 | css/activities.css |
| 2035-2100 | Voice sliders, close settings button | 66 | css/settings.css |
| 2102-2199 | Add show modal, edit button modal | 98 | css/modals.css |
| 2200-2262 | Color swatches, edit image buttons | 63 | css/modals.css |
| 2263-2465 | Search overlay, symbol search overlay | 203 | css/modals.css |
| 2467-2488 | Toast | 22 | css/ui-shared.css |
| 2489-2593 | App header, parent mode, FAB, back button, export folder button | 105 | css/app-chrome.css |
| 2594-2710 | Views, tab bar, placeholder views | 117 | css/app-chrome.css |
| 2711-2825 | Mobile responsive, landscape, safe areas, sensory preferences | 115 | css/responsive.css |
| 2826-3007 | Insights view | 182 | css/insights.css |
| 3009-3140 | Reorder folders overlay | 132 | css/modals.css |

**Total CSS: ~3,127 lines across 10 proposed files**

### HTML Sections (Lines 3143-3810)

| Line Range | Section | Stays In |
|------------|---------|----------|
| 3143-3148 | App header | index.html |
| 3150-3194 | Talk view (message bar, prediction bar, core word strip, grid) | index.html |
| 3196-3218 | Activity preview overlay | index.html |
| 3220-3237 | Activities view | index.html |
| 3239-3329 | Routine overlays, create activity modal | index.html |
| 3332-3357 | Insights overlay | index.html |
| 3359-3376 | FAB, tab bar | index.html |
| 3378-3661 | Settings modal (all categories) | index.html |
| 3663-3810 | Export/import, PWA banner, edit modal, add show, reorder, search, onboarding, coach marks, image preview | index.html |

**HTML stays in index.html.** It is template-like content that is tightly coupled to DOM IDs referenced throughout JS. Extracting HTML into fragments would require a template loading system -- too much complexity for no bundler. The HTML is only ~670 lines.

### JS Sections (Lines 3811-12983 inside script tag)

| Line Range | Section | Approx Lines | Proposed Module |
|------------|---------|--------------|-----------------|
| 3849-4459 | Language/i18n (LANG_ES, t(), getDisplayLabel, setLanguage, updateUIStrings) | 611 | js/i18n.js |
| 4461-5222 | Vocabulary data (CORE_WORD_DEFS, grid templates, DEFAULT_BUTTONS -- all 832 words) | 762 | js/vocabulary.js |
| 5223-5239 | Global state variables | 17 | js/state.js |
| 5241-6416 | Vocabulary graph (VOCAB_WORD_POOL, WORD_EXPANSION, ACTIVITY_TEMPLATES) | 1176 | js/vocabulary.js |
| 6418-6823 | Step vocab map, walkthrough surfacing, guided vocab helpers | 406 | js/guided-vocab.js |
| 6824-6900 | Activity position allocation (motor planning) | 77 | js/activities.js |
| 6891-7357 | Activity state, STARTER_WORDS, getActivityWords, ACTIVITY_BUNDLES | 467 | js/activities.js |
| 7358-7416 | Parent mode timer, DB constants | 59 | js/storage.js |
| 7367-7526 | IndexedDB (openDB, loadButtons, saveButtons, grid size, templates, word picker helpers) | 160 | js/storage.js |
| 7527-7706 | Word picker modal logic | 180 | js/word-picker.js |
| 7707-7833 | Onboarding system | 127 | js/onboarding.js |
| 7834-7919 | Image management (save/load/delete, blob helpers, clearAllData) | 86 | js/storage.js |
| 7921-8031 | init() and finalizeInit() | 111 | js/app.js (main) |
| 8032-8066 | Sensory preferences | 35 | js/settings.js |
| 8067-8197 | Speech/TTS (initSpeech, voice management, voice selection) | 131 | js/tts.js |
| 8197-8415 | Grammar engine (EN + ES, pluralize, verb forms, applyGrammar) | 219 | js/grammar.js |
| 8392-8397 | Haptic feedback | 6 | js/tts.js |
| 8398-8415 | speak() function | 18 | js/tts.js |
| 8417-8653 | Render grid (setupCoreDelegation, renderCoreStrip, renderGrid) | 237 | js/grid.js |
| 8654-8852 | FOLDER_ICONS, BUTTON_ICONS constants | 199 | js/vocabulary.js |
| 8854-8966 | Predictions (DEFAULT_NOUN_IDS, PREDICTIONS, bigram model) | 113 | js/predictions.js |
| 8967-8979 | Auto-speak setting | 13 | js/predictions.js |
| 8980-9188 | Usage tracking and statistics | 209 | js/usage.js |
| 9189-9316 | Insights rendering + CSV export | 128 | js/insights.js |
| 9317-9445 | Blended prediction ranking, renderPredictions | 129 | js/predictions.js |
| 9446-9651 | Cell creation, grid delegation (tap/hold), image preview | 206 | js/grid.js |
| 9652-9806 | Message bar (addWordToMessage, renderMessage, word search) | 155 | js/message-bar.js |
| 9807-9893 | View switching, tab system, back button wiring | 87 | js/navigation.js |
| 9894-9946 | Parent mode toggle, auto-lock | 53 | js/settings.js |
| 9947-10275 | Settings UI (accordions, grid size, grammar, language, voice, sliders) | 329 | js/settings.js |
| 10276-10373 | Child name personalization | 98 | js/settings.js |
| 10374-10536 | Edit modal (color swatches, open/save/delete) | 163 | js/edit-modal.js |
| 10537-10583 | Custom shows (entertainment folder) | 47 | js/edit-modal.js |
| 10584-10949 | Activity overlays (render, preview, start, end, guided mode) | 366 | js/activities.js |
| 10950-11146 | Routines (create, start, advance, end, render) | 197 | js/routines.js |
| 11147-11478 | Create activity modal (icons, colors, word suggestions, walkthrough UI) | 332 | js/create-activity.js |
| 11479-11723 | Create activity modal continued (open, render, save) | 245 | js/create-activity.js |
| 11724-11828 | Export/import activities | 105 | js/activities.js |
| 11829-11849 | Custom image tracking | 21 | js/storage.js |
| 11850-12066 | Folder reorder (drag/drop) | 217 | js/folder-reorder.js |
| 12067-12821 | Export/import board (full board + folder export/import) | 755 | js/export-import.js |
| 12822-12828 | showToast() | 7 | js/ui-shared.js |
| 12829-12851 | Landscape grid optimization | 23 | js/grid.js |
| 12852-12967 | PWA install prompt | 116 | js/pwa.js |
| 12969-12976 | Service worker registration | 8 | js/pwa.js |
| 12978-12983 | init() call, entry point | 6 | js/app.js (main) |

**Total JS: ~9,846 lines across 18 proposed files**

## Global State and Shared Dependencies

### Critical Global Variables (js/state.js)

These variables are read/written by multiple modules and must be globally accessible:

    buttons (array) -- the entire vocabulary; read by grid, activities, search, export/import, settings
    currentFolder (string|null) -- which folder is open; read by grid, navigation, activities
    parentMode (boolean) -- parent mode on/off; read by settings, grid, activities, FAB, edit modal
    editingButtonId (string|null) -- which button is being edited; used by edit modal
    messageWords (array) -- current sentence being built; used by message bar, predictions, TTS
    messageButtonIds (array) -- button IDs for current sentence; used by grammar, predictions
    lastTapId (string|null) -- last tapped button ID; used by predictions
    lastTapTime (number) -- timestamp of last tap; used by double-tap detection
    speechRate (number) -- TTS rate; used by TTS, settings
    speechPitch (number) -- TTS pitch; used by TTS, settings
    activeTab (string) -- current active tab; used by navigation, settings, UI rendering
    currentLang (string) -- 'en'|'es'|'both'; used by i18n, TTS, grid, settings
    activeActivity (object|null) -- active activity; used by activities, grid, guided vocab
    vocabLevel (string) -- 'starter'|'expanded'; used by activities
    guidedActive (boolean) -- guided mode on/off; used by guided vocab, grid
    voices (array) -- Web Speech API voices; used by TTS, settings
    usageLog (array) -- usage events; used by usage, insights
    usageSummary (object) -- aggregated stats; used by usage, insights

### Dependency Graph (which modules need which)

    js/state.js        -> (no deps -- pure state declarations)
    js/ui-shared.js    -> state (showToast)
    js/storage.js      -> state, ui-shared (IndexedDB, buttons, images)
    js/i18n.js         -> state (currentLang, buttons for label lookup)
    js/vocabulary.js   -> (no deps -- pure data constants)
    js/tts.js          -> state, i18n, grammar, storage (speak, voices, haptic)
    js/grammar.js      -> state, i18n (applyGrammar needs currentLang, button IDs)
    js/grid.js         -> state, storage, i18n, tts, vocabulary (renderGrid, createCell)
    js/predictions.js  -> state, storage, grid, tts, vocabulary, i18n (renderPredictions)
    js/message-bar.js  -> state, tts, predictions, grammar, grid, i18n (addWordToMessage)
    js/usage.js        -> state, ui-shared (recordUsageEvent, save/load)
    js/insights.js     -> state, usage, ui-shared (renderInsights, exportCSV)
    js/navigation.js   -> state, grid, activities (switchTab, back button)
    js/settings.js     -> state, storage, grid, tts, i18n, ui-shared, navigation, usage (all settings UI)
    js/activities.js   -> state, storage, grid, tts, i18n, vocabulary, guided-vocab, usage (activity system)
    js/guided-vocab.js -> state, vocabulary, tts, i18n (guided vocabulary stories)
    js/create-activity.js -> state, storage, activities, vocabulary, i18n, ui-shared (create/edit activity modal)
    js/routines.js     -> state, activities, ui-shared (routine management)
    js/edit-modal.js   -> state, storage, grid, tts, i18n, ui-shared (edit button modal)
    js/word-picker.js  -> state, vocabulary, i18n (word picker modal)
    js/folder-reorder.js -> state, storage, grid, ui-shared (folder drag/drop reorder)
    js/export-import.js -> state, storage, grid, ui-shared, i18n (board export/import)
    js/onboarding.js   -> state, storage, grid, settings (onboarding flow)
    js/pwa.js          -> (standalone -- PWA install, service worker)
    js/app.js          -> ALL modules (init, finalizeInit, entry point)

## Module Communication Strategy

### Approach: Shared Global Namespace via Window Object

Since we have no bundler, ES module import/export with circular dependencies would be fragile in a browser context. Instead:

**Primary strategy**: Use ES modules with explicit import/export for data and pure functions. Use a shared global app namespace (window.AAC) for state and cross-cutting functions that many modules need.

**Pattern:**

    // js/state.js -- exports mutable state
    window.AAC = window.AAC || {};
    window.AAC.state = {
      buttons: [],
      currentFolder: null,
      parentMode: false,
      // ... all shared state
    };

    // js/grid.js -- reads state, exports functions
    window.AAC.grid = {
      renderGrid: function() { ... },
      renderCoreStrip: function() { ... },
    };

    // Other modules access via window.AAC.state.buttons, window.AAC.grid.renderGrid(), etc.

**Why not pure ES modules with import/export:**
- Circular dependency risk: grid needs predictions, predictions need grid
- Many modules need state -- threading state through import chains adds complexity without a module bundler to resolve cycles
- Capacitor WKWebView supports ES modules, but the SW cache strategy is simpler with script tags
- The global namespace approach is what the app already does (everything on window); this just organizes it

**Alternative considered: Event bus.** Too much indirection for a small team. The global namespace is simpler and debuggable.

### Load Order (script tags in index.html)

The scripts must load in dependency order. With defer attribute, they execute in order after DOM parse:

    1. js/state.js          (global state -- no deps)
    2. js/ui-shared.js      (showToast -- needs state)
    3. js/vocabulary.js     (pure data constants -- no deps)
    4. js/storage.js        (IndexedDB -- needs state, ui-shared)
    5. js/i18n.js           (language -- needs state)
    6. js/grammar.js        (grammar engine -- needs state, i18n)
    7. js/tts.js            (TTS, haptic, speak -- needs state, i18n, grammar)
    8. js/predictions.js    (bigram model, ranking -- needs state, vocabulary)
    9. js/usage.js          (usage tracking -- needs state, ui-shared)
    10. js/grid.js          (renderGrid, createCell -- needs state, storage, i18n, tts, vocabulary)
    11. js/message-bar.js   (sentence building -- needs state, tts, predictions, grammar, grid)
    12. js/word-picker.js   (word picker modal -- needs state, vocabulary, i18n)
    13. js/insights.js      (insights rendering -- needs state, usage)
    14. js/navigation.js    (tabs, back button -- needs state, grid)
    15. js/settings.js      (settings UI -- needs many modules)
    16. js/activities.js    (activity system -- needs state, storage, grid, vocabulary)
    17. js/guided-vocab.js  (guided stories -- needs state, vocabulary, tts)
    18. js/create-activity.js (create/edit activity -- needs state, activities, vocabulary)
    19. js/routines.js      (routines -- needs state, activities)
    20. js/edit-modal.js    (edit button -- needs state, storage, grid)
    21. js/folder-reorder.js (reorder -- needs state, storage, grid)
    22. js/export-import.js (export/import -- needs state, storage, grid)
    23. js/onboarding.js    (onboarding -- needs state, storage, grid)
    24. js/pwa.js           (PWA -- standalone)
    25. js/app.js           (init, finalizeInit, entry point -- LAST)

## Target File Structure

    AAC-Board/
      index.html           (HTML only -- no inline style/script, just link/script tags)
      manifest.json        (unchanged)
      sw.js                (updated cache list)
      css/
        tokens.css         (root variables, resets, typography, spacing, body)
        app-chrome.css     (header, tab bar, views, FAB, back button, parent mode)
        grid.css           (grid, cells, folders, core strip, prediction bar, Fitzgerald colors)
        message-bar.css    (message bar, bar buttons)
        modals.css         (word picker, edit, add show, search, symbol search, reorder, color swatches)
        settings.css       (settings panel, accordion, export/import, PWA banner, getting started, voice sliders)
        activities.css     (activity banner, cards, preview, create, walkthrough, guided vocab)
        onboarding.css     (onboarding steps, grid picker, coach marks)
        insights.css       (insights view, charts, cards)
        responsive.css     (media queries, landscape, safe areas, sensory preferences)
        ui-shared.css      (toast, visually-hidden, bilingual labels)
      js/
        state.js           (global state declarations)
        ui-shared.js       (showToast, escapeHtml)
        vocabulary.js      (DEFAULT_BUTTONS, CORE_WORD_DEFS, grid templates, FOLDER_ICONS, BUTTON_ICONS, VOCAB_WORD_POOL, WORD_EXPANSION, ACTIVITY_TEMPLATES)
        storage.js         (IndexedDB, loadButtons, saveButtons, saveImage, loadImage, grid size helpers, template cache, custom image tracking)
        i18n.js            (LANG_ES, t(), getDisplayLabel, getSpeakLabel, setLanguage, updateUIStrings, updateLanguageButtons)
        grammar.js         (grammar engine EN + ES, applyGrammar, pluralize, verb forms)
        tts.js             (initSpeech, speak, getVoice, populateVoiceSelect, haptic, SPEAK_OVERRIDES)
        predictions.js     (PREDICTIONS, bigram model, resolvePredictions, renderPredictions, auto-speak)
        usage.js           (usage tracking, daily counts, word frequencies, streak, save/load)
        grid.js            (renderGrid, renderCoreStrip, createCell, grid delegation, image preview, landscape optimization)
        message-bar.js     (addWordToMessage, renderMessage, message delegation, word search)
        word-picker.js     (openWordPicker, renderWordPickerList, closeWordPicker)
        insights.js        (renderInsights, exportUsageCSV)
        navigation.js      (switchTab, getTabViewMap, updateBackButton)
        settings.js        (parent mode, sensory prefs, settings UI, accordions, grid size, child name)
        activities.js      (activity system, ACTIVITY_BUNDLES, STARTER_WORDS, start/end activity, position allocation, activity export/import)
        guided-vocab.js    (STEP_VOCAB_MAP, guided mode, step rendering, modeling prompts)
        create-activity.js (create activity modal, walkthrough UI, smart suggestions)
        routines.js        (routine CRUD, start/advance/end routine, routine UI)
        edit-modal.js      (edit button modal, color swatches, image upload, custom shows)
        folder-reorder.js  (reorder overlay, drag/drop)
        export-import.js   (board export/import, folder export, import preview/apply)
        onboarding.js      (Onboarding object, grid picker, coach marks)
        pwa.js             (PWA install banner, service worker registration)
        app.js             (init, finalizeInit, entry point)

## Phased Extraction Order

### Phase 1: CSS Extraction

**Goal:** Extract all CSS into separate files. Zero JS changes. Lowest risk.

**Step 1A: Create css/ directory and tokens.css**
- Extract lines 14-118 (root variables, resets, body styles) into css/tokens.css
- Add link rel="stylesheet" tag in head
- Remove extracted CSS from inline style tag
- Verify app renders identically

**Step 1B: Extract remaining CSS files (one at a time)**
- css/app-chrome.css (header, tab bar, views, FAB, back/export buttons)
- css/grid.css (grid, cells, folders, prediction bar, core strip, grid sizes)
- css/message-bar.css (message bar, bar buttons)
- css/modals.css (word picker, edit, add show, search, symbol search, reorder, color swatches)
- css/settings.css (settings panel, accordion, export/import, PWA banner, getting started, voice sliders)
- css/activities.css (activity banner, cards, preview, create, walkthrough, guided vocab)
- css/onboarding.css (onboarding steps, grid picker, coach marks)
- css/insights.css (insights view)
- css/responsive.css (media queries, landscape, safe areas, sensory)
- css/ui-shared.css (toast, visually-hidden, bilingual labels)

**Step 1C: Update sw.js cache list**
- Add all css/*.css files to the cache list
- Bump cache version

**Acceptance Criteria (Phase 1):**
- [ ] All CSS extracted from inline style tag
- [ ] index.html style tag is empty or removed
- [ ] App renders identically in browser
- [ ] App renders identically in Capacitor simulator
- [ ] Lighthouse scores unchanged
- [ ] Service worker caches all CSS files
- [ ] Offline mode works

### Phase 2: Extract Pure Data Modules

**Goal:** Extract the large data constants that have zero dependencies. These are the safest to move.

**Step 2A: Create js/ directory and js/state.js**
- Create window.AAC namespace
- Move all global state variables (buttons, currentFolder, parentMode, etc.) into state.js
- Replace bare variable references with AAC.state.* in remaining inline JS
- This is the largest refactor step -- every function referencing these variables must be updated

WARNING: This step has the most risk. Consider extracting state.js but keeping it as a script tag that simply sets window-level variables initially, deferring the namespace refactor until later phases. That way the variable names stay the same during extraction.

**Step 2B: Extract js/vocabulary.js**
- Move CORE_WORD_DEFS, all HOME_GRID_*_FOLDERS, HOME_GRID_6X6_EXTRAS, THREE_BY_THREE_FOLDERS, FOUR_BY_FOUR_FOLDERS, DEFAULT_BUTTONS, VOCAB_WORD_POOL, WORD_EXPANSION, ACTIVITY_TEMPLATES, STEP_VOCAB_MAP, FOLDER_ICONS, BUTTON_ICONS
- These are pure data arrays/objects with no function calls
- Expose on window (window.CORE_WORD_DEFS = [...], etc.) or window.AAC.vocab namespace

**Step 2C: Update sw.js cache list**
- Add js/state.js and js/vocabulary.js
- Bump cache version

**Acceptance Criteria (Phase 2):**
- [ ] State variables accessible from all existing functions
- [ ] All vocabulary data constants load correctly
- [ ] Grid renders with correct buttons
- [ ] All grid sizes work (1x1 through 6x6)
- [ ] Activity templates populate correctly
- [ ] Service worker caches new JS files

### Phase 3: Extract Core Infrastructure Modules

**Goal:** Extract modules that many others depend on: storage, i18n, grammar, TTS.

**Step 3A: Extract js/ui-shared.js**
- Move showToast(), escapeHtml()
- These are small utility functions with minimal deps

**Step 3B: Extract js/storage.js**
- Move openDB(), loadButtons(), saveButtons(), saveButton(), deleteButton()
- Move saveImage(), loadImage(), deleteImage(), getImageCacheCount(), clearImageCache(), clearAllData()
- Move getGridSize(), setGridSize(), isEarlyLearnerGrid(), getTemplate(), getEarlyLearnerTemplate()
- Move getAllVocabWords(), getPickerWords(), CHOOSER_PRESETS
- Move customImageCache functions
- Depends on state and ui-shared

**Step 3C: Extract js/i18n.js**
- Move getLangEs(), _buildLangEs(), t(), getDisplayLabel(), getSpeakLabel(), getPrimaryLabel(), getSecondaryLabel()
- Move getCustomEsLabels(), setLanguage(), updateLanguageButtons(), updateUIStrings()
- Depends on state

**Step 3D: Extract js/grammar.js**
- Move PLURAL_OVERRIDES, pluralize(), VERB_FORMS, GRAMMAR_EN, GRAMMAR_ES, getGrammarEngine(), applyGrammar()
- Move spanishPluralize(), grammarEnabled(), getWordCategory()
- Depends on state, i18n

**Step 3E: Extract js/tts.js**
- Move voices array, initSpeech(), getUSVoices(), getESVoices(), getActiveVoices(), populateVoiceSelect(), pickDefaultVoice(), getVoice()
- Move SPEAK_OVERRIDES, getSpeakOverrides(), speak(), haptic()
- Depends on state, i18n, grammar

**Step 3F: Update sw.js cache list and bump version**

**Acceptance Criteria (Phase 3):**
- [ ] IndexedDB operations work (save, load, delete buttons and images)
- [ ] Language switching works (English, Spanish, Both)
- [ ] TTS speaks correctly in both languages
- [ ] Grammar features work (plurals, verb forms, articles)
- [ ] Toast notifications display
- [ ] Offline mode works with updated cache

### Phase 4: Extract Feature Modules

**Goal:** Extract the remaining functional modules one at a time.

**Step 4A: js/predictions.js**
- Bigram model, prediction ranking, renderPredictions, auto-speak

**Step 4B: js/usage.js**
- Usage tracking, daily counts, word frequencies, save/load

**Step 4C: js/grid.js**
- renderGrid, renderCoreStrip, createCell, grid delegation, image preview, landscape optimization

**Step 4D: js/message-bar.js**
- addWordToMessage, renderMessage, message delegation, word search

**Step 4E: js/word-picker.js**
- Word picker modal logic

**Step 4F: js/insights.js**
- Insights rendering, CSV export

**Step 4G: js/navigation.js**
- switchTab, getTabViewMap, updateBackButton, view switching wrappers

**Step 4H: js/settings.js**
- Parent mode, sensory preferences, settings UI, accordions, sliders, child name
- This is the largest single extraction by function count

**Step 4I: js/activities.js**
- Activity system, ACTIVITY_BUNDLES, STARTER_WORDS, position allocation
- Activity export/import

**Step 4J: js/guided-vocab.js**
- Guided vocabulary stories, step vocab map, modeling prompts

**Step 4K: js/create-activity.js**
- Create activity modal, walkthrough UI, smart suggestions

**Step 4L: js/routines.js**
- Routine CRUD, start/advance/end, render

**Step 4M: js/edit-modal.js**
- Edit button modal, color swatches, image upload, custom shows

**Step 4N: js/folder-reorder.js**
- Folder reorder overlay, drag/drop

**Step 4O: js/export-import.js**
- Board export/import, folder export, import preview/apply

**Step 4P: js/onboarding.js**
- Onboarding object, grid picker, coach marks

**Step 4Q: js/pwa.js**
- PWA install banner, service worker registration

**Step 4R: js/app.js**
- init(), finalizeInit(), entry point call

**Step 4S: Update sw.js cache list (final)**
- Add all js/*.css files
- Bump cache version
- Verify all files cached for offline

**Acceptance Criteria (Phase 4):**
- [ ] Each module extracts cleanly with zero regression
- [ ] All features work: grid, predictions, TTS, grammar, activities, routines, guided vocab, search, edit, export/import, insights, onboarding, settings, reorder, PWA install
- [ ] All grid sizes work (1x1 through 6x6)
- [ ] Bilingual mode works
- [ ] Activity templates and bundles load correctly
- [ ] Board import/export works with images
- [ ] Onboarding flow works for new users
- [ ] Offline mode works
- [ ] Lighthouse 90+ all categories

### Phase 5: Cleanup and Validation

**Step 5A: Remove inline script tag from index.html**
- Verify no JS remains inline
- index.html should contain only HTML structure and link/script tags

**Step 5B: Update Capacitor www/ sync script**
- The npm sync script must now copy css/ and js/ directories into www/
- Verify cap sync copies all files
- Test in iOS simulator

**Step 5C: Update Guiding Steps sync**
- If Guiding Steps app shares any CSS modules, document which files to copy
- Update its www/ sync script

**Step 5D: Full regression test**
- Browser: Chrome, Safari, Firefox
- iOS Simulator: iPhone, iPad
- Physical device if available
- Lighthouse audit
- Offline mode test

**Acceptance Criteria (Phase 5):**
- [ ] index.html contains zero inline CSS or JS
- [ ] Capacitor www/ contains all required files
- [ ] iOS simulator build succeeds and all features work
- [ ] Lighthouse 90+ all categories
- [ ] Offline mode fully functional
- [ ] No console errors

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Circular dependencies between modules | High | Breaks app | Use window namespace for cross-cutting concerns; avoid import chains |
| Script load order bugs | Medium | Runtime errors | Use defer attribute; test each extraction individually |
| Service worker not caching new files | High | Broken offline | Update sw.js cache list with every new file; bump version |
| Capacitor www/ sync misses files | Medium | iOS app broken | Update sync script in each phase; verify after cap sync |
| Global variable name collisions | Low | Subtle bugs | Keep current variable names during extraction; refactor to namespace later |
| WKWebView ES module support issues | Low | iOS app broken | Fallback to script tags with defer if ES modules cause issues |
| Performance regression from many HTTP requests | Medium | Slower load | All files are small; HTTP/2 multiplexing mitigates; consider concatenation script if needed |
| Stale CSS/JS cached by service worker | High | Users see old version | Always bump cache version; network-first strategy handles this |
| Breaking changes during multi-session work | Medium | Lost progress | Document completed steps in ModularizationPlan_Notes.md after each extraction |

## Capacitor Compatibility Notes

- Capacitor webDir is "www/" -- the sync script must copy index.html, manifest.json, css/, and js/ directories
- WKWebView supports ES modules (Safari 10.1+, iOS 16+) -- our minimum target
- Service worker is disabled in Capacitor -- file caching is not relevant for iOS native app
- All file paths must be relative (./css/tokens.css, ./js/state.js) for both browser and Capacitor serving
- No absolute paths or CDN URLs for module files

## Service Worker Cache Strategy

Every new file added during extraction must be added to the sw.js CACHE_URLS array. The current pattern:

    const CACHE_NAME = 'aac-board-vNN';
    const CACHE_URLS = [
      './',
      './index.html',
      './manifest.json',
      './css/tokens.css',
      './css/grid.css',
      // ... all CSS and JS files
    ];

Bump the cache version number after each phase (not each step -- that would be too many).

## Workflow and Tooling Adaptations

The existing validation scripts, sync tooling, and agent workflows assume a monolithic single-file app. These must be updated as part of the modularization -- not deferred to Phase 5. Each adaptation below specifies WHEN it must happen during the phased rollout.

### 1. Console.log Scanner (.scripts/check-console-logs.sh)

**Current behavior:** Only scans index.html and guiding-steps/index.html.
**Problem:** After JS extraction, console.log statements in js/*.js files will not be caught.
**When to update:** Phase 2 Step 2A (first JS file extraction).
**Change:** Add js/*.js glob scan alongside index.html.

    # Add after the existing for loop:
    for file in js/*.js; do
      # same grep logic
    done

### 2. JS Syntax Validator (.scripts/check-html-syntax.sh)

**Current behavior:** Extracts JS from inline script tags via regex, validates with new Function().
**Problem:** Standalone .js files have no script tags to extract from. The validator will report "WARNING: No script blocks found" or skip entirely.
**When to update:** Phase 2 Step 2A (first JS file extraction).
**Change:** Add a second pass that runs Node syntax check directly on each js/*.js file.

    # For standalone JS files:
    node --check js/state.js
    node --check js/vocabulary.js
    # etc.

The inline script tag check should remain active until Phase 5 (when all JS is extracted). During the transition, both checks run.

### 3. Sync Script (npm run sync / package.json)

**Current behavior:** cp index.html manifest.json www/ && npx cap sync
**Problem:** After extraction, www/ will be missing css/ and js/ directories. Capacitor will serve an empty app.
**When to update:** Phase 1 Step 1A (first CSS file extraction).
**Change:** Update to copy directories:

    mkdir -p www/css www/js && cp index.html manifest.json sw.js www/ && cp -r css/ www/css/ && cp -r js/ www/js/ && npx cap sync

Update incrementally -- add css/ copy in Phase 1, add js/ copy in Phase 2.

### 4. Sync Check (.scripts/check-www-sync.sh)

**Current behavior:** Diffs index.html and manifest.json between root, www/, and ios/public/.
**Problem:** Does not check css/ or js/ directories.
**When to update:** Phase 1 Step 1C (after CSS extraction complete).
**Change:** Add directory-level sync checks:

    # After existing file checks, add:
    for file in css/*.css; do
      check_sync "$file" "www/$file" "www/$file vs root"
    done
    # Same for js/*.js in Phase 2+

### 5. Service Worker Cache Validation (NEW CHECK)

**Current behavior:** No automated check exists. Forgetting a file in sw.js ASSETS silently breaks offline mode.
**Problem:** This is the highest-risk operational failure in the modularization.
**When to create:** Phase 1 Step 1C (before first deploy with extracted files).
**New script:** .scripts/check-sw-cache.sh

    Purpose: Compare files on disk (css/*.css, js/*.js, index.html, manifest.json)
    against the ASSETS array in sw.js. Flag any file that exists on disk but
    is missing from the cache list. Also flag any cache entry that points to
    a file that does not exist.

This check should be added to the /validate skill as Step 1.5 (between console.log scan and JS syntax check) and to the pre-commit hook.

### 6. /validate Skill (.claude/skills/validate/SKILL.md)

**When to update:** Phase 1 Step 1C.
**Changes:**
- Add Step 1.5: SW cache integrity check (run .scripts/check-sw-cache.sh)
- Step 1 (console.log scan): no change needed until Phase 2
- Step 2 (JS syntax): no change needed until Phase 2
- Step 3 (sync check): automatically covered when check-www-sync.sh is updated

### 7. /deploy Skill (.claude/skills/deploy/SKILL.md)

**When to update:** Phase 1 Step 1C.
**Changes:**
- Pre-flight validation: add SW cache check to the validation steps
- Sync step: will automatically use updated npm run sync

### 8. Steve (Code Reviewer) Workflow Adaptation

**Current behavior:** Steve reviews staged/committed changes in single files.
**After modularization:** Changes span multiple files for any feature work.
**Adaptation:**
- Steve should review cross-file function references when a function is moved (verify no dangling references in source file, verify all callers updated)
- Steve should verify sw.js ASSETS updated when new files are added
- Steve should verify sync script and check-www-sync.sh updated when new files added
- Steve should check load order in index.html script tags matches dependency graph

### 9. QA Test Runner (run-qa.mjs)

**Current behavior:** Serves files from repo root with a basic HTTP server, loads qa-tests.html.
**After modularization:** Already works -- it serves any file requested from the root directory, including css/ and js/ subdirectories. The MIME map already includes .css and .js. No changes needed.

### 10. Pre-commit Hook (.scripts/pre-commit)

**When to update:** Phase 1 Step 1C.
**Change:** Add SW cache check to pre-commit hook so missing cache entries block commits.

### Agent Workflow Summary by Phase

**Phase 0 (Before any extraction):**
- [x] Create rollback tag (pre-modularization) -- DONE
- [ ] Create .scripts/check-sw-cache.sh
- [ ] Update /validate skill to include SW cache check
- [ ] Update pre-commit hook to include SW cache check

**Phase 1 (CSS extraction):**
- [ ] Update npm run sync to copy css/ directory
- [ ] Update check-www-sync.sh to verify css/ files
- [ ] Update /deploy skill pre-flight checks
- [ ] Add css/*.css to sw.js ASSETS
- [ ] Run /validate after each step

**Phase 2 (JS data modules):**
- [ ] Update npm run sync to copy js/ directory
- [ ] Update check-www-sync.sh to verify js/ files
- [ ] Update check-console-logs.sh to scan js/*.js
- [ ] Update check-html-syntax.sh to validate standalone .js files
- [ ] Add js/*.js to sw.js ASSETS
- [ ] Run /validate after each step

**Phases 3-4 (Infrastructure + Feature modules):**
- [ ] Each extraction step: run /validate
- [ ] Each phase end: update sw.js ASSETS, bump cache version
- [ ] Steve reviews each extraction for dangling references

**Phase 5 (Cleanup):**
- [ ] Remove inline script tag check from syntax validator (or keep as safety net)
- [ ] Final sw.js ASSETS audit
- [ ] Full /validate pass
- [ ] Capacitor build and simulator test

## Estimated Effort

| Phase | Estimated Effort | Risk Level |
|-------|-----------------|------------|
| Phase 0: Tooling Adaptation | 1 session | Low |
| Phase 1: CSS Extraction | 2-3 sessions | Low |
| Phase 2: Data Modules | 1-2 sessions | Low-Medium |
| Phase 3: Core Infrastructure | 3-4 sessions | Medium |
| Phase 4: Feature Modules | 5-7 sessions | Medium-High |
| Phase 5: Cleanup and Validation | 1-2 sessions | Low |
| **Total** | **13-19 sessions** | |

## Dependencies on Other Plans

- **AppSplit.md**: Schedule and Rewards are already removed from AAC Board. This plan covers the post-split AAC Board only.
- **iOSAppConversion.md**: The www/ sync script and Capacitor config must be updated during Phase 5. No Capacitor code changes needed during Phases 1-4.
- **Service Worker (sw.js)**: Must be updated with new file lists after each phase.

## Decision Log

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Module approach | Window namespace (window.AAC.*) over ES modules | Avoids circular dependency issues without a bundler; simpler debugging; Capacitor compatible |
| CSS approach | Separate files via link tags | Simple, standard, no tooling needed |
| HTML extraction | Keep HTML in index.html | HTML is only ~670 lines; extracting requires template loading complexity |
| Load order | defer script tags in dependency order | Standard browser behavior; predictable execution order |
| State management | Shared mutable globals on window.AAC.state | Current pattern is already global; namespace organizes without refactoring every function signature |
| Phase order | CSS first, then data, then infrastructure, then features | Lowest risk first; CSS extraction has zero JS impact |
