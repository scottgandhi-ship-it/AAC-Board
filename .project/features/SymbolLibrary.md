# Symbol/Image Library

## Executive Summary

Replace emoji-only button icons with real AAC symbols from open-source libraries (ARASAAC, Mulberry, OpenMoji). Users can also upload personal photos. Symbols are cached in IndexedDB for offline use. The edit modal gains a symbol picker alongside existing camera/upload options.

## Requirements

1. Integrate at least one open-source symbol set for AAC vocabulary
2. Map symbols to existing vocabulary items automatically on first load
3. Support personal photo uploads (already partially implemented -- enhance UX)
4. Symbols must work offline after initial cache
5. Symbol picker UI in the edit modal for swapping icons
6. Keep emoji as fallback when no symbol is cached

## Architecture Overview

### Symbol Source Strategy

**Primary: ARASAAC (Aragonese Centre of AAC)**
- Free, open-source, CC BY-NC-SA license
- 15,000+ pictograms designed specifically for AAC
- REST API: https://api.arasaac.org
- API returns PNG at configurable resolution (e.g., 300px)
- Widely used in clinical AAC devices
- Perfect match for our target users

**Fallback: Bundled Emoji (current system)**
- Zero-download, always available
- Remains the default until symbols are fetched

### Data Flow

1. **First load (online)**: App auto-downloads ARASAAC symbols for all default buttons
2. **Cached in IndexedDB**: Symbols stored as Blobs in existing `images` store
3. **Offline**: Symbols load from IndexedDB cache (same path as custom photos)
4. **Edit modal**: New "Browse Symbols" button opens search overlay
5. **Custom photos**: Existing upload/camera flow unchanged, takes priority over library symbols

### Storage

- Reuse existing IndexedDB `images` store (keyPath: button ID, value: Blob)
- Add new IndexedDB store `symbolMeta` for tracking which symbols are cached
- No new localStorage keys needed

## Task Breakdown

### Phase 2A: Symbol Mapping and Auto-Download

**Task 2A.1: Create ARASAAC keyword map**
- Build a `SYMBOL_KEYWORDS` object mapping button IDs to ARASAAC search terms
- Example: `'food-apple': 'apple'`, `'core-want': 'want'`, `'feelings-happy': 'happy'`
- Cover all ~150 default buttons
- Dependencies: None
- Acceptance: Every default button has a mapped keyword

**Task 2A.2: Symbol fetch and cache engine**
- Create `fetchSymbol(keyword)` -> fetches from ARASAAC API, returns Blob
- API endpoint: `https://api.arasaac.org/v1/pictograms/{id}/file/pictogram?resolution=300`
- First search by keyword: `https://api.arasaac.org/v1/pictograms/en/search/{keyword}`
- Create `cacheSymbol(buttonId, blob)` -> saves to IndexedDB `images` store
- Reuse existing `saveImage()` / `loadImage()` functions
- Dependencies: Task 2A.1
- Acceptance: Can fetch and cache a symbol by keyword

**Task 2A.3: Auto-download on first online load**
- On app init, check if symbols have been cached (flag in localStorage: `aac-symbols-cached`)
- If not cached and online: batch-fetch all mapped symbols in background
- Show subtle progress indicator ("Downloading symbols... 42/150")
- Use `navigator.onLine` check; skip if offline
- Rate-limit API calls (batch of 5 concurrent, 200ms delay between batches)
- Set flag when complete
- Dependencies: Task 2A.2
- Acceptance: All default buttons show ARASAAC symbols after first online load

**Task 2A.4: Update createCell() to prefer cached symbols**
- Current flow: loadImage(id) -> if found, show image; else show emoji
- This already works -- cached ARASAAC symbols will display automatically via loadImage()
- Verify image sizing/styling works with ARASAAC PNGs (may need CSS tweaks)
- Dependencies: Task 2A.3
- Acceptance: Grid buttons show ARASAAC symbols instead of emoji

### Phase 2B: Symbol Picker in Edit Modal

**Task 2B.1: Add "Browse Symbols" button to edit modal**
- New button in edit modal image section, alongside Upload/Camera/Clear
- Opens a search overlay/panel within the modal
- Dependencies: Phase 2A complete
- Acceptance: Button visible in edit modal, opens search UI

**Task 2B.2: Symbol search overlay**
- Text input for keyword search
- Calls ARASAAC search API: `/v1/pictograms/en/search/{query}`
- Shows grid of results (thumbnail PNGs)
- Tap a result to select it as the button's image
- Selected symbol saved to IndexedDB via existing saveImage()
- Close overlay returns to edit modal with preview updated
- Dependencies: Task 2B.1
- Acceptance: User can search and select a symbol from ARASAAC

**Task 2B.3: Offline symbol search**
- When offline, search only shows locally cached symbols
- Filter cached symbols by keyword metadata
- Add `symbolMeta` IndexedDB store: { buttonId, keyword, arasaacId }
- Dependencies: Task 2B.2
- Acceptance: Symbol search works offline with cached results

### Phase 2C: Polish and Edge Cases

**Task 2C.1: Handle API failures gracefully**
- If ARASAAC API is down, fall back to emoji silently
- Show toast if symbol download fails: "Some symbols couldn't load. They'll download next time you're online."
- Retry failed symbols on next app load
- Dependencies: Phase 2B complete
- Acceptance: App never breaks due to API issues

**Task 2C.2: Cache management**
- Add "Re-download Symbols" option in settings/parent mode
- Track cache staleness (store download date)
- Clear and re-fetch if user wants fresh symbols
- Dependencies: Task 2C.1
- Acceptance: User can refresh symbol cache

**Task 2C.3: Respect custom photos**
- If user has uploaded a custom photo for a button, never overwrite with library symbol
- Track which images are custom vs library in symbolMeta
- Auto-download skips buttons with custom images
- Dependencies: Task 2C.1
- Acceptance: Custom photos always take priority

## Integration Points

- **IndexedDB images store**: Reused as-is for symbol storage
- **createCell()**: Already loads images from IndexedDB -- no changes needed
- **Edit modal**: Extended with symbol picker button
- **Service worker**: No changes needed (symbols stored in IndexedDB, not cache API)
- **renderGrid()**: No changes needed
- **loadImage() / saveImage()**: Reused as-is

## Accessibility Considerations

- Symbol search input needs label and keyboard support
- Search results grid needs proper ARIA (role="listbox", items role="option")
- Loading states need aria-live announcements
- Touch targets for symbol results: 44x44px minimum
- Alt text for symbol previews from ARASAAC metadata

## Mobile Considerations

- Symbol search overlay must be full-screen on mobile
- Search results grid responsive (3-4 columns on phone)
- Download progress non-blocking (app usable during download)
- Large symbol set download: warn on cellular data (future enhancement)

## Acceptance Criteria

1. All default buttons display ARASAAC symbols after first online load
2. Emoji fallback works when offline and symbols not yet cached
3. Edit modal has "Browse Symbols" with search functionality
4. Custom photo uploads take priority over library symbols
5. App works fully offline after symbols are cached
6. No visible performance degradation during symbol loading
7. WCAG 2.1 AA accessible symbol picker
