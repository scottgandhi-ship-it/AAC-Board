# AAC Board - Product Roadmap

> Managed by **Larson** (`/agents larson`). Run Larson for task assignments, priority reviews, and milestone tracking.

---

## Milestone 1: Core Communication (MVP+)
**Goal**: Make the home screen actually useful for communication, not just navigation.
**Status**: Not Started

### 1.1 Core Words on Home Screen
- [ ] Design home grid layout mixing core words + folder icons
- [ ] Place core vocabulary: I, want, go, help, more, stop, yes, no, like, don't want
- [ ] Ensure core words use Fitzgerald Key colors (pronouns=yellow, verbs=green, social=pink)
- [ ] Core words trigger speech output immediately (single tap)
- [ ] Folders remain for expanded vocabulary categories
- [ ] Test: common requests achievable in 2 taps max

### 1.2 Consistent Motor Planning
- [ ] Define fixed grid positions for core words (these positions are permanent)
- [ ] Core words appear in the same position on EVERY screen/folder view
- [ ] Document the grid position contract (which cells are reserved, which are available)
- [ ] Add position-lock mechanism so editing cannot move core words
- [ ] Test: navigate 5 different folders, verify core words don't shift

### 1.3 Grid Templates by Communication Level
- [ ] Beginner grid: 3x3 (9 buttons) — early communicators, youngest users
- [ ] Intermediate grid: 4x4 (16 buttons)
- [ ] Advanced grid: 6x6+ (36+ buttons)
- [ ] Age-appropriate presets (toddler, school-age, teen/adult)
- [ ] Settings UI to switch between grid sizes
- [ ] Grid size persists across sessions (localStorage)
- [ ] Core word positions remain consistent across all grid sizes

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

### 2.2 Symbol/Image Library
- [ ] Integrate open-source symbol set (e.g., Mulberry, ARASAAC, OpenMoji)
- [ ] Map symbols to vocabulary items
- [ ] Support personal photo uploads (swap symbol for photo of child's actual objects/people)
- [ ] Offline symbol availability (bundled or cached)

---

## Milestone 3: Language Intelligence
**Goal**: Help users communicate faster and build language skills.
**Status**: Not Started

### 3.1 Word Prediction
- [ ] After "I want..." suggest contextually likely words: "more", "help", "food", "play"
- [ ] Prediction bar appears above message bar
- [ ] Predictions based on frequency data (most common AAC sequences)
- [ ] Predictions update as message builds
- [ ] Tap prediction to add to message

### 3.2 Basic Grammar
- [ ] Auto-plurals: tap noun twice or use "more" + noun → plural form spoken
- [ ] Simple verb forms: want/wants/wanted based on pronoun context
- [ ] Article insertion: optional "a", "the" auto-insertion
- [ ] Grammar applied at speech output time (don't change button labels)

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

### 4.3 Export/Share Boards
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

| Priority | Item | Why |
|----------|------|-----|
| **P0** | Core words on home screen | Biggest usability gap. Cuts common requests from 4+ taps to 2. |
| **P0** | Consistent motor planning | Without this, adding features makes the app harder to use. |
| **P1** | Grid templates | Different users need different density. Unlocks age-appropriate presets. |
| **P1** | Sensory-friendly options | Accessibility is not optional for this population. |
| **P1** | Symbol/image library | Most AAC users rely on symbols, not text. |
| **P2** | Word prediction | Speeds up communication significantly. |
| **P2** | Basic grammar | Makes output sound natural. |
| **P2** | Modeling mode | Research-backed #1 teaching strategy. |
| **P2** | Data/usage tracking | Parents and SLPs need visibility into progress. |
| **P3** | Spanish language support | Largest non-English US population. |
| **P3** | Export/share boards | Enables SLP-to-family workflow. |
| **P4** | iOS app + distribution | After web version is solid. |

---

## Changelog

| Date | Change |
|------|--------|
| 2026-03-06 | Roadmap created with 5 milestones and 11 deliverables |
