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
8. UI strings (settings labels, toasts, tab names, modal titles) translated
9. ARASAAC symbol search uses Spanish API endpoint when in Spanish mode
10. Offline-capable: all translations bundled in index.html, no network needed

## Architecture Overview

### Translation Strategy: Parallel Label Maps

Rather than duplicating the entire DEFAULT_BUTTONS array, use a translation map keyed by button ID:

    const ES_LABELS = {
      'core-i': 'yo',
      'core-want': 'quiero',
      'core-dont-want': 'no quiero',
      'core-more': 'mas',
      'core-help': 'ayuda',
      'folder-food': 'Comida',
      'food-apple': 'manzana',
      ...
    };

This approach:
- Keeps button IDs stable (motor planning preserved)
- Keeps positions unchanged (critical AAC principle)
- Allows bilingual display without structural changes
- Works with existing bigram/prediction system (keyed by ID, not label)

### Language Setting

    localStorage key: 'aac-language'
    Values: 'en' (default), 'es', 'both'

### Display Logic

    function getDisplayLabel(button) {
      const lang = localStorage.getItem('aac-language') || 'en';
      const esLabel = ES_LABELS[button.id];
      if (lang === 'en') return button.label;
      if (lang === 'es') return esLabel || button.label;
      if (lang === 'both') return button.label + '\n' + (esLabel || '');
    }

### Speech Output

    function getSpeakLabel(button) {
      const lang = localStorage.getItem('aac-language') || 'en';
      if (lang === 'en') return button.label;
      return ES_LABELS[button.id] || button.label;
    }

Voice selection changes:
- Current: filters to en-US voices only
- New: when lang is 'es' or 'both', filter to es-MX or es-ES voices
- Add Spanish voice selector (separate from English voice)
- In bilingual mode, speak in the "primary" language (user-configurable)

### Spanish Grammar Engine

Spanish grammar rules differ significantly from English:

**Plurals:**
- Words ending in vowel: add -s (manzana -> manzanas)
- Words ending in consonant: add -es (animal -> animales)
- Words ending in -z: change to -ces (lapiz -> lapices)
- Irregular overrides map

**Verb conjugation:**
- Spanish verbs conjugate for all persons, not just third person
- yo quiero, tu quieres, el/ella quiere, nosotros queremos, ellos quieren
- For AAC simplicity: only conjugate for yo (1st person) and el/ella (3rd person)
- Store: { infinitive, yo, third, past }

**Articles:**
- Spanish articles are gendered: el/la (definite), un/una (indefinite)
- Each noun needs a gender marker: { id: 'food-apple', gender: 'f' }
- Article rules more complex than English but important for natural speech

### ARASAAC Integration

ARASAAC is a Spanish project with excellent Spanish support:
- Current endpoint: /v1/pictograms/en/search/{keyword}
- Spanish endpoint: /v1/pictograms/es/search/{keyword}
- Switch based on language setting
- Symbol picker search uses active language

### Predictions

Current PREDICTIONS map uses button IDs (not labels), so it works across languages automatically. No structural changes needed -- predictions resolve to the correct label at render time.

For Spanish-specific prediction tuning, we could add an ES_PREDICTIONS override map, but the English prediction chains should work well initially since they are keyed by semantic ID (core-i -> core-want maps to yo -> quiero).

## Task Breakdown

### Phase 1: Translation Infrastructure
- Add ES_LABELS translation map for all ~280 default buttons
- Add getDisplayLabel() and getSpeakLabel() helper functions
- Add language setting to localStorage ('aac-language')
- Add language toggle to settings panel (English / Spanish / Bilingual)
- Acceptance: language setting persists, getDisplayLabel returns correct label

### Phase 2: Speech Output
- Add Spanish voice filtering (es-MX preferred, es-ES fallback)
- Add separate Spanish voice selector in settings
- Add ES_SPEAK_OVERRIDES (equivalent of SPEAK_OVERRIDES for Spanish)
- Update speak() to use correct voice based on language setting
- In bilingual mode: speak in primary language (default: English)
- Add "Primary speech language" toggle for bilingual mode
- Acceptance: tapping a button speaks the word in the correct language

### Phase 3: Grid Display
- Update renderGrid() to use getDisplayLabel()
- Update core word strip rendering to use getDisplayLabel()
- Update message bar to display words in active language
- Update prediction bar chips to show labels in active language
- Bilingual mode: show both labels on buttons (primary larger, secondary smaller)
- CSS for bilingual button layout (stacked labels, smaller font for secondary)
- Acceptance: switching language updates all visible buttons immediately

### Phase 4: Spanish Grammar
- Add ES_PLURAL_OVERRIDES map
- Add spanishPluralize() function
- Add ES_VERB_FORMS map (~30 common verbs with yo/third/past)
- Add ES_UNCOUNTABLE_NOUNS set
- Add noun gender map (ES_NOUN_GENDER: { buttonId: 'm' | 'f' })
- Update applyGrammar() to branch on language setting
- Spanish article insertion: un/una (respecting gender)
- Acceptance: "mas" + noun pluralizes in Spanish; "el/ella" + verb conjugates

### Phase 5: UI Strings
- Create ES_UI_STRINGS map for all hardcoded English text:
  - Tab labels: Talk/Schedule/Rewards -> Hablar/Horario/Premios
  - Settings section headers and labels
  - Modal titles (Edit Button, Add Button, etc.)
  - Toast messages
  - Confirmation dialogs
  - Voice select labels
  - Empty states
- Update all UI text rendering to use translation lookup
- Translate schedule activity labels (29 activities + 6 category names)
- Translate reward tracker UI text
- Acceptance: entire app reads in Spanish when language set to 'es'

### Phase 6: ARASAAC & Symbol Search
- Update ARASAAC search endpoint to use language-appropriate path
- Symbol picker search uses active language for API queries
- Auto-download uses language-appropriate search keywords
- Acceptance: symbol search returns Spanish-labeled results in Spanish mode

## Integration Points

- **Storage**: New localStorage key 'aac-language'. No IndexedDB changes.
- **Service Worker**: No changes needed (sw.js caches index.html as before)
- **Predictions**: Already ID-based, works across languages
- **Data Tracking**: Usage logs record button IDs (language-agnostic). CSV export should include both English and Spanish labels when in bilingual mode.
- **Bigrams**: Already keyed by ID, language-agnostic
- **Motor Planning**: Positions never change. Language switch only changes labels.

## Accessibility Considerations

- ARIA labels must update to match active language
- lang attribute on html element should switch (lang="en" vs lang="es" vs lang="en")
- Screen readers will use the correct language pronunciation when lang is set
- Bilingual buttons need clear visual hierarchy (primary/secondary sizing)
- Touch targets unchanged (no layout shifts from language change)

## Scope Notes

- ~280 default buttons need manual Spanish translations (largest effort)
- Grammar coverage: core verbs only (~30), not full conjugation tables
- User-created custom buttons are NOT auto-translated (user enters their own labels)
- For custom buttons in bilingual mode: show a "Spanish label" field in edit modal

## Risks

- Translation quality: needs review by a Spanish speaker
- Some Spanish words are longer than English, may need font-size adjustment
- Web Speech API Spanish voice availability varies by device/OS
- Spanish grammar is more complex than English; keeping it simple for AAC context
