# Memory Optimization - AAC Board

## Executive Summary

The AAC Board PWA is triggering a 6.6GB memory warning. Investigation by Steve (Code Review) and Robert (Architecture) identified multiple contributors: event listener accumulation, unreleased blob URLs, unbounded IndexedDB image storage, redundant data structures, deep-clone patterns, and eager DOM rendering. This plan addresses all findings in priority order.

## Requirements

- Reduce runtime memory footprint to eliminate high-memory warnings
- Maintain all existing functionality (no regressions)
- Keep single-file architecture (index.html + sw.js + manifest.json)
- Preserve offline-first behavior
- No user-visible behavior changes (performance-only)

## Architecture Overview

Current memory hotspots (ranked by impact):

1. Event listener closures accumulating across grid/prediction/message renders
2. Blob URLs created via URL.createObjectURL() never revoked
3. ARASAAC image Blobs in IndexedDB with no quota or cleanup
4. LANG_ES loaded at startup regardless of language setting
5. Redundant icon/keyword/translation lookup tables (3x duplication)
6. JSON.parse(JSON.stringify()) deep clones on every grid size switch
7. Eager DOM rendering for large folders (no virtualization or lazy loading)

---

## Phase 1: Event Delegation (P0 -- Highest Impact)

### Task 1.1: Grid Cell Event Delegation

**Current**: createCell() attaches 6-7 event listeners per cell (touchstart, touchend, touchcancel, mousedown, mouseup, mouseleave, click). On every renderGrid() call, old DOM is cleared with innerHTML but closures may not GC.

**Fix**: Replace per-cell listeners with a single set of delegated listeners on the grid container. Use data attributes on cells to identify which button was tapped.

**Steps**:
- Add data-btn-id attribute to each cell in createCell()
- Remove all addEventListener calls from createCell()
- Add one set of delegated listeners on the grid container (set up once at init, never removed)
- Delegated handler looks up btn from data-btn-id
- Handle long-press logic via delegated touchstart/touchend/mousedown/mouseup

**Acceptance Criteria**:
- [ ] Grid renders with zero per-cell event listeners
- [ ] Tap, long-press, and hold behaviors work identically
- [ ] Memory profile shows no closure accumulation across renders

### Task 1.2: Prediction Bar Event Delegation

**Current**: renderPredictions() creates new chip elements with individual click handlers on every button tap.

**Fix**: Single delegated click listener on prediction bar container. Chips get data attributes.

**Steps**:
- Add data-pred-id or data-pred-label attribute to prediction chips
- Remove addEventListener from chip creation loop
- Add one delegated click listener on prediction bar (set up once at init)

**Acceptance Criteria**:
- [ ] Prediction chips have no individual listeners
- [ ] Tapping predictions still works correctly
- [ ] No closure accumulation from prediction renders

### Task 1.3: Message Bar Event Delegation

**Current**: renderMessage() creates span elements with individual click listeners for each word.

**Fix**: Single delegated listener on message container.

**Steps**:
- Add data-index attribute to message word spans
- Remove individual click listeners
- One delegated click listener on message container

**Acceptance Criteria**:
- [ ] Message word taps still trigger speak
- [ ] No per-word listeners created

### Task 1.4: Core Strip Event Delegation

**Current**: renderCoreStrip() creates buttons with individual event listeners.

**Fix**: Delegated listeners on core strip container.

**Acceptance Criteria**:
- [ ] Core strip buttons function identically
- [ ] No per-button listeners

---

## Phase 2: Blob URL Cleanup (P0)

### Task 2.1: Revoke Blob URLs on Re-render

**Current**: URL.createObjectURL(blob) is called when loading custom images from IndexedDB. These are never revoked, leaking memory.

**Fix**: Track active blob URLs. Revoke all before re-rendering grid.

**Steps**:
- Create a module-level array activeBlobUrls = []
- After each createObjectURL(), push the URL to the array
- Before renderGrid() clears innerHTML, iterate and call URL.revokeObjectURL() on each
- Clear the array after revoking

**Acceptance Criteria**:
- [ ] All blob URLs revoked before grid re-render
- [ ] Custom images still display correctly
- [ ] No blob URL memory leaks in DevTools

---

## Phase 3: IndexedDB Image Quota (P1)

### Task 3.1: Implement Image Cache Quota

**Current**: downloadSymbolsForButtons() stores Blobs in IndexedDB with no limit. Can grow to 20-50+ MB.

**Fix**: Cap stored images at a reasonable quota (e.g., 500 images or 50 MB). Prune least-recently-used when exceeded.

**Steps**:
- Track image count in IndexedDB images store
- Before storing new image, check count
- If over quota, delete oldest entries (by insertion order or add a timestamp field)
- Add "Clear Symbol Cache" option in Settings for manual cleanup

**Acceptance Criteria**:
- [ ] Image store capped at quota
- [ ] Pruning removes oldest images
- [ ] Settings shows cache clear option
- [ ] Symbols still download and display correctly

---

## Phase 4: Lazy-Load Spanish (P1)

### Task 4.1: Defer LANG_ES Loading

**Current**: LANG_ES object (~410 lines) parsed at startup regardless of language setting.

**Fix**: Wrap LANG_ES in a lazy initialization pattern. Only populate when language is set to Spanish.

**Steps**:
- Replace inline LANG_ES definition with a function getLangEs() that returns the data
- On first call, build and cache the object; subsequent calls return cached version
- If language is English, LANG_ES data is never parsed into memory
- Update all LANG_ES references to use the lazy getter

**Acceptance Criteria**:
- [ ] English-only users never load Spanish data
- [ ] Switching to Spanish still works correctly
- [ ] No startup regression

---

## Phase 5: Deduplicate Data Tables (P2)

### Task 5.1: Consolidate Icon/Keyword Lookups

**Current**: BUTTON_ICONS, SYMBOL_KEYWORDS, and LANG_ES.symbolKeywords all store overlapping data for ~400 entries.

**Fix**: Single source of truth for button metadata. Derive secondary lookups on demand.

**Steps**:
- Keep BUTTON_ICONS as the primary icon source
- Remove SYMBOL_KEYWORDS if it duplicates data derivable from buttons + BUTTON_ICONS
- Remove LANG_ES.symbolKeywords if derivable from LANG_ES.labels + BUTTON_ICONS
- Update all consumers to use the consolidated source
- Remove buildIconLookup() secondary index if possible (use direct lookup)

**Acceptance Criteria**:
- [ ] Only one copy of icon data in memory
- [ ] Symbol search still works
- [ ] Spanish symbol keywords still resolve

---

## Phase 6: Template Caching (P2)

### Task 6.1: Cache Grid Templates

**Current**: getTemplate() calls JSON.parse(JSON.stringify(...)) to deep-clone the full button array on every grid size switch.

**Fix**: Cache computed templates per grid size. Invalidate only when buttons change.

**Steps**:
- Create a templateCache = {} keyed by grid size
- On first getTemplate(size) call, compute and cache
- On subsequent calls, return cached version
- Invalidate cache when buttons are added/removed/edited

**Acceptance Criteria**:
- [ ] Switching grid sizes does not deep-clone every time
- [ ] Cache invalidates correctly on button edits
- [ ] All grid sizes render correctly

---

## Phase 7: Lazy DOM Rendering (P3)

### Task 7.1: Lazy Image Loading

**Current**: All button images rendered eagerly, including those below the fold.

**Fix**: Add loading="lazy" to button images.

**Steps**:
- In createCell(), set img.loading = 'lazy' on image elements

**Acceptance Criteria**:
- [ ] Images below fold load on scroll
- [ ] Visible images load immediately
- [ ] No visual flicker

### Task 7.2: Reduce DOM Churn in Large Folders

**Current**: renderGrid() clears and recreates all cells on every render.

**Fix**: Use DOM diffing or recycling for cells that haven't changed.

**Steps**:
- Before clearing grid, check if folder has changed
- If same folder re-render (e.g., after edit), update only changed cells
- If different folder, full re-render (but with blob URL cleanup from Phase 2)

**Acceptance Criteria**:
- [ ] Same-folder re-renders are incremental
- [ ] Folder navigation still works correctly
- [ ] Reduced DOM node creation count

---

## Integration Points

- **Service Worker**: No changes needed (network-first strategy is correct)
- **IndexedDB**: Phase 3 adds quota management to images store
- **localStorage**: No structural changes (usageLog cap already exists at 15,000)
- **Settings UI**: Phase 3 adds "Clear Symbol Cache" button

## Accessibility Considerations

- No UI changes in Phases 1-2, 4-6 (internal optimization only)
- Phase 3 settings button must be keyboard accessible with proper label
- Phase 7 lazy loading must not break screen reader announcements

## Testing Strategy

After each phase:
- Manual test all button interactions (tap, long-press, hold)
- Test prediction bar taps
- Test message bar word taps and clear
- Test grid size switching
- Test folder navigation
- Test Spanish language toggle
- Test symbol search
- Chrome DevTools Memory profiler: take heap snapshots before/after renders
- Verify no regressions in Lighthouse scores
