# AAC Communication Board

## Overview
An Augmentative and Alternative Communication (AAC) board PWA for building and speaking sentences using picture+word buttons. Designed for users who rely on AAC to communicate.

## Architecture
- **Single-file app:** All HTML, CSS, and JS live in `index.html`. No build tools, no frameworks, no external dependencies. Keep it that way.
- `sw.js` — Service worker
- `manifest.json` — PWA manifest with inline SVG icons

## Rules

### Service Worker: Network-First Only
The PWA is bookmarked to home screens. Cache-first strategies break updates (users have to delete and re-add the bookmark). Always keep `sw.js` using network-first: try `fetch()` first, update the cache with the response, fall back to cache only when offline. Bump `CACHE_NAME` version to auto-delete old caches on activate.

### Fitzgerald Key Color System
The color categories follow an established AAC convention. Do not change the color-to-category mapping:
- **Yellow** — Pronouns (I, you, he, she, etc.)
- **Green** — Verbs (want, go, like, help, etc.)
- **Red** — Negation / Stop (no, stop)
- **Blue** — Descriptors (happy, sad, more, hungry, etc.)
- **Pink** — Social (hi, bye, please)
- **Orange** — Nouns (food, people, objects)
- **Home (grey)** — Navigation only (Home button in folders)

### Accessibility Is Paramount
This is a communication tool for people who cannot speak. Every change must preserve the core tap-to-speak flow. Keep touch targets large, keep the UI simple and uncluttered. Never introduce interactions that require fine motor control (dragging, long-press, small hit areas).

### No Placeholders in Input Fields
Never add placeholder text or pre-filled values in input fields. Fields must stay visually empty.

## Data Model

### Button Schema
```
{ id, label, color, type, folderId, position }
```
- **id** — Unique string identifier
- **label** — Display text and spoken word
- **color** — Fitzgerald Key color (yellow, green, red, blue, pink, orange)
- **type** — `core` (home grid essentials), `fringe` (folder contents / less common words), `folder` (opens a sub-grid)
- **folderId** — `null` for home grid buttons, or the folder name string (e.g., `'food'`, `'people'`) for buttons inside folders
- **position** — Integer sort order within the button's grid

### Storage
- **IndexedDB** (`aac-board`, v1) — Two object stores:
  - `buttons` (keyPath: `id`) — All button definitions
  - `images` (plain key-value) — Image blobs keyed by button ID
- **localStorage** — Voice name preference only (`aac-voice`)
- **No remote backend.** All data is local to the device.

### Defaults
On first load (empty IndexedDB), the app seeds from `DEFAULT_BUTTONS`: 16 home grid buttons + 15 food folder items + 11 people folder items.

## Speech
- Web Speech API (`speechSynthesis`)
- Filtered to `en-US` voices only
- Speech rate range: 0.3 (slow) to 1.5 (very fast), default 0.85
- Voice preference persisted in localStorage; auto-selects best adult female US English voice if none saved
