# AAC Board - Product Roadmap

> Managed by **Larson** (`/agents larson`). Run Larson for task assignments, priority reviews, and milestone tracking.

---

## Milestone 1: Core Communication (MVP+)
**Goal**: Make the home screen actually useful for communication, not just navigation.
**Status**: In Progress

### 1.1 Core Words on Home Screen -- DONE
- [x] Dedicated persistent core word strip above grid (I, Want, Don't Want, More, Help)
- [x] Fitzgerald Key colors (pronouns=yellow, verbs=green, descriptors=blue, negation=red)
- [x] Core words trigger speech output immediately (single tap)
- [x] Folders remain for expanded vocabulary categories with full grid space
- [x] Common requests achievable in 2 taps via prediction bar
- [x] Reduced from 10 to 5 core words per Marci's clinical recommendation

### 1.2 Consistent Motor Planning -- DONE
- [x] Core words in dedicated strip with fixed positions (never move)
- [x] Core word strip visible on EVERY screen (home + all folders)
- [x] Core word labels are read-only, colors disabled, delete hidden in edit modal
- [x] Position-lock: core words separated from grid so folder edits cannot affect them
- [x] Verified: navigating folders does not shift core word positions

### 1.3 Grid Templates by Communication Level -- DONE
- [x] Beginner grid: 3x3 (9 buttons) -- early communicators, youngest users
- [x] Intermediate grid: 4x4 (16 buttons)
- [x] Advanced grid: 6x6+ (36+ buttons)
- [x] Settings UI to switch between grid sizes
- [x] Grid size persists across sessions (localStorage)
- [x] Core word positions remain consistent across all grid sizes

---

## Milestone 2: Accessibility & Inclusion
**Goal**: Make the app usable for kids with sensory and motor differences.
**Status**: Not Started

### 2.1 Sensory-Friendly Options -- DONE
- [x] Reduced animations toggle (respects `prefers-reduced-motion` + manual toggle)
- [x] High contrast mode (boosted Fitzgerald Key colors, bold borders, AAA focus indicators)
- [x] Quiet mode (mutes celebration sounds and confetti, speech unaffected)
- [x] Settings panel for sensory preferences (3 independent toggles)
- [x] Persist preferences across sessions (localStorage + OS media query defaults)

### 2.2 Symbol/Image Library -- DONE
- [x] Integrate open-source symbol set (ARASAAC -- 15,000+ AAC pictograms)
- [x] Map symbols to vocabulary items (~150 default buttons mapped)
- [x] Support personal photo uploads (swap symbol for photo of child's actual objects/people)
- [x] Offline symbol availability (cached in IndexedDB after first download)
- [x] Browse Symbols picker in edit modal with ARASAAC search
- [x] Custom photo protection (user uploads never overwritten by auto-download)

---

## Milestone 3: Language Intelligence
**Goal**: Help users communicate faster and build language skills.
**Status**: In Progress

### 3.1 Word Prediction -- DONE
- [x] Predictive next-word bar for two-tap phrase building
- [x] Prediction bar appears between message bar and core word strip
- [x] Predictions keyed by button ID (not label) for i18n robustness
- [x] Predictions chain: tap core word -> see predictions -> tap prediction -> see next predictions
- [x] Tap prediction to speak, add to sentence, and show next predictions
- [x] __NOUNS__ placeholder resolves to top noun IDs dynamically
- [x] iOS TTS fix: "I" no longer reads as "capital I" (SPEAK_OVERRIDES)

### 3.2 Basic Grammar -- DONE
- [x] Auto-plurals: tap noun twice or use "more" + noun -> plural form spoken
- [x] Simple verb forms: want/wants/wanted based on pronoun context (30+ verbs)
- [x] Article insertion: optional "a"/"an" auto-insertion (off by default)
- [x] Grammar applied at speech output time (button labels never change)
- [x] Double-tap noun to pluralize (800ms window)
- [x] Independent settings toggles for each grammar rule

### 3.3 Spanish Language Support -- DONE
- [x] Dual-language vocabulary (English + Spanish labels)
- [x] Spanish speech output (Web Speech API `es-ES` / `es-MX`)
- [x] Language toggle in settings
- [x] Bilingual mode: show both languages on buttons
- [x] Spanish grammar rules for verb forms and plurals

---

## Milestone 4: Teaching & Growth Tools
**Goal**: Help parents and SLPs support language development.
**Status**: Not Started

### ~~4.1 Modeling Mode~~ -- REMOVED
> Folded into 4.3 Guided Setup & Teaching Tutorial. Modeling guidance will be part of the interactive tutorial instead of a separate mode.

### 4.2 Data/Usage Tracking -- DONE
- [x] Track which words the child uses most (frequency counts, pre-computed summary)
- [x] Track communication frequency over time (daily word counts, streak tracking)
- [x] Simple dashboard: top 10 words with Fitzgerald Key colors, 7-day activity chart
- [x] Source field ready for independent vs. modeled (Modeling Mode pending)
- [x] All data stored locally (privacy-first, 90-day + 15K cap)
- [x] Export data as CSV for SLPs (human-readable word labels)
- [x] Insights tab visible only in parent mode

### 4.3 Guided Setup & Teaching Tutorial -- DONE
- [x] First-launch onboarding flow: welcome screen, grid picker, coach marks
- [x] Guided setup wizard: pick grid size with visual preview
- [x] Getting Started guide: 8 accordion tips in Settings for parents
- [x] "How to use AAC" reference section accessible from settings at any time
- [x] Tutorial can be replayed or skipped

### 4.5 Deep Vocabulary Expansion (Levels 1-2) -- DONE
- [x] 6 new folders: Animals, Descriptors, Time, Where, Nature, School
- [x] 132 new communication words (283 -> 415 total)
- [x] Expanded existing folders: Actions (+18), My Body (+10), Drinks (+4), People (+5)
- [x] Dog/cat moved from People to Animals (IDs preserved)
- [x] Spanish translations for all new words
- [x] ARASAAC symbol keywords for all new words
- [x] Expanded prediction chains and default noun IDs
- [x] Existing-user migration (auto-adds new vocabulary on load)
- [x] Motor planning preserved: all existing word positions unchanged
- [x] 3x3 grid updated: Animals replaces Places
- [x] Fitzgerald Key colors correct for all new content

### 4.4 Export/Share Boards
- [ ] Export board configuration as JSON file
- [ ] Import board from JSON file
- [ ] SLPs can create a board and share it with families
- [ ] Share via file download (no server needed for v1)
- [ ] Include vocabulary, grid layout, and customizations in export

---

## Milestone 5: Platform & Distribution
**Goal**: Get the app into users' hands on every platform.
**Status**: Not Started

- [ ] iOS app (React Native or Capacitor wrapper)
- [ ] App Store submission
- [ ] $9.99 one-time purchase payment integration
- [ ] Backup/restore system (device migration)
- [ ] Password-protected edit mode (prevent accidental changes by children)

---

## Priority Order

| Priority | Item | Status |
|----------|------|--------|
| **P0** | Core words on home screen | DONE - Persistent strip with 5 words |
| **P0** | Consistent motor planning | DONE - Fixed strip, position-locked |
| **P1** | Grid templates | DONE - 3x3/4x4/6x6 with settings UI |
| **P1** | Sensory-friendly options | DONE - 3 toggles, OS-aware defaults |
| **P1** | Symbol/image library | DONE - ARASAAC integration |
| **P2** | Word prediction | DONE - Two-tap prediction chains |
| **P2** | Basic grammar | DONE - Plurals, conjugation, articles |
| **P2** | ~~Modeling mode~~ | REMOVED - folded into 4.3 |
| **P2** | Guided setup & teaching tutorial | DONE - Onboarding flow, Getting Started guide |
| **P2** | Data/usage tracking | DONE - Insights tab, CSV export |
| **P0** | Deep vocabulary expansion (L1-2) | DONE - 283 to 415 words, 6 new folders |
| **P3** | Spanish language support | DONE |
| **P3** | Export/share boards | Not started |
| **P4** | iOS app + distribution | Not started |

---

## Changelog

| Date | Change |
|------|--------|
| 2026-03-06 | Roadmap created with 5 milestones and 11 deliverables |
| 2026-03-06 | Added 4.3 Guided Setup & Teaching Tutorial (P2) |
| 2026-03-06 | Completed 1.1 Core Words - dedicated persistent strip with 5 words |
| 2026-03-06 | Completed 1.2 Motor Planning - fixed positions, position-locked strip |
| 2026-03-06 | Completed 3.1 Word Prediction - two-tap prediction chains, iOS TTS fix |
| 2026-03-06 | Fitzgerald Key color coding applied to all folders and words |
| 2026-03-06 | Back button styled as orange standout, Home button removed from folder grids |
| 2026-03-06 | Robert architecture review completed and all findings addressed |
| 2026-03-07 | Completed 1.3 Grid Templates - 3x3/4x4/6x6 with settings UI |
| 2026-03-07 | Completed 2.2 Symbol Library - ARASAAC integration with auto-download |
| 2026-03-07 | Completed 3.2 Basic Grammar - plurals, verb conjugation, article insertion |
| 2026-03-07 | Completed 3.3 Spanish Language Support - dual-language vocab, bilingual mode |
| 2026-03-07 | Removed 4.1 Modeling Mode - folded modeling guidance into 4.3 Guided Setup & Teaching Tutorial |
| 2026-03-07 | Completed 4.3 Guided Setup - onboarding flow, Getting Started guide in Settings |
| 2026-03-07 | Completed 4.5 Deep Vocabulary Expansion - 132 new words, 6 new folders, 415 total communication words |
| 2026-03-07 | Investor deck alignment analysis created - 17 gaps identified across 4 phases |
