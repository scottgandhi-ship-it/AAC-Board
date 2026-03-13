# Entertainment & Food Vocabulary Expansion

## Executive Summary

Three-part feature: (1) Add a new "Entertainment" vocabulary folder with screen-time and media words, (2) expand Food folder with fruits, vegetables, and snacks, and (3) add parent-mode UI for adding custom show/movie names to the Entertainment folder. All words include Spanish translations and follow existing Fitzgerald Key color coding.

## Requirements

1. **Entertainment folder** -- New top-level folder with media/screen-time vocabulary
2. **Food expansion** -- Add fruits, vegetables, snacks, and more meals to existing Food folder
3. **Custom shows input** -- Parent-mode feature letting caregivers add specific TV show, movie, and YouTube show names their child watches

## Marci's Consultation (Early Intervention Specialist)

### Entertainment Vocabulary Rationale

Now here's the thing, sugar -- screen time vocabulary is one of the most requested categories I see in clinic. These kiddos are HIGHLY motivated by their shows and devices. When a child can request "I want to watch Bluey" instead of melting down because they can't tell you what they want, that is a communication breakthrough.

**Why a dedicated Entertainment folder matters:**
- Screen time is a top-3 daily activity for most young children
- Media preferences are deeply personal and motivating -- perfect for building communication
- Transition language ("turn off", "all done", "one more") reduces meltdowns around screen time
- Joint attention during shared viewing is a therapy goal -- kids need words for it

**Recommended Entertainment words (18 words):**

| ID | Label | Color | Rationale |
|----|-------|-------|-----------|
| ent-watch | watch | green (verb) | Core action verb for all screen time |
| ent-movie | movie | orange (noun) | Category request |
| ent-show | show | orange (noun) | Category request for TV shows |
| ent-video | video | orange (noun) | YouTube/tablet content |
| ent-cartoon | cartoon | orange (noun) | Many kids distinguish cartoons from other content |
| ent-music | music | orange (noun) | Music videos, streaming, singing along |
| ent-song | song | orange (noun) | Requesting specific songs |
| ent-remote | remote | orange (noun) | Requesting the physical object |
| ent-turn-on | turn on | green (verb) | Device control |
| ent-turn-off | turn off | green (verb) | Device control / transition language |
| ent-pause | pause | green (verb) | Requesting pause -- reduces grabbing |
| ent-again | again | blue (descriptor) | "Watch it again" -- extremely high frequency |
| ent-funny | funny | blue (descriptor) | Commenting on content |
| ent-scary | scary | blue (descriptor) | Communicating discomfort with content |
| ent-favorite | favorite | blue (descriptor) | Expressing preference |
| ent-this-one | this one | yellow (pronoun) | Selecting from options |
| ent-that-one | that one | yellow (pronoun) | Selecting from options |
| ent-different | different one | blue (descriptor) | Rejecting current, requesting change |

**Note:** "TV", "tablet", "headphones", and "phone" already exist in Things/Toys folders. We do NOT duplicate them (motor planning consistency). The Entertainment folder focuses on actions, content types, and descriptors specific to media use.

### Food Expansion Rationale

Honey, these food words are going to make mealtimes so much smoother. Right now we have 25 foods and they're solid staples, but we're missing entire food groups that kids encounter daily. A child who can say "I want watermelon" instead of pointing and crying? That's the goal.

**Fruits to add (7 words):**

| ID | Label | Spanish | Rationale |
|----|-------|---------|-----------|
| food-blueberry | blueberries | arandanos | Common snack, high preference |
| food-watermelon | watermelon | sandia | Summer staple, highly motivating |
| food-orange | orange | naranja | Daily fruit, important to distinguish from color |
| food-pineapple | pineapple | pina | Common in many households |
| food-mango | mango | mango | Popular across cultures |
| food-peach | peach | durazno | Common fruit |
| food-pear | pear | pera | Common fruit |

**Vegetables to add (8 words):**

| ID | Label | Spanish | Rationale |
|----|-------|---------|-----------|
| food-broccoli | broccoli | brocoli | Most recognized vegetable for kids |
| food-carrots | carrots | zanahorias | Very common, often a preferred veggie |
| food-corn | corn | maiz | Kid-friendly staple |
| food-peas | peas | chicharos | Common side dish |
| food-green-beans | green beans | ejotes | Common dinner vegetable |
| food-potatoes | potatoes | papas | Extremely common, many preparations |
| food-tomato | tomato | tomate | Common in many meals |
| food-cucumber | cucumber | pepino | Common snack/salad item |

**Snacks to add (8 words):**

| ID | Label | Spanish | Rationale |
|----|-------|---------|-----------|
| food-popcorn | popcorn | palomitas | Movie/screen time snack, motivating |
| food-chips | chips | papitas | Very common snack |
| food-pretzels | pretzels | pretzels | Common snack |
| food-granola | granola bar | barra de granola | On-the-go snack |
| food-goldfish | goldfish | galletas de pescado | Extremely popular toddler/preschool snack |
| food-peanut-butter | peanut butter | mantequilla de mani | Staple food |
| food-jelly | jelly | mermelada | PB&J is a top kid meal |
| food-applesauce | applesauce | puree de manzana | Texture-friendly option |

**More meals to add (8 words):**

| ID | Label | Spanish | Rationale |
|----|-------|---------|-----------|
| food-mac-cheese | mac and cheese | macarrones con queso | Top kid meal nationwide |
| food-hot-dog | hot dog | hot dog | Very common kid meal |
| food-hamburger | hamburger | hamburguesa | Common meal |
| food-taco | taco | taco | Common across cultures |
| food-meatballs | meatballs | albondigas | Common dinner food |
| food-toast | toast | tostada | Breakfast staple |
| food-oatmeal | oatmeal | avena | Breakfast staple, texture-friendly |
| food-waffle | waffle | waffle | Breakfast favorite |

### Custom Shows Feature Rationale

Now THIS is where the magic happens. Every single family I work with has a list of shows their kiddo is obsessed with. Bluey, Cocomelon, Ms. Rachel, Peppa Pig, Paw Patrol -- these are not just entertainment, they're comfort items. A child should be able to say "I want Bluey" just like they can say "I want apple."

**Design requirements from a therapy perspective:**
- Parent adds the show name via settings (not the child)
- Custom shows appear inside the Entertainment folder alongside the default words
- Keep it simple -- just a text label, orange color (noun), standard button
- No limit on number but recommend 8-12 as a practical max
- Shows should be ordered after the default entertainment words
- Custom shows persist across sessions (IndexedDB)

## Architecture Overview

### Part 1: Entertainment Folder

- Add folder-entertainment to all grid layouts (HOME_GRID_3X3_FOLDERS, 4X4, 5x5, DEFAULT_BUTTONS)
- Add 18 default entertainment words to DEFAULT_BUTTONS with folderId: 'entertainment'
- Add Spanish translations to _buildLangEs()
- Add noun genders where applicable
- Add to THREE_BY_THREE_FOLDERS, FOUR_BY_FOUR_FOLDERS sets
- Add "Screen Time" activity bundle to ACTIVITY_BUNDLES

### Part 2: Food Expansion

- Add 31 new food words to DEFAULT_BUTTONS in the Food section
- Re-number positions for all food words (existing + new)
- Add Spanish translations to _buildLangEs()
- Add noun genders
- Update symbolKeywords

### Part 3: Custom Shows (Parent Mode)

- Add "My Shows" section inside the Entertainment folder (rendered after default words)
- In parent mode, show an "Add Show" button at the end of the Entertainment folder
- Tapping "Add Show" opens a simple modal with a text input field
- Custom shows stored in IndexedDB alongside buttons array
- Custom shows get auto-generated IDs (ent-custom-{timestamp})
- Parent can delete custom shows via long-press in parent mode

## Task Breakdown

### Phase 1: Entertainment Folder + Words (Subphase 2A)
- [ ] Add folder-entertainment to all grid folder arrays
- [ ] Add 18 entertainment words to DEFAULT_BUTTONS
- [ ] Add Spanish translations (labels + symbolKeywords)
- [ ] Add noun genders
- [ ] Add folder to THREE_BY_THREE_FOLDERS and FOUR_BY_FOUR_FOLDERS sets
- [ ] Add "Screen Time" activity bundle

### Phase 2: Food Expansion (Subphase 2B)
- [ ] Add 31 new food words to DEFAULT_BUTTONS
- [ ] Re-number all food positions (0 through 55)
- [ ] Add Spanish translations (labels + symbolKeywords)
- [ ] Add noun genders
- [ ] Update mealtime activity bundle if needed

### Phase 3: Custom Shows Input (Subphase 2C)
- [ ] Add "Add Show" button rendering in Entertainment folder (parent mode only)
- [ ] Create modal UI for adding a show name (text input + save + cancel)
- [ ] Save custom shows as button objects in IndexedDB
- [ ] Render custom shows in Entertainment folder after default words
- [ ] Add long-press to delete custom shows in parent mode
- [ ] Custom shows work with TTS (speak the show name)

### Phase 4: Cache + Deploy (Subphase 2D)
- [ ] Bump service worker cache version
- [ ] Test on device
- [ ] Verify existing users get new vocabulary on next load

## Acceptance Criteria

1. Entertainment folder appears on home grid across all grid sizes
2. All 18 entertainment words display correctly with proper Fitzgerald colors
3. All 31 new food words display in Food folder with correct positions
4. Spanish translations work for all new words in bilingual mode
5. "Add Show" button appears only in parent mode inside Entertainment folder
6. Custom shows persist across sessions and app restarts
7. Custom shows appear in word picker and search
8. TTS speaks all new words correctly in both languages
9. Motor planning consistency maintained -- no existing words moved
10. Service worker cache updated for offline support

## Integration Points

- DEFAULT_BUTTONS array (vocabulary data)
- _buildLangEs() function (Spanish translations)
- HOME_GRID_*_FOLDERS arrays (grid layouts)
- THREE_BY_THREE_FOLDERS / FOUR_BY_FOUR_FOLDERS sets (folder filtering)
- ACTIVITY_BUNDLES array (screen time bundle)
- IndexedDB (custom shows storage)
- Parent mode rendering (add show button)
- Word picker / search (new words discoverable)
- Service worker (cache version bump)

## Accessibility Considerations

- All new buttons meet 44x44px minimum touch targets (inherited from existing system)
- Fitzgerald Key colors maintained for consistent visual coding
- Screen reader labels for all new buttons
- "Add Show" modal must be keyboard accessible with proper focus management
- Custom show delete confirmation to prevent accidental removal
