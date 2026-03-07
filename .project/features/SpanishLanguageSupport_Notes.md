# Spanish Language Support - Implementation Notes

## Status: PLANNING -- awaiting approval

## Review Feedback Incorporated

Steve (Code Review) and Robert (Architecture) reviewed the plan. Key changes made:

1. LANG_ES namespace object replaces 7+ separate top-level constants
2. currentLang cached in module variable (not localStorage per render)
3. t(key, fallback) function for all UI strings (React Native portable)
4. Strategy pattern for grammar engines (GRAMMAR_EN / GRAMMAR_ES)
5. Phase order swapped: Grid Display (Phase 2) before Speech (Phase 3) for visual verification
6. Phase 5 split into 5a (JS strings), 5b (static HTML/CSS), 5c (schedule/reward)
7. Phase 7 added: Edit Modal Language Awareness
8. Exhaustive string inventory added to plan
9. Custom button handling clarified (isCustomized detection, aac-custom-es-labels)
10. Language selection added to first-run grid picker
11. Message bar clears on language switch (mixed-language out of scope)
12. Double-tap pluralization handler must use getGrammarEngine()
13. CSS content: strings addressed via .lang-es class
14. All 280 translations must be reviewed by native Spanish speaker

## Implementation Checklist

### Phase 1: Language Infrastructure and Settings
- [ ] LANG_ES namespace object (empty shell)
- [ ] currentLang cached variable and setLanguage() function
- [ ] t(key, fallback) translation function
- [ ] 'aac-language' localStorage key
- [ ] Language toggle in settings panel
- [ ] Language selection in first-run grid picker
- [ ] setLanguage() clears message bar, re-renders, updates html lang

### Phase 2: Grid Display
- [ ] Populate LANG_ES.labels for all ~280 default buttons
- [ ] renderGrid() -> createCell() uses getDisplayLabel()
- [ ] renderCoreStrip() uses getDisplayLabel()
- [ ] addWordToMessage() uses active language label
- [ ] Prediction chip rendering uses active language
- [ ] Folder label display uses getDisplayLabel()
- [ ] Search results use getDisplayLabel()
- [ ] Bilingual CSS (stacked labels, font-size clamp for 6x6)

### Phase 3: Speech Output
- [ ] Spanish voice filtering (es-MX / es-ES)
- [ ] Spanish voice selector in settings
- [ ] LANG_ES.speakOverrides
- [ ] speak() uses getSpeakLabel() with correct voice
- [ ] renderCoreStrip() speak call uses getSpeakLabel()
- [ ] Primary speech language toggle for bilingual mode

### Phase 4: Spanish Grammar (Strategy Pattern)
- [ ] Refactor English grammar into GRAMMAR_EN object
- [ ] GRAMMAR_ES object (pluralize, conjugate, insertArticle, apply)
- [ ] ES verb forms map (~30 verbs)
- [ ] ES noun gender map
- [ ] applyGrammar() dispatches via getGrammarEngine()
- [ ] Double-tap pluralization uses getGrammarEngine().pluralize()

### Phase 5a: UI Strings -- JS-Generated
- [ ] LANG_ES.uiStrings map populated
- [ ] All toast() messages use t()
- [ ] TAB_VIEW_MAP titles use t()
- [ ] 9 confirm() dialogs use t()
- [ ] Dynamic progress/done text uses t()

### Phase 5b: UI Strings -- Static HTML and CSS
- [ ] updateUIStrings() function
- [ ] Static HTML text translated (empty states, settings, modals)
- [ ] Grid picker titles/descriptions translated
- [ ] ARIA labels updated via JS
- [ ] CSS content: strings via .lang-es class override

### Phase 5c: Schedule and Reward Labels
- [ ] 28 schedule activity translations
- [ ] 6 schedule category translations
- [ ] 15+ task image label translations
- [ ] Reward tracker UI text translations

### Phase 6: ARASAAC and Symbol Search
- [ ] Language-aware ARASAAC search endpoint
- [ ] LANG_ES.symbolKeywords populated
- [ ] Symbol picker uses active language
- [ ] Auto-download uses Spanish keywords in Spanish mode

### Phase 7: Edit Modal Language Awareness
- [ ] Dual label fields (English/Spanish) in edit modal
- [ ] aac-custom-es-labels localStorage for custom Spanish labels
- [ ] Save logic handles both label fields
- [ ] isCustomized() detection for default vs custom buttons

## Issues and Resolutions
(none yet)

## Deviations from Plan
(none yet)
