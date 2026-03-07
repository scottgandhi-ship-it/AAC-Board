# Spanish Language Support (Milestone 3.3)

## Executive Summary

Add bilingual (English/Spanish) support to the AAC Board. Users can switch the entire board to Spanish, or display both languages on buttons simultaneously. This includes Spanish speech output, translated vocabulary (~280 buttons), Spanish grammar rules, translated UI strings, Spanish ARASAAC symbol search, and translated schedule activities.

## Requirements

1. Language toggle in settings: English, Spanish, or Bilingual (both labels shown)
2. Spanish speech output via Web Speech API (es-MX preferred, es-ES fallback)
3. All ~280 default vocabulary buttons translated to Spanish
4. Spanish grammar engine (verb conjugation, plurals, articles)
5. Spanish prediction chains for core words
6. Bilingual mode shows both languages on each button (English primary, Spanish secondary or vice versa)
7. Schedule activity labels translated to Spanish
8. UI strings (settings labels, toasts, tab names, modal titles, confirm dialogs, aria-labels, CSS content strings) translated
9. ARASAAC symbol search uses Spanish API endpoint when in Spanish mode
10. Offline-capable: all translations bundled in index.html, no network needed

## Architecture Overview

### Translation Strategy: LANG_ES Namespace Object

Bundle all Spanish-specific data into a single namespace object. This establishes a "language pack" pattern for future expansion (LANG_FR, LANG_PT, etc.) and keeps the code organized in a single clear section.

    const LANG_ES = {
      labels: {
        'core-i': 'yo',
        'core-want': 'quiero',
        'core-dont-want': 'no quiero',
        'core-more': 'mas',
        'core-help': 'ayuda',
        'folder-food': 'Comida',
        'food-apple': 'manzana',
        ...
      },
      speakOverrides: { ... },
      verbForms: {
        'querer': { yo: 'quiero', third: 'quiere', past: 'quiso' },
        ...
      },
      pluralOverrides: { ... },
      nounGender: { 'food-apple': 'f', ... },
      uncountable: new Set([...]),
      uiStrings: { ... },
      symbolKeywords: { 'core-i': 'yo', ... }
    };

This approach:
- Keeps button IDs stable (motor planning preserved)
- Keeps positions unchanged (critical AAC principle)
- Allows bilingual display without structural changes
- Works with existing bigram/prediction system (keyed by ID, not label)
- Single insertion point for future languages
- Clear what constitutes a "language pack"

### Language Setting

    localStorage key: 'aac-language'
    Values: 'en' (default), 'es', 'both'

**Cached in a module-level variable** (not read from localStorage per render):

    let currentLang = localStorage.getItem('aac-language') || 'en';

    function setLanguage(lang) {
      currentLang = lang;
      localStorage.setItem('aac-language', lang);
      document.documentElement.lang = (lang === 'es') ? 'es' : 'en';
      messageWords = [];
      renderMessageBar();
      renderGrid();
      renderCoreStrip();
      updateUIStrings();
    }

This follows the existing pattern used by selectedVoiceName, speechPitch, etc.

### UI String Translation: t() Function

Introduce a simple translation function for all UI strings. This pattern maps directly to React Native i18n libraries for the future iOS port.

    function t(key, fallback) {
      if (currentLang === 'en') return fallback;
      return LANG_ES.uiStrings[key] || fallback;
    }

Usage: t('tab.talk', 'Talk') instead of raw string literals everywhere.

### Display Logic

    function getDisplayLabel(button) {
      const esLabel = LANG_ES.labels[button.id];
      if (currentLang === 'en') return button.label;
      if (currentLang === 'es') return esLabel || button.label;
      if (currentLang === 'both') return button.label + '\n' + (esLabel || '');
    }

### Custom Button Handling

**Critical concern from review**: When a user customizes a default button's English label, `getDisplayLabel()` must respect that customization.

Detection:

    function isCustomized(btn) {
      const defaultBtn = DEFAULT_BUTTONS.find(d => d.id === btn.id);
      return defaultBtn && btn.label !== defaultBtn.label;
    }

Rules:
- Default buttons: show LANG_ES.labels translation in Spanish mode
- Customized default buttons: show customized label (user's choice) unless a custom Spanish label exists
- Fully custom buttons: show btn.label (no auto-translation)

**Custom Spanish labels**: Store in localStorage as 'aac-custom-es-labels' (a JSON map of buttonId -> Spanish label). The edit modal shows both "English label" and "Spanish label" fields when language is 'es' or 'both'.

### Speech Output

    function getSpeakLabel(button) {
      if (currentLang === 'en') return button.label;
      return LANG_ES.labels[button.id] || button.label;
    }

Voice selection changes:
- Current: filters to en-US voices only
- New: when lang is 'es' or 'both', filter to es-MX or es-ES voices
- Add Spanish voice selector (separate from English voice)
- In bilingual mode, speak in the "primary" language (user-configurable)

### Grammar Engine: Strategy Pattern

Use separate grammar engine objects per language instead of branching inside applyGrammar(). Each language is self-contained and testable independently. Maps cleanly to React Native modules for iOS port.

    const GRAMMAR_EN = {
      pluralize(word) { ... },    // existing English rules
      conjugate(verb, context) { ... },
      insertArticle(noun, context) { ... },
      apply(words, btnIds) { ... }
    };

    const GRAMMAR_ES = {
      pluralize(word) { ... },    // Spanish rules: vowel+s, consonant+es, z->ces
      conjugate(verb, context) { ... },  // yo/third/past forms
      insertArticle(noun, context) { ... },  // el/la/un/una with gender
      apply(words, btnIds) { ... }
    };

    function getGrammarEngine() {
      return currentLang === 'es' ? GRAMMAR_ES : GRAMMAR_EN;
    }

Then applyGrammar() becomes a one-liner dispatch. The double-tap pluralization handler (line 5118) must also use getGrammarEngine().pluralize().

**Spanish grammar rules:**

**Plurals:**
- Words ending in vowel: add -s (manzana -> manzanas)
- Words ending in consonant: add -es (animal -> animales)
- Words ending in -z: change to -ces (lapiz -> lapices)
- Irregular overrides map

**Verb conjugation:**
- Spanish verbs conjugate for all persons
- For AAC simplicity: only conjugate for yo (1st person) and el/ella (3rd person)
- Store: { infinitive, yo, third, past }

**Articles:**
- Spanish articles are gendered: el/la (definite), un/una (indefinite)
- Each noun needs a gender marker stored in LANG_ES.nounGender

### ARASAAC Integration

ARASAAC is a Spanish project with excellent Spanish support:
- Current endpoint: /v1/pictograms/en/search/{keyword}
- Spanish endpoint: /v1/pictograms/es/search/{keyword}
- Switch based on language setting
- Symbol picker search uses active language
- Auto-download uses LANG_ES.symbolKeywords for Spanish keyword mapping

### Predictions

Current PREDICTIONS map uses button IDs (not labels), so it works across languages automatically. No structural changes needed -- predictions resolve to the correct label at render time.

## Exhaustive String Inventory

Before coding, every hardcoded English string must be catalogued. Categories:

### JS-generated strings (~30+ toast messages, dynamic text)
- All toast() calls (30+ unique messages)
- TAB_VIEW_MAP titles: 'Talk', 'Schedule', 'Rewards', 'Insights'
- Progress text: 'Step X of Y'
- Done message: 'Great job finishing...'
- Error messages in catch blocks

### Static HTML strings (~30+ in markup)
- Line 2938: "No schedule for today"
- Line 2939: "Unlock parent mode to start one"
- Line 2945: "All Done!"
- Line 2962: "No reward tracks yet"
- Line 2963: "Unlock parent mode to create one"
- Line 3037: "Tap any button on the board to edit it..."
- Line 3058: "Changing grid size resets buttons to defaults..."
- Lines 3298-3299, 3307-3318: Grid picker titles and descriptions
- Settings section headers and labels
- Modal titles and button text
- These require DOM manipulation at load time via updateUIStrings()

### CSS content strings
- Line 763: content: 'Type to search all words...'
- Strategy: use CSS custom properties or class-swap approach
- Add .lang-es class to html element, override content in CSS

### Confirm dialogs (9 total)
- Lines 5431, 5538, 5547, 5554, 5659, 6272, 6425, 7249, 7400
- Native browser dialogs -- translate the text argument

### ARIA labels (static in HTML)
- Lines 2897, 2901, 2911, 2915-2918, 2958, 3141, 3297, 3301, etc.
- Must update via JS on language change

### Schedule/Reward labels
- 28 DEFAULT_SCHEDULE_ACTIVITIES (6 categories)
- 15+ DEFAULT_TASK_IMAGES labels
- Reward track UI text

## Task Breakdown

### Phase 1: Language Infrastructure and Settings
- Add LANG_ES namespace object (empty initially, populated in later phases)
- Add currentLang cached variable and setLanguage() function
- Add t(key, fallback) translation function
- Add 'aac-language' localStorage key
- Add language toggle to settings panel (English / Spanish / Bilingual)
- Add language selection to first-run grid picker modal
- setLanguage() clears message bar, triggers full re-render, updates html lang attribute
- Acceptance: language setting persists, t() returns correct value, setLanguage() re-renders

### Phase 2: Grid Display (visual verification before speech)
- Populate LANG_ES.labels for all ~280 default buttons
- Update renderGrid() -> createCell() to use getDisplayLabel() (line 5090)
- Update renderCoreStrip() to use getDisplayLabel() (line 4461)
- Update addWordToMessage() to use active language label (line 5106)
- Update prediction chip rendering to show labels in active language
- Update folder label display (line 4483)
- Update search results to use getDisplayLabel() (line 5232)
- Bilingual mode: show both labels on buttons (primary larger, secondary smaller)
- CSS for bilingual button layout (stacked labels, font-size clamp for 6x6 grids)
- Acceptance: switching language updates all visible buttons immediately

### Phase 3: Speech Output
- Add Spanish voice filtering (es-MX preferred, es-ES fallback)
- Add separate Spanish voice selector in settings
- Add LANG_ES.speakOverrides
- Update speak() to use getSpeakLabel() and correct voice based on currentLang
- Update renderCoreStrip() speak call (line 4463) to use getSpeakLabel()
- In bilingual mode: speak in primary language (default: English)
- Add "Primary speech language" toggle for bilingual mode
- Acceptance: tapping a button speaks the word in the correct language

### Phase 4: Spanish Grammar (Strategy Pattern)
- Refactor existing English grammar into GRAMMAR_EN object
- Create GRAMMAR_ES object with:
  - spanishPluralize() (vowel+s, consonant+es, z->ces, overrides)
  - Spanish verb conjugation (yo/third/past for ~30 common verbs)
  - Spanish article insertion (el/la/un/una with noun gender)
  - ES uncountable nouns set
- Update applyGrammar() to dispatch via getGrammarEngine()
- Update double-tap pluralization handler (line 5118) to use getGrammarEngine().pluralize()
- Acceptance: "mas" + noun pluralizes in Spanish; "el/ella" + verb conjugates

### Phase 5a: UI Strings -- JS-Generated
- Populate LANG_ES.uiStrings map
- Replace all toast() message strings with t() calls
- Replace TAB_VIEW_MAP titles with t() calls
- Replace confirm() dialog strings with t() calls (9 dialogs)
- Replace dynamic progress/done text with t() calls
- Acceptance: all JS-generated text appears in Spanish when language set to 'es'

### Phase 5b: UI Strings -- Static HTML and CSS
- Create updateUIStrings() function called by setLanguage() and on DOMContentLoaded
- Translate all static HTML text (empty states, settings labels, modal titles, button text)
- Translate grid picker titles and descriptions
- Update ARIA labels via JS on language change
- Handle CSS content: strings via .lang-es class override or CSS custom property
- Acceptance: all static text appears in Spanish; screen reader reads Spanish content

### Phase 5c: Schedule and Reward Labels
- Add Spanish translations for 28 DEFAULT_SCHEDULE_ACTIVITIES
- Add Spanish translations for 6 schedule category names
- Add Spanish translations for 15+ DEFAULT_TASK_IMAGES labels
- Translate reward tracker UI text
- Acceptance: schedule and reward views fully in Spanish

### Phase 6: ARASAAC and Symbol Search
- Update ARASAAC search endpoint to use language-appropriate path
- Populate LANG_ES.symbolKeywords for Spanish search terms
- Symbol picker search uses active language for API queries
- Auto-download uses LANG_ES.symbolKeywords when in Spanish mode
- Acceptance: symbol search returns Spanish-labeled results in Spanish mode

### Phase 7: Edit Modal Language Awareness
- In Spanish/bilingual mode, edit modal shows both "English label" and "Spanish label" fields
- For default buttons: English label shows btn.label, Spanish label shows LANG_ES.labels[id]
- For custom buttons: Spanish label stored in aac-custom-es-labels (localStorage)
- Saving updates appropriate label based on which field was changed
- Acceptance: editing a button in Spanish mode shows and saves both labels correctly

## Integration Points

- **Storage**: New localStorage keys: 'aac-language', 'aac-custom-es-labels'. No IndexedDB schema changes needed.
- **Service Worker**: No changes needed (sw.js caches index.html as before)
- **Predictions**: Already ID-based, works across languages
- **Data Tracking**: Usage logs record button IDs (language-agnostic). CSV export should include both English and Spanish labels when in bilingual mode.
- **Bigrams**: Already keyed by ID, language-agnostic
- **Motor Planning**: Positions never change. Language switch only changes labels.

## Accessibility Considerations

- ARIA labels must update to match active language (via updateUIStrings())
- lang attribute on html element switches (lang="en" vs lang="es")
- Screen readers will use the correct language pronunciation when lang is set
- Bilingual buttons need clear visual hierarchy (primary/secondary sizing)
- Touch targets unchanged (no layout shifts from language change)
- Must verify with VoiceOver and TalkBack that lang attribute changes pronunciation

## Known Limitations

- Message bar clears on language switch (mixing languages in one message is out of scope)
- Custom buttons are not auto-translated (user enters their own labels)
- Grammar coverage: core verbs only (~30), not full conjugation tables
- Bilingual text on 6x6 grids may require smaller font sizes
- Spanish grammar is more complex than English; keeping it simple for AAC context

## Risks

- Translation quality: all ~280 translations must be reviewed by a native Spanish speaker before shipping
- Some Spanish words are 20-30% longer than English; needs concrete CSS with clamp() for bilingual mode especially on 6x6 grids
- Web Speech API Spanish voice availability varies by device/OS
- CSS content: strings require class-swap approach (cannot translate with JS directly)
- Customized default buttons in bilingual mode may show mismatched labels (mitigated by Phase 7)

## Cross-Platform Readiness

The architecture decisions here are designed for future React Native / iOS migration:
- LANG_ES namespace -> becomes a separate language pack module
- t(key, fallback) -> maps to react-i18next or i18n-js
- GRAMMAR_EN / GRAMMAR_ES strategy pattern -> separate modules
- currentLang state -> React context or Zustand store
- Button IDs as canonical keys -> works in any framework
