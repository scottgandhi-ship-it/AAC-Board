# Social Stories

## Executive Summary

Add a Social Stories feature to Guiding Steps that allows parents and therapists to create visual stories preparing autistic children (ages 3-6) for routine-disrupting activities. Stories follow Carol Gray's evidence-based Social Stories framework and present as a full-screen, book-like reading experience with page turning. Includes pre-built templates for common scenarios, guided custom story creation, photo upload, TTS narration, and offline support.

## Requirements

- Parents/DTs can create social stories using photos, uploaded images, and guided text
- Reading experience feels like a book (full-screen, swipe/tap page turning, calm and distraction-free)
- Pre-built templates for top scenarios (doctor, dentist, haircut, school, etc.)
- Child name personalization
- Audio narration via TTS
- Offline access to all saved stories
- Read count tracking for parents
- Follows Carol Gray's sentence type ratio (2-5 descriptive/perspective per 0-1 directive)
- No gamification, no sound effects, no auto-advance

## Architecture Overview

### Data Model (IndexedDB)

New object store: socialStories (keyPath: id)

Story object structure:

    {
      id: string (uuid),
      title: string,
      childName: string,
      personMode: 'first' | 'third',
      createdAt: number (timestamp),
      updatedAt: number (timestamp),
      readCount: number,
      lastReadAt: number | null,
      isTemplate: boolean,
      templateKey: string | null,
      pages: [
        {
          text: string,
          sentenceType: 'descriptive' | 'perspective' | 'directive' | 'affirmative' | 'cooperative',
          imageType: 'stock' | 'custom' | 'none',
          stockImageKey: string | null,
          customImageKey: string | null
        }
      ]
    }

Images stored in existing STORE_IMAGES with keys like "story-{storyId}-page-{index}".

### DB Upgrade

Bump DB_VERSION from 1 to 2. Add socialStories store in onupgradeneeded.

### Views and Screens

1. **Stories List View** (new tab) -- grid of saved story cards, "New Story" button (parent mode)
2. **Story Reader** (full-screen overlay) -- book-like reading experience, overlays everything
3. **Story Editor** (parent mode only) -- wizard-style creation/editing flow
4. **Template Picker** (parent mode only) -- browse and select pre-built templates

### Tab Bar

Add a third tab "Stories" between Rewards and Settings:
- Icon: open book SVG
- View: view-stories

### Navigation Flow

    Stories List -> tap story card -> Story Reader (full-screen)
    Stories List -> "New Story" (parent mode) -> Template Picker or Custom Wizard -> Story Editor
    Stories List -> long-press story card (parent mode) -> Edit/Delete options

## Task Breakdown

### Phase A: Data Layer and DB Migration

**A1: DB schema upgrade**
- Bump DB_VERSION to 2
- Add socialStories object store
- Handle upgrade path from v1

**A2: CRUD helpers**
- saveStory(story), loadStories(), loadStory(id), deleteStory(id)
- Increment read count helper: markStoryRead(id)
- Image save/load reuses existing STORE_IMAGES helpers

**A3: Built-in templates data**
- Define DEFAULT_STORY_TEMPLATES array with 8 templates
- Each template has title, pages with text and stock SVG/image keys
- Templates: Doctor, Dentist, Haircut, First Day of School, Fire Drill, Birthday Party, Grocery Store, Visiting Relatives
- Template pages follow story arc: intro -> what to expect -> feelings -> coping -> positive conclusion
- Sentence type ratios follow Carol Gray's guidelines (2-5 descriptive/perspective per 0-1 directive)

### Phase B: Stories List View

**B1: Tab bar integration**
- Add "Stories" tab button with book icon SVG
- Add view-stories div with role="tabpanel"
- Wire into switchTab()

**B2: Stories list UI**
- Grid of story cards showing: title, child name, cover image (first page image), read count
- Empty state: "No stories yet" with guidance text
- Parent mode: "New Story" button visible
- Cards are tappable to open reader

**B3: Stories list CSS**
- Card styling consistent with app design language
- Grid responsive (2 columns on phone, 3 on tablet)
- Cover image aspect ratio maintained
- Read count badge (small, subtle, parent-facing)

### Phase C: Story Reader (Full-Screen)

**C1: Reader overlay HTML/CSS**
- Full-screen overlay (position: fixed, z-index above everything)
- Image area: top 60-70% of screen
- Text area: bottom 30-40%, large sans-serif font, left-aligned
- Solid muted background (soft cream #FFF8F0)
- Page indicator dots at bottom
- Close button (top-left, subtle)
- Navigation arrows (left/right edges, large touch targets 56px+)
- "Read Again" button on final page
- No app chrome visible -- completely immersive

**C2: Reader interaction JS**
- Swipe left/right for page turning (touch events)
- Tap arrow buttons as alternative
- Gentle slide transition between pages (respects reduced motion preference)
- No auto-advance
- Backward navigation allowed
- Track page position, update dots
- On story open: increment read count
- On close: return to stories list

**C3: TTS narration**
- Play button per page (speaker icon, bottom of text area)
- Uses existing TTS system (speak() function, selected voice)
- Auto-stop when page changes
- Respects quiet mode sensory preference

### Phase D: Story Editor (Wizard)

**D1: Template picker screen**
- Grid of template cards with title and brief description
- "Start from Scratch" option
- On template select: pre-populate story with template pages
- On scratch: start with empty story structure guided by wizard

**D2: Story setup step**
- Story title input
- Child name input
- Person mode toggle: "I will..." (first person) vs "[Child name] will..." (third person)
- Next button

**D3: Page editor**
- One page at a time editing
- Image area: upload photo, pick from stock, or no image
- Text input with sentence type label shown (descriptive, perspective, directive, etc.)
- Sentence type selector per page (subtle, not intimidating)
- Character/word count hint ("Keep it short -- aim for under 10 words")
- Add page / remove page / reorder pages
- Page count warning if exceeding 8 (ages 3-4) or 12 (ages 5-6)
- Sentence ratio indicator: show current ratio of descriptive vs directive

**D4: Preview and save**
- Preview button opens the reader in preview mode
- Save button stores story to IndexedDB
- Edit existing stories: same wizard, pre-populated

### Phase E: Stock Images for Templates

**E1: SVG illustrations for template scenarios**
- Simple, clear SVGs for each template page (doctor office, dental chair, barber chair, school building, etc.)
- Style consistent with existing app SVGs (schedule activities)
- These serve as fallbacks -- parents are encouraged to upload real photos

### Phase F: Integration and Polish

**F1: Offline support**
- Stories stored in IndexedDB (already offline)
- Custom images stored as blobs in STORE_IMAGES (already offline)
- Service worker caches index.html (already handled)

**F2: Reset defaults handler**
- Add story data cleanup to reset handler
- Clear socialStories store and associated images

**F3: Settings integration**
- No new settings needed for v1
- TTS voice selection already exists and applies to stories
- Reduced motion preference already exists and applies to page transitions
- Quiet mode already exists and applies to TTS

## Accessibility

- Reader: aria-live region for page text (announced on page change)
- Reader: arrow key navigation between pages
- Page indicator: aria-label "Page X of Y"
- Close button: aria-label "Close story"
- Play narration button: aria-label "Read this page aloud"
- All images: alt text from page text content
- Touch targets: 56px minimum for all reader controls
- Reduced motion: page transitions use opacity fade instead of slide
- High contrast: text and controls adapt to high contrast mode

## Acceptance Criteria

### Phase A
- [ ] DB upgrades cleanly from v1 to v2 without data loss
- [ ] CRUD operations work for stories
- [ ] 8 built-in templates load correctly
- [ ] Read count increments on story open

### Phase B
- [ ] Stories tab appears in tab bar
- [ ] Story cards display in grid with cover image, title, read count
- [ ] Empty state shows when no stories exist
- [ ] New Story button visible only in parent mode
- [ ] Tapping card opens reader

### Phase C
- [ ] Reader is truly full-screen (no app chrome)
- [ ] Swipe and tap arrows both work for page turning
- [ ] Page indicator shows current position
- [ ] "Read Again" appears on final page
- [ ] Close button returns to stories list
- [ ] Reduced motion preference disables slide animation
- [ ] Reader works offline

### Phase D
- [ ] Template picker shows all 8 templates
- [ ] "Start from Scratch" launches wizard
- [ ] Child name personalizes all template text
- [ ] Photo upload per page works
- [ ] Sentence type guidance visible during editing
- [ ] Sentence ratio indicator updates in real time
- [ ] Preview shows exact reader experience
- [ ] Save persists to IndexedDB
- [ ] Edit existing story pre-populates wizard

### Phase E
- [ ] Every template page has a stock SVG
- [ ] SVGs are clear, realistic-style, and uncluttered

### Phase F
- [ ] All stories available offline after creation
- [ ] Reset defaults clears all stories and images
- [ ] TTS voice selection applies to story narration
- [ ] Sensory preferences (motion, contrast, quiet) apply to reader
