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

### 2.1 Sensory-Friendly Options
- [ ] Reduced animations toggle (respects `prefers-reduced-motion` + manual toggle)
- [ ] High contrast mode
- [ ] Quieter UI option (softer tap sounds, no transition sounds)
- [ ] Settings panel for sensory preferences
- [ ] Persist preferences across sessions

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

### 3.3 Spanish Language Support
- [ ] Dual-language vocabulary (English + Spanish labels)
- [ ] Spanish speech output (Web Speech API `es-ES` / `es-MX`)
- [ ] Language toggle in settings
- [ ] Bilingual mode: show both languages on buttons
- [ ] Spanish grammar rules for verb forms and plurals

---

## Milestone 4: Teaching & Growth Tools
**Goal**: Help parents and SLPs support language development.
**Status**: Not Started

### 4.1 Modeling Mode
- [ ] Toggle for parent/SLP to demonstrate AAC use
- [ ] Visual indicator that modeling mode is active (e.g., border color, badge)
- [ ] Modeling taps are tracked separately from child's independent communication
- [ ] Guided modeling prompts: "Try showing your child how to say 'I want more'"
- [ ] Research reference: modeling is the #1 teaching strategy for AAC

### 4.2 Data/Usage Tracking
- [ ] Track which words the child uses most (frequency counts)
- [ ] Track communication frequency over time (sessions per day, words per session)
- [ ] Simple dashboard: top 10 words, daily/weekly usage chart
- [ ] Distinguish independent use vs. modeled use
- [ ] All data stored locally (privacy-first)
- [ ] Optional: export data as CSV for SLPs

### 4.3 Guided Setup & Teaching Tutorial
- [ ] First-launch onboarding flow: walk parents through what AAC is and how to start
- [ ] Guided setup wizard: pick grid size, child's age, communication level
- [ ] Interactive modeling tutorial: step-by-step "try tapping 'I want more'" with the parent
- [ ] Teaching tips surfaced contextually (e.g., "Tip: model 'help' when your child is struggling")
- [ ] Progress-gated vocabulary unlocks: tutorial suggests when to reveal new words
- [ ] "How to use AAC" reference section accessible from settings at any time
- [ ] Tutorial can be replayed or skipped

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
| **P1** | Sensory-friendly options | Not started |
| **P1** | Symbol/image library | DONE - ARASAAC integration |
| **P2** | Word prediction | DONE - Two-tap prediction chains |
| **P2** | Basic grammar | DONE - Plurals, conjugation, articles |
| **P2** | Modeling mode | Not started |
| **P2** | Guided setup & teaching tutorial | Not started |
| **P2** | Data/usage tracking | Not started |
| **P3** | Spanish language support | Not started |
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
