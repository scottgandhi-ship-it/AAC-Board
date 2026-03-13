# Story Word Limits -- Implementation Notes

## Current Status: Phase 2 -- Implemented (awaiting validation)

## Implementation Checklist

### Task 1: Data Model and Constants
- [x] Add AGE_CONFIG constant (centralized object, ages 2-6)
- [x] Add getAgeConfig(story) accessor function
- [x] Add escapeRegex() utility
- [x] Add countStoryWords(story, text) with word-boundary regex for childName exclusion
- [x] Add getWordLimitState(story, wordCount) for threshold logic
- [x] Add storyHasOverlimitPages(story) for save-blocking check
- [x] Add childAge: null to default story in openStoryEditor()
- [x] Add childAge: null to createStoryFromTemplate()
- [x] Existing stories without childAge: no limits applied, prompt for age on edit

### Task 2: Age Selector UI
- [x] Add age selector HTML (circular pills, 48x48px, between name and perspective)
- [x] CSS: .age-pill, .age-pill-group, .age-pill-prompt, agePulse animation
- [x] Wire click handler to editingStory.childAge
- [x] Initialize pills from editingStory.childAge in openStoryEditor()
- [x] No default selection -- "Next" blocked until age chosen (pulse animation on skip)
- [x] updateSetupNextState() manages prompt visibility
- [x] Accessible: role="radiogroup", aria-label, role="radio", aria-checked

### Task 3: Word Counter Upgrade
- [x] Removed ALL inline word-count logic (old editor-text-hint)
- [x] New HTML: progress bar + counter row + coaching + warning + split button
- [x] updateWordCounter(text) replaces all call sites
- [x] Color coding: muted (ok), accent (over/nearcap), danger (hardcap)
- [x] Progress bar: 4px, tracks word count as % of soft limit
- [x] Coaching messages: warm tone, no age reference
- [x] Counter denominator is soft limit (hard cap never shown)
- [x] aria-live="polite" on counter container
- [x] CSS: .word-counter-row, .word-progress-bar, .word-counter-warning, .word-split-btn

### Task 4: Hard Cap Enforcement
- [x] NO truncation -- parent types freely past hard cap
- [x] Persistent inline warning at hard cap (not toast)
- [x] Save button disabled when any page exceeds hard cap (storyHasOverlimitPages)
- [x] #editor-save:disabled CSS style (opacity 0.5, cursor not-allowed)
- [x] Save handler also checks and shows toast if somehow triggered
- [x] updateSaveState() called on input and page render

### Task 5: Split Page Suggestion
- [x] Split button appears at nearcap (80% of hard cap) and hardcap states
- [x] Pill button style: primary bg, white text, 20px radius
- [x] splitSlideIn animation (200ms ease-out)
- [x] splitTextAtSentenceBoundary() uses Intl.Segmenter with word-boundary fallback
- [x] "Done!" feedback for 600ms, then navigate to new page
- [x] New page shows "Continued from page N" note, clears on first edit
- [x] 12-page maximum respected

### Task 6: Story Helper Integration
- [x] Word counter on helper-scene textarea (visible only when over soft limit)
- [x] Word counters on sequence step inputs (visible only when over soft limit)
- [x] Auto-split in generateStoryFromHelper() for pages exceeding soft limit
- [x] Toast: "Long pages were split to be easier to follow"
- [x] 12-page cap in auto-split loop

## Review Feedback Incorporated
- Steve: No truncation (save-blocking instead), word-boundary regex for name exclusion
- Robert: Centralized AGE_CONFIG, getAgeConfig() accessor, Intl.Segmenter for sentence detection
- Noah: Circular pill buttons (not seg-group), app CSS variables for colors, split at 80% hard cap, warm coaching messages, progress bar, no pre-selected age default

## Issues and Resolutions
(none yet)

## Validation Progress
(not started -- awaiting user testing)
