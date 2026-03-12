# Memory Optimization - Implementation Notes

## Current Status: IMPLEMENTING

## Checklist

### Phase 1: Event Delegation (P0)
- [x] Task 1.1: Grid cell event delegation -- replaced 7 per-cell listeners with single delegated set on grid container
- [x] Task 1.2: Prediction bar event delegation -- single delegated click on prediction-bar, chips use data-pred-id
- [x] Task 1.3: Message bar event delegation -- single delegated click on message-words container
- [x] Task 1.4: Core strip event delegation -- single delegated click on core-word-strip

### Phase 2: Blob URL Cleanup (P0)
- [x] Task 2.1: Revoke blob URLs on re-render -- activeBlobUrls array tracks all createObjectURL calls in grid cells, revokeActiveBlobUrls() called before renderGrid clears innerHTML

### Phase 3: IndexedDB Image Quota (P1)
- [x] Task 3.1: Added getImageCacheCount() and clearImageCache() functions
- [x] Task 3.1: Added "Clear Symbol Cache" button in Settings > Data section
- [x] Task 3.1: Button shows count, confirms, clears store, resets aac-symbols-cached flag

### Phase 4: Lazy-Load Spanish (P1)
- [x] Task 4.1: LANG_ES wrapped in getLangEs() lazy getter -- data only allocated when Spanish is first accessed
- [x] Task 4.1: All 15 LANG_ES references updated to getLangEs()

### Phase 5: Deduplicate Data Tables (P2)
- [x] Task 5.1: SYMBOL_KEYWORDS wrapped in getSymbolKeywords() lazy getter -- only allocated during symbol download
- [x] Task 5.1: iconByLabel secondary index retained (needed for prediction chip lookup by label)

### Phase 6: Template Caching (P2)
- [x] Task 6.1: getTemplate() now caches computed templates per grid size in _templateCache
- [x] Task 6.1: Returns shallow clones (spread) instead of JSON.parse(JSON.stringify()) deep clones
- [x] Task 6.1: CORE_WORD_DEFS migration clone also uses shallow spread

### Phase 7: Lazy DOM Rendering (P3)
- [x] Task 7.1: Added loading="lazy" to button images in createCell()
- [ ] Task 7.2: Reduce DOM churn in large folders -- deferred (incremental re-render requires more investigation)

### Infrastructure
- [x] sw.js cache version bumped to v27
- [x] JS syntax validated via Node.js

## Issues and Resolutions
- SYMBOL_KEYWORDS cannot be fully eliminated -- it contains custom ARASAAC search keywords (e.g., "chicken nuggets" vs "nuggets") that differ from button labels. Lazy-loaded instead.
- iconByLabel lookup retained because prediction chips need to look up icons by label text, not button ID.
- Task 7.2 (DOM diffing for same-folder re-renders) deferred -- requires tracking previous folder state and matching cells, higher risk of regressions for modest gain.

## Validation Progress
- [ ] Manual test: tap, long-press, hold on grid cells
- [ ] Manual test: prediction chip taps
- [ ] Manual test: message bar word taps
- [ ] Manual test: core strip button taps
- [ ] Manual test: grid size switching
- [ ] Manual test: folder navigation
- [ ] Manual test: Spanish language toggle
- [ ] Manual test: symbol search
- [ ] Manual test: Clear Symbol Cache button in settings
- [ ] Chrome DevTools memory profiler comparison
- [ ] Lighthouse audit
- [ ] Mobile device test
