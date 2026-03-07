# Spanish Language Support - Implementation Notes

## Status: PLANNING -- awaiting approval

## Implementation Checklist

### Phase 1: Translation Infrastructure
- [ ] ES_LABELS map for all ~280 default buttons
- [ ] getDisplayLabel() and getSpeakLabel() helpers
- [ ] 'aac-language' localStorage key
- [ ] Language toggle in settings panel

### Phase 2: Speech Output
- [ ] Spanish voice filtering (es-MX / es-ES)
- [ ] Spanish voice selector in settings
- [ ] ES_SPEAK_OVERRIDES
- [ ] Update speak() for language branching
- [ ] Primary speech language toggle for bilingual mode

### Phase 3: Grid Display
- [ ] renderGrid() uses getDisplayLabel()
- [ ] Core word strip uses getDisplayLabel()
- [ ] Message bar shows active language
- [ ] Prediction chips show active language
- [ ] Bilingual CSS (stacked labels)

### Phase 4: Spanish Grammar
- [ ] ES_PLURAL_OVERRIDES and spanishPluralize()
- [ ] ES_VERB_FORMS map (~30 verbs)
- [ ] ES_NOUN_GENDER map
- [ ] applyGrammar() language branching
- [ ] Spanish article insertion (un/una)

### Phase 5: UI Strings
- [ ] ES_UI_STRINGS map
- [ ] All UI text uses translation lookup
- [ ] Schedule activity translations (29 activities)
- [ ] Reward tracker text translations
- [ ] Settings / modal / toast translations

### Phase 6: ARASAAC and Symbol Search
- [ ] Language-aware ARASAAC search endpoint
- [ ] Symbol picker uses active language
- [ ] Auto-download keyword language

## Issues and Resolutions
(none yet)

## Deviations from Plan
(none yet)
