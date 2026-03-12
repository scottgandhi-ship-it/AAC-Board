# AAC Communication Board - Project Notes

## Current Focus
App Split -- separating AAC Board and Guiding Steps per SLP/DT feedback

## Active Features

### AAC Board / Guiding Steps App Split
- Plan: .project/features/AppSplit.md
- Notes: .project/features/AppSplit_Notes.md
- Status: Phase A COMPLETE (scaffold) -- awaiting developer approval to proceed
- Guiding Steps scaffold: guiding-steps/ (index.html + sw.js + manifest.json)

### Export/Share Boards (Milestone 4.4)
- Plan: .project/features/ExportShareBoards.md
- Notes: .project/features/ExportShareBoards_Notes.md
- Status: IMPLEMENTED -- awaiting testing and validation
- Branch: feature/export-import-boards

### Marketing Website
- Plan: .project/features/MarketingWebsite.md
- Status: PLANNING -- on hold pending app split

### Investor Deck -> Roadmap Alignment
- Plan: .project/features/InvestorDeck-RoadmapAlignment.md
- Status: PLANNING -- gap analysis complete, needs revision for app split

### Sensory/Regulation Words (Phase 2, P0)
- Plan: .project/features/SensoryRegulationWords.md
- Notes: .project/features/SensoryRegulationWords_Notes.md
- Status: IMPLEMENTED -- awaiting validation

### Quick Phrases (Phase 2, P0)
- Plan: .project/features/QuickPhrases.md
- Notes: .project/features/QuickPhrases_Notes.md
- Status: IMPLEMENTED -- awaiting validation

### Activity Overlays (Phase 2, P1)
- Plan: .project/features/ActivityOverlays.md
- Notes: .project/features/ActivityOverlays_Notes.md
- Status: PLANNING -- awaiting approval (will become Activities tab post-split)
- Concept: Parent/SLP-controlled contextual vocabulary overlays (not a tab)
- Initial bundles: Mealtime, Bath Time, Playground, Bedtime, Getting Dressed, Circle Time
- Second wave: 6 additional bundles designed by Marci (pending)

## Next Up
- Activity Overlays Wave 2 (6 additional activity bundles)
- Milestone 5: iOS + Android App Store Submissions

## Completed Features

### Deep Vocabulary Expansion (Phase 2, P0)
- Plan: .project/features/DeepVocabularyExpansion.md
- Notes: .project/features/DeepVocabularyExpansion_Notes.md
- Status: DONE -- merged via PR #34, hotfix pushed

### Parent Mode Refactor
- Plan: .project/features/ParentModeRefactor.md
- Notes: .project/features/ParentModeRefactor_Notes.md
- Status: DONE -- merged via PRs #27-#31

### Guided Setup (Milestone 4.3)
- Plan: .project/features/GuidedSetup.md
- Notes: .project/features/GuidedSetup_Notes.md
- Status: DONE -- merged via PR #32

### Getting Started Guide
- Plan: .project/features/GettingStartedGuide.md
- Notes: .project/features/GettingStartedGuide_Notes.md
- Status: DONE -- merged via PR #33

### Navigation & Parent Mode
- Plan: .project/features/NavigationAndParentMode.md
- Status: DONE -- device tested 2026-03-07

### Reward Tracker
- Plan: .project/features/RewardTracker.md
- Status: DONE -- device tested 2026-03-07

### Visual Schedules
- Plan: .project/features/VisualSchedules.md
- Status: DONE -- device tested 2026-03-07

### Sensory-Friendly Options (Milestone 2.1)
- Plan: .project/features/SensoryFriendly.md
- Status: DONE

### Symbol Library (Milestone 2.2)
- Plan: .project/features/SymbolLibrary.md
- Status: DONE

### Word Prediction (Milestone 3.1)
- Plan: .project/features/core-words-predictions.md
- Status: DONE

### Basic Grammar (Milestone 3.2)
- Plan: .project/features/BasicGrammar.md
- Status: DONE

### Spanish Language Support (Milestone 3.3)
- Status: DONE -- 2026-03-07

### Data & Usage Tracking (Milestone 4.2)
- Plan: .project/features/DataUsageTracking.md
- Status: DONE -- device tested 2026-03-07

### UX Design Pass
- Plan: .project/features/UXDesignPass.md
- Status: DONE -- merged via PR #25

### Competitive Analysis
- Plan: .project/features/CompetitiveAnalysis.md
- Status: COMPLETE -- research delivered 2026-03-07

## Session History
- 2026-02-28: Initialized .project workflow structure
- 2026-02-28: Created planning docs for Navigation/ParentMode, Reward Tracker, Visual Schedules
- 2026-02-28: Implemented all three features in index.html
  - Phase 0: Tab bar navigation (Talk/Schedule/Rewards), app-wide parent mode (3-tap lock)
  - Phase 2: Reward tracker with stepping stone path, celebration, timer, multi-track
  - Phase 3: Visual schedules with 29 default activities, template system, step-by-step completion
- 2026-03-07: Created planning docs for Symbol Library and Basic Grammar
- 2026-03-07: Marked 2.1 Sensory-Friendly as DONE in roadmap
- 2026-03-07: Created planning docs for Data & Usage Tracking (4.2)
- 2026-03-07: Completed competitive analysis -- AssistiveWare deep dive, full market landscape, pricing intelligence, gap analysis
- 2026-03-07: Parent Mode Refactor -- replaced hidden long-press lock with always-visible settings button
- 2026-03-07: Guided Setup onboarding -- 3-step flow (welcome, grid picker, coach marks)
- 2026-03-07: Getting Started Guide -- 8 accordion tips in Settings for parents
- 2026-03-07: Investor Deck alignment -- gap analysis of 17 features across 4 phases
- 2026-03-07: Deep Vocabulary Expansion -- 283 to 415 communication words, 6 new folders, 132 new words, Spanish translations, PR #34
- 2026-03-11: App Split initiated -- SLP/DT feedback: separate AAC (communication + Activities) from behavioral tools (Schedule, Rewards, Social Stories)
- 2026-03-11: Created Guiding Steps scaffold at guiding-steps/ (shared design system, PWA structure, parent mode, sensory prefs, TTS, celebration system)
- 2026-03-11: Created AppSplit.md planning doc with 7-phase execution plan (A through G)
