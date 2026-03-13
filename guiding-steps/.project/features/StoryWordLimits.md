# Story Word Limits -- Age-Based Page Length Guidance

## Executive Summary

Add clinically-informed, age-based word limits to the Social Stories page editor. Parents currently have no guardrails when writing page text, which leads to cognitive overload for the child. Based on Marci's recommendations (grounded in Carol Gray's framework, Cognitive Load Theory, and receptive language research for autistic children), the editor will show a real-time word counter with soft warnings and save-blocking hard caps calibrated to the child's age (2-6).

## Problem

When writing Social Stories, parents naturally over-explain. A parent describing "going to the dentist" might write a 40-word paragraph on a single page. For an autistic 3-year-old with potential receptive language delays, that's 3-4x more text than they can process. The therapeutic value of the story drops to zero when pages become walls of text.

## Requirements

- Add a "Child's Age" selector (ages 2-6) to Story Details setup step
- Store childAge on the story object (per-story, since families may have multiple children or revisit stories as child grows)
- Show a real-time word counter with the recommended limit visible: "8 / 12 words"
- Visual indicator using app palette: muted (under limit), warm amber (over soft limit), danger (at hard cap)
- Soft warning message when soft limit exceeded
- Hard cap blocks **save**, not typing -- parent can always type freely but must shorten or split before saving
- Do not count the child's name toward the word limit (word-boundary matching, regex-escaped)
- Apply limits in the page editor; show counters in Story Helper only when over soft limit
- Require explicit age selection -- no pre-selected default. "Next" disabled until age is chosen.
- For existing stories without childAge, prompt parent to set age on edit (no silent default)

## Clinical Basis (Marci's Recommendations)

Word limits account for the fact that autistic children's receptive language often lags 1-2 years behind expressive language (Hudry et al., 2010). These numbers assume the child is being read TO by a caregiver.

| Age | Soft Limit (words) | Hard Cap (1.5x) | Max Sentences |
|-----|-------------------|-----------------|---------------|
| 2   | 8                 | 12              | 1             |
| 3   | 12                | 18              | 1-2           |
| 4   | 18                | 27              | 2-3           |
| 5   | 25                | 38              | 2-4           |
| 6   | 35                | 50              | 3-5           |

**Soft warning**: Shown when word count exceeds the recommended limit. Parents can continue typing -- they know their child best. Some 4-year-olds are hyperlexic and can handle more text.

**Hard cap**: At 1.5x the recommended limit, save is blocked. The parent must shorten text or split the page. Text is never truncated or deleted programmatically -- that destroys undo history and feels hostile.

## Architecture Overview

### Data Model Change

Add childAge (number, 2-6) to the story object:

    {
      id, title, childName, childAge, personMode, ...
    }

No DB schema migration needed -- IndexedDB is schemaless for object properties. Existing stories without childAge will prompt for age on edit.

### Centralized Age Config (Robert)

Single configuration object for all age-dependent behavior:

    AGE_CONFIG = {
      2: { wordLimits: { soft: 8, hard: 12 } },
      3: { wordLimits: { soft: 12, hard: 18 } },
      4: { wordLimits: { soft: 18, hard: 27 } },
      5: { wordLimits: { soft: 25, hard: 38 } },
      6: { wordLimits: { soft: 35, hard: 50 } }
    }

Single accessor function:

    getAgeConfig(story) -> returns AGE_CONFIG[story.childAge] or null if unset

Future age-dependent features (font size, visual density, etc.) add properties to this object. No scattered conditionals.

### Word Count Function (Steve + Robert)

    countStoryWords(story, text)
    - Accepts story object (future-proof signature per Robert)
    - If story.childName is non-empty, remove whole-word matches using word-boundary regex:
      new RegExp('\\b' + escapeRegex(childName.trim()) + '\\b', 'gi')
    - Handle edge cases: empty childName (skip exclusion), special chars in name (regex-escaped)
    - Split remaining text on whitespace, filter empty
    - Return integer word count
    - Note: common-word names (Will, May, Art) will be excluded. Accepted trade-off.

### UI Components

**Age selector** (Story Details step -- Noah):
- Individual circular pill buttons (NOT seg-group -- too narrow for 5 options on small screens)
- Each pill: min-width 48px, min-height 48px, border-radius 24px (full round)
- Layout: display flex, gap 8px, justify-content center
- Unselected: var(--chrome-surface) background, var(--chrome-border) border, var(--chrome-text-secondary) color
- Selected: var(--chrome-primary) background, white text
- Font: 1.1rem, weight 700
- Label: "Child's Age (years)"
- No default selected -- "Next" button disabled until age is chosen
- Gentle prompt below pills: "Select your child's age for page length guidance"
- If parent taps "Next" without selecting: pulse the age group with soft box-shadow animation (400ms)
- Placed between Child's Name and Perspective

**Word counter** (page editor -- Noah):
- Compact single row: counter on left, coaching message on right
- Format: "8 / 12 words" where denominator is soft limit (hard cap is invisible infrastructure)
- 4px progress bar below textarea: width = min(wordCount / softLimit * 100, 100)%
  - Under soft limit: var(--chrome-primary) on var(--chrome-border-light) track
  - Over soft limit: var(--chrome-accent) (#F5A623)
  - At hard cap: var(--chrome-danger) (#D32F2F)
- Counter colors (use app CSS variables, NOT Material/Tailwind):
  - Under soft limit: var(--chrome-text-muted) (#888) -- calm, informational
  - Over soft limit: count number shifts to var(--chrome-accent), denominator stays muted
  - At hard cap: count number shifts to var(--chrome-danger), wrap counter area in soft background (rgba(211,47,47,0.06), border-radius 8px, padding 8px 12px)
- aria-live="polite" on counter container for screen reader announcements

**Hard cap enforcement** (Steve + Robert + Noah consensus):
- NEVER truncate text. NEVER programmatically modify textarea value.
- Let parent type freely past the hard cap
- Show persistent red visual warning + inline coaching message (not a toast -- toasts are fleeting)
- Block the SAVE action: Save button disabled + shows "Shorten or split pages over the limit"
- Also block "Next" page navigation to prevent parent from losing sight of the issue
- When parent deletes text below hard cap, restrictions lift immediately

**Split page suggestion** (Noah):
- Appears at 80% of hard cap (not at soft limit -- too early is nagging)
  - Age 2: at 10 words, Age 3: at 14, Age 4: at 22, Age 5: at 30, Age 6: at 40
- Small pill button (not a text link): var(--chrome-primary) bg, white text, border-radius 20px, padding 6px 16px, font-size 0.85rem, font-weight 600
- Text: "Split into 2 pages" (statement, not question -- reduces decision fatigue)
- Animate in: subtle slide-up and fade, 200ms ease-out
- Position: below coaching message, above sentence type selector, margin-top 8px
- On tap: split at sentence boundary using Intl.Segmenter (Robert)
- After split: button briefly shows "Done!" for 600ms, then navigate to new page
- New page shows subtle note: "Continued from page [N]" in muted text, disappears on first edit
- Sentence boundary detection: use Intl.Segmenter('en', { granularity: 'sentence' })
  - Fallback for single-sentence text: split at word boundary nearest midpoint

**Coaching messages** (Noah -- warm tone, never reference age in warning text):

| State | Message |
|-------|---------|
| Under soft limit | (no message, just the counter) |
| Over soft limit | "Shorter pages are easier to follow -- you know your child best" |
| At 80% of hard cap | "Getting long -- splitting into two pages can help" |
| At hard cap | "Page is full -- try splitting into two pages" |

### Story Helper Integration

- Show word counters in helper text fields ONLY when over soft limit (Noah -- reduce noise in guided mode)
- After generateStoryFromHelper(), auto-split pages exceeding soft limit
- Toast: "Long pages were split to be easier to follow" (warm tone per Noah)
- Cap total pages at 12 after auto-split; warn if auto-split would exceed it (Steve)

## Task Breakdown

Dependencies: Task 1 -> Task 2 -> Task 3 -> Task 4 -> Task 5 -> Task 6

### Task 1: Data Model and Constants

- Add AGE_CONFIG constant (centralized, per Robert)
- Add getAgeConfig(story) accessor function
- Add escapeRegex() utility
- Add countStoryWords(story, text) with word-boundary regex for childName exclusion
- Handle empty childName, special chars, multi-word names
- Add childAge property handling in openStoryEditor() and save flow
- Existing stories without childAge: no silent default, prompt on edit

### Task 2: Age Selector UI

- Add "Child's Age (years)" field to editor-step-setup HTML (between Child's Name and Perspective)
- Circular pill buttons (48x48px) in flex-wrap row, NOT seg-group
- No default selection -- "Next" disabled until age chosen
- Gentle prompt: "Select your child's age for page length guidance"
- Pulse animation if "Next" tapped without selection
- Wire up to editingStory.childAge
- For existing stories without childAge: show age selector in "not set" state on edit
- Accessible: role="radiogroup", aria-label "Child's age in years", role="radio" + aria-checked on each pill

### Task 3: Word Counter Upgrade

- Remove ALL inline word-count logic (line 5291 in renderEditorPage, lines 5322-5323 in input handler)
- Replace editor-text-hint with new structure: compact row (counter left, coaching right) + 4px progress bar
- Wire up countStoryWords(story, text) at all call sites
- Color coding using app CSS variables (muted / accent / danger)
- Progress bar below textarea
- Coaching messages per tone guide (warm, never reference age)
- Counter denominator is soft limit (hard cap never shown to user)
- aria-live="polite" on counter container

### Task 4: Hard Cap Enforcement

- On input: if words > hard cap, show persistent inline warning (not toast)
- Disable Save button, show "Shorten or split pages over the limit"
- Check ALL pages on save attempt, not just current page
- When text drops below hard cap, re-enable save immediately
- Never truncate, never modify textarea value programmatically

### Task 5: Split Page Suggestion

- Show split button at 80% of hard cap threshold
- Pill button style: primary bg, white text, 20px radius
- Animate in with slide-up + fade (200ms)
- Split algorithm: use Intl.Segmenter('en', { granularity: 'sentence' }) for sentence boundaries
- Fallback: if single sentence, split at word boundary nearest midpoint by word count
- After split: "Done!" feedback (600ms), navigate to new page
- New page: "Continued from page [N]" note in muted text, clears on first edit
- Respect 12-page maximum

### Task 6: Story Helper Integration

- Show word counters on helper text fields ONLY when over soft limit (hidden otherwise)
- After generateStoryFromHelper(), auto-split pages exceeding soft limit
- Toast: "Long pages were split to be easier to follow"
- Cap at 12 pages after split; warn if exceeded
- Count against childAge set in setup step

## Accessibility

- Age selector: role="radiogroup" with aria-label "Child's age in years"
- Each age pill: role="radio" with aria-checked
- Word counter container: aria-live="polite" for screen reader announcements
- Color is NEVER the only indicator -- text messages accompany all color changes
- Hard cap warning announced to screen readers via aria-live
- Split button: aria-label "Split this page into two pages"
- Progress bar: role="progressbar" with aria-valuenow and aria-valuemax

## Acceptance Criteria

### Task 1
- [ ] AGE_CONFIG constant exists with correct values for ages 2-6
- [ ] getAgeConfig(story) returns correct config or null for unset age
- [ ] countStoryWords() uses word-boundary regex for childName exclusion
- [ ] countStoryWords() handles empty childName, special chars, multi-word names
- [ ] Stories save and load childAge property
- [ ] Existing stories without childAge prompt for age on edit

### Task 2
- [ ] Age selector appears as circular pills between name and perspective
- [ ] No default selection -- "Next" disabled until age chosen
- [ ] Pulse animation on "Next" tap without age selected
- [ ] Selecting an age updates editingStory.childAge and enables "Next"
- [ ] Age selector is keyboard accessible
- [ ] Touch targets are 48px minimum
- [ ] Existing stories show current childAge selected, or "not set" state

### Task 3
- [ ] All inline word-count logic removed
- [ ] Word counter shows "X / Y words" format (Y = soft limit)
- [ ] Counter uses app CSS variables (muted / accent / danger)
- [ ] 4px progress bar tracks word count visually
- [ ] Coaching messages use warm tone, never reference age
- [ ] Child's name excluded from word count via word-boundary match
- [ ] aria-live="polite" announces counter changes

### Task 4
- [ ] Parent can type freely past hard cap (no truncation)
- [ ] Persistent inline warning shown at hard cap
- [ ] Save button disabled when any page exceeds hard cap
- [ ] Save re-enables immediately when text shortened below hard cap
- [ ] All pages checked on save, not just current

### Task 5
- [ ] Split button appears at 80% of hard cap
- [ ] Pill button style matches app design
- [ ] Intl.Segmenter used for sentence boundary detection
- [ ] Fallback to word-boundary split for single sentences
- [ ] "Done!" feedback shown briefly after split
- [ ] New page shows "Continued from page [N]" note
- [ ] 12-page maximum respected

### Task 6
- [ ] Helper word counters hidden when under soft limit
- [ ] Helper word counters visible when over soft limit
- [ ] Auto-split generates correct page count
- [ ] Toast uses warm messaging tone
- [ ] 12-page cap enforced after auto-split
