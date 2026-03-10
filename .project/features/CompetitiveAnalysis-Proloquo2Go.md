# Comparative Analysis: AAC Board vs Proloquo2Go

**Date**: 2026-03-09
**Agents**: Marci (Early Intervention), Reggie (Parent Voice), Research Team
**Status**: Complete

---

## Executive Summary

Proloquo2Go is the dominant AAC app for iOS, built over 15+ years by AssistiveWare. At $249.99, it is the clinical gold standard. AAC Board is a modern, research-backed challenger at $9.99 -- 25x cheaper, cross-platform, with stronger analytics and onboarding. Our vocabulary depth (415 words vs 10,000+) and platform maturity (PWA vs native iOS) are the two largest gaps. But we have real, exploitable advantages that Proloquo2Go cannot easily replicate.

---

## Section 1: Head-to-Head Feature Comparison

### Vocabulary

| Dimension | AAC Board | Proloquo2Go | Advantage |
|-----------|-----------|-------------|-----------|
| Total words available | 415 | 10,000+ (4,750 immediate + 7,250 in storage) | P2G |
| Core words | 5 persistent (I, want, don't want, more, help) | Core words on home + every fringe page | P2G |
| Vocabulary systems | Single system, progressive by grid size | Crescendo (free) + Gateway (paid add-on) | P2G |
| Vocabulary tiers | Grid-based (3x3 to 6x6) | VocaPriority 3-tier (Primary/Secondary/Storage) | P2G |
| Folder organization | 22 folders, activity-based + taxonomic | 12 core-word templates, activity-based | Comparable |
| Motor planning | Core strip locked, positions never move | Core words same position on home + fringe pages | Comparable |
| Progressive disclosure | Grid size controls word access | Hide/reveal buttons without changing grid | P2G |
| Activity overlays | 11 pre-built contextual bundles | Templates maintain core word positions | AAC Board |

**Marci's Take**: "Honey, 415 words is fine for Level 1-2 communicators -- most of my kiddos ages 2-4 use 50-200 words actively. But the device needs to be a step ahead for modeling. Proloquo2Go's depth means a child can grow into it for years without switching apps. That's a real clinical advantage for long-term therapy plans. Our sweet spot right now is the 2-4 age range where 415 words is plenty. But we need a clear path to 1,500+ for Level 3-4."

**Reggie's Take**: "10,000 words sounds impressive until you realize my daughter uses maybe 40 of them. What matters is whether the RIGHT 40 are easy to find. If AAC Board nails that for the early years, I'll deal with switching later. But if I'm paying $250 for Proloquo2Go, I better not have to switch at all."

### Grid System

| Dimension | AAC Board | Proloquo2Go | Advantage |
|-----------|-----------|-------------|-----------|
| Grid sizes | 4 options (3x3, 4x4, 5x5, 6x6) | 23 options (9 to 144 buttons per page) | P2G |
| Per-folder grid override | No | Yes | P2G |
| Manual layout mode | No | Yes (precise positioning with gaps) | P2G |
| Grid size change impact | Resets to defaults (warning shown) | Preserves customizations | P2G |

**Marci's Take**: "Now here's the thing -- 23 grid sizes is overkill for most families. An SLP picks 1-2 sizes and sticks with them. Our 4 options cover the clinical sweet spot. But that per-folder override? That's genuinely useful. Photo folders with bigger buttons, action folders with smaller ones. That's smart."

### Word Prediction & Grammar

| Dimension | AAC Board | Proloquo2Go | Advantage |
|-----------|-----------|-------------|-----------|
| Prediction engine | Hardcoded chains + learned bigrams | PolyPredix self-learning multi-word engine | P2G |
| Prediction display | Bar between message bar and core strip | Configurable (2-10 predictions) | Comparable |
| Grammar engine | 3 toggles: plurals, verb conjugation, articles | Full Ultralingua ULAPI engine (all tenses, comparatives, superlatives, possessives) | P2G |
| Grammar UI | Auto-applied at speech time | Tap-and-hold popup showing word forms | P2G |
| Grammar filtering | No | Filter by word kind or tense | P2G |
| Spanish grammar | Yes (parallel engine) | Yes | Comparable |

**Marci's Take**: "For my 2-4 year olds, our grammar is plenty. They're not conjugating past perfect. Plurals, basic verb forms, and articles -- that's exactly right for early language development. Proloquo2Go's full engine matters more for school-age kids and adults. Don't over-build this yet."

### Speech & Voice

| Dimension | AAC Board | Proloquo2Go | Advantage |
|-----------|-----------|-------------|-----------|
| Voice engine | Web Speech API (browser default voices) | 100+ Acapela voices (neural quality) | P2G |
| Child/teen voices | Whatever OS provides | Dedicated child and teen voices | P2G |
| Personal voice | No | iOS Personal Voice support | P2G |
| Voice in calls | No | Audio in Calls (iOS 18.2+) | P2G |
| Voice selection UI | Basic (rate, pitch, voice picker) | Full voice browser with previews | P2G |
| Secondary cue voice | No | Yes (distinguishes cue from message) | P2G |

**Marci's Take**: "Sugar, this is a big one. Voice matters so much for identity. A 4-year-old boy should not sound like a 40-year-old woman. Proloquo2Go's child voices are a real differentiator. Web Speech API gives us whatever the device has -- which on iOS is decent but on Android can be rough. TTS voice selection needs to be on our roadmap, and soon."

**Reggie's Take**: "My daughter's voice IS her voice, even if it comes from a device. If it sounds robotic or adult, it feels wrong. This isn't a nice-to-have. It's emotional."

### Language Support

| Dimension | AAC Board | Proloquo2Go | Advantage |
|-----------|-----------|-------------|-----------|
| Languages | 2 (English, Spanish) | 4 (English, Spanish, French, Dutch) with regional variants | P2G |
| Regional variants | No | US/UK/AU/CA English, Castilian/American Spanish | P2G |
| Bilingual mode | Yes (both labels on buttons) | Yes (mid-sentence language switching) | P2G |
| Bilingual pairs | English-Spanish | EN-ES, EN-FR(CA), NL-FR(BE) | P2G |
| Language toggle | Settings toggle | Per-button language and voice settings | P2G |

**Marci's Take**: "For the US market focused on autism ages 2-6, English and Spanish covers about 95% of families we'd see in early intervention. French and Dutch are nice but not critical for our audience. The bilingual mode showing both labels -- that's actually a really nice feature for bilingual households."

### Customization

| Dimension | AAC Board | Proloquo2Go | Advantage |
|-----------|-----------|-------------|-----------|
| Button editing | Label, color, image, position | Label, symbol, voice, color, action | P2G |
| Photo upload | Yes (IndexedDB cached) | Yes (camera roll) | Comparable |
| Symbol library | ARASAAC (15,000+) | SymbolStix (27,000+) | P2G |
| Per-button voice | No | Yes | P2G |
| Per-button language | No | Yes | P2G |
| Color coding | 12 Fitzgerald Key colors | Predefined schemes + custom | Comparable |
| Edit mode security | Parent mode toggle (no password yet) | PIN/security questions + iOS Settings lock | P2G |
| Multi-user | No | Yes (separate user profiles on one device) | P2G |

**Reggie's Take**: "Multi-user matters. If my daughter uses the iPad at home AND at school, her SLP and I need different setups. Or if I have two kids. No multi-user means I'm buying two devices or constantly reconfiguring."

### Accessibility & Access Methods

| Dimension | AAC Board | Proloquo2Go | Advantage |
|-----------|-----------|-------------|-----------|
| Direct touch | Yes | Yes | Comparable |
| Switch scanning | No | Yes (5 scanning modes, built-in) | P2G |
| Eye tracking | No | Yes | P2G |
| Apple Watch input | No | Yes (companion app + switch) | P2G |
| Select on release | No | Yes (touch, hear preview, release to select) | P2G |
| Screen reader | Semantic HTML, aria labels | Full VoiceOver compatibility | Comparable |
| Sensory toggles | 3 (reduced motion, high contrast, quiet) | Light/dark mode, Dynamic Type | AAC Board |
| Touch target sizing | 44x44px minimum | Configurable via grid size | Comparable |
| Keyguard support | No | Yes | P2G |

**Marci's Take**: "Bless his heart, switch access and eye tracking matter for kids with motor impairments, but that's a different population than our primary audience. Most of my autism kiddos ages 2-6 use direct touch just fine. Our sensory toggles -- reduced motion, high contrast, quiet mode -- are actually MORE relevant for autistic children than what Proloquo2Go offers. That's a real win."

### Data & Analytics

| Dimension | AAC Board | Proloquo2Go | Advantage |
|-----------|-----------|-------------|-----------|
| Usage tracking | Yes (word frequency, daily counts, streaks) | Almost none | **AAC Board** |
| Insights dashboard | Top 10 words, 7-day chart, Fitzgerald-coded | No dashboard | **AAC Board** |
| Data export | CSV export for SLPs | No structured export | **AAC Board** |
| Data privacy | On-device only, 90-day window, 15K cap | No data collected | Comparable |
| Recents view | Message bar history | Recent utterances view | Comparable |

**Marci's Take**: "Now THIS is where y'all shine, and I mean that. In my 20 years, the #1 complaint from SLPs about AAC devices is 'I can't tell if the child is actually using it between sessions.' Proloquo2Go has basically NO analytics. We have word frequency, daily usage, streaks, top words by Fitzgerald color, and CSV export. That is a game-changer for therapy planning. This is our differentiator. Lean into it hard."

**Reggie's Take**: "Wait, you're telling me the $250 app doesn't tell me which words my daughter uses most? And the $10 app does? Lead with that. That's the ad."

### Onboarding & Training

| Dimension | AAC Board | Proloquo2Go | Advantage |
|-----------|-----------|-------------|-----------|
| First-launch wizard | Yes (welcome, grid picker, coach marks) | Basic setup wizard (voice, language, user) | **AAC Board** |
| Interactive tutorial | Yes (3-tap guided walkthrough) | No | **AAC Board** |
| In-app guide | 8 accordion tips in Settings | Help button linking to external resources | **AAC Board** |
| External training | None yet | YouTube videos, Facebook group | P2G |
| Tutorial replay | Yes | N/A | **AAC Board** |

**Marci's Take**: "Onboarding is everything for parent adoption. If a mama opens this app at 9 PM after her kid's been in meltdown all day and she can't figure out how to use it in 2 minutes, she deletes it. Our guided setup is better than Proloquo2Go's. That's not nothing."

### Platform & Pricing

| Dimension | AAC Board | Proloquo2Go | Advantage |
|-----------|-----------|-------------|-----------|
| Platform | Web PWA (any device with a browser) | iOS only (iPad, iPhone, Mac, Apple Watch) | **AAC Board** |
| Price | $9.99 one-time (planned) | $249.99 one-time | **AAC Board** |
| Chromebook support | Yes (PWA) | No | **AAC Board** |
| Android support | Yes (PWA) | No | **AAC Board** |
| School device support | Any device | Apple devices only | **AAC Board** |
| Offline capability | Full (service worker + IndexedDB) | Native app (always offline) | Comparable |
| App store presence | Not yet | iOS App Store | P2G |
| Backup/sync | File-based export (.aacboard) | AirDrop, iCloud, Google Drive, Dropbox | P2G |

**Reggie's Take**: "93% of school Chromebooks can't run Proloquo2Go. Full stop. If my daughter's school uses Chromebooks -- and they do -- she can use AAC Board at school and at home. That's not a feature, that's access. And $10 vs $250? Even with insurance or IEP funding, $250 is a fight. $10 is a no-brainer impulse buy."

### Export & Sharing

| Dimension | AAC Board | Proloquo2Go | Advantage |
|-----------|-----------|-------------|-----------|
| Board export | .aacboard JSON format | Full user backups | Comparable |
| Export methods | File download | AirDrop, iCloud, Google Drive, Dropbox, iTunes | P2G |
| Import modes | Full replace only (v1) | Restore to current/original/new user | P2G |
| Auto-backup | No | Yes (Dropbox/Google Drive, 3 most recent) | P2G |
| Folder sharing | Not yet | Yes (one level deep) | P2G |
| OBF format | Not yet | Not yet | Comparable |

### Reward System & Schedules

| Dimension | AAC Board | Proloquo2Go | Advantage |
|-----------|-----------|-------------|-----------|
| Reward tracker | Yes (multi-track, visual progress, celebration) | No | **AAC Board** |
| Visual schedules | Yes (29 activities, template system, step-by-step) | No | **AAC Board** |
| Activity overlays | 11 contextual bundles (Mealtime, Bath, etc.) | No direct equivalent | **AAC Board** |

**Marci's Take**: "Proloquo2Go is purely a communication device. We're building a communication + daily living tool. Visual schedules and reward trackers are things families use every single day. Having them built into the same app as the communication board? That's integration that saves a parent from juggling 3 different apps. That's real value."

---

## Section 2: Where We Win

### 1. Price (25x cheaper)
$9.99 vs $249.99. Even with IEP funding or insurance reimbursement, the approval process for $250 takes weeks. $10 is an impulse buy. For families without insurance coverage, this is the difference between having an AAC device and not having one.

### 2. Platform (Cross-platform vs iOS-only)
93% of school Chromebooks can't run Proloquo2Go. AAC Board runs on anything with a browser. Android phones, Chromebooks, Windows tablets, iPads -- all of them. For schools and families who aren't in the Apple ecosystem, we're the only option.

### 3. Usage Analytics (We have them, they don't)
This is our single biggest competitive moat for SLP adoption. Word frequency tracking, daily usage charts, streak counting, Fitzgerald-coded top words, CSV export. Proloquo2Go has essentially no analytics. Every SLP we've spoken to says data collection is their #1 pain point with AAC devices.

### 4. Onboarding (Interactive vs basic wizard)
Our guided setup with coach marks, grid picker with visual preview, and 8-tip Getting Started guide is meaningfully better than Proloquo2Go's basic setup wizard + external YouTube videos. Parent activation is a critical funnel metric.

### 5. Reward Tracker + Visual Schedules (They don't have these)
Built-in daily living tools that complement communication. No app switching. Families already use visual schedules and reward systems -- having them in the same app as AAC is genuine integration.

### 6. Activity Overlays (Context-specific vocabulary)
11 pre-built activity bundles (Mealtime, Bath Time, Playground, etc.) that surface the right words at the right time. This is how real therapy sessions work -- vocabulary in context.

### 7. Sensory-Friendly Toggles
Reduced motion, high contrast, and quiet mode are more relevant to autistic children than Proloquo2Go's light/dark mode toggle. Our sensory options were designed with our target population in mind.

---

## Section 3: Where They Win

### 1. Vocabulary Depth (10,000+ vs 415)
This is the biggest gap. While 415 words covers Level 1-2 communicators well, families need confidence their child can grow into the app. Proloquo2Go's depth means a child can use it from age 2 to adulthood without switching.

**Priority**: HIGH -- Levels 3-4 vocabulary (1,500-4,750 words) is needed for clinical credibility with SLPs.

### 2. Voice Quality (100+ neural voices vs Web Speech API)
Dedicated child and teen voices, neural quality Acapela voices, Personal Voice support. Voice is identity for AAC users. Web Speech API quality varies dramatically by device.

**Priority**: HIGH -- Multiple TTS voices is already on the roadmap (Gap 2 in Investor Alignment).

### 3. Native iOS App
App Store presence, Apple Watch companion, eye tracking support, Audio in Calls. Native gives deeper OS integration that a PWA can't fully match.

**Priority**: HIGH -- iOS app is Milestone 5.

### 4. Switch Access & Alternative Input
5 scanning modes, external switch support, eye tracking, Apple Watch as switch. Critical for users with motor impairments.

**Priority**: MEDIUM -- Not our primary audience (autism ages 2-6 primarily use direct touch), but important for broader market.

### 5. Grammar Depth
Full linguistic engine with all tenses, comparatives, superlatives, possessives. Our 3-toggle system covers early communication needs but doesn't scale to complex language.

**Priority**: LOW for now -- early communicators don't need past perfect tense.

### 6. Multi-User Support
Separate user profiles on one device. Important for shared devices at school or families with multiple AAC users.

**Priority**: MEDIUM -- requires cloud infrastructure.

### 7. Backup & Sync
AirDrop, iCloud, Google Drive, Dropbox, auto-backup with 3 most recent copies. Our file-based export is functional but primitive by comparison.

**Priority**: MEDIUM -- Cloud sync is Phase 3 (Gap 16 in Investor Alignment).

### 8. Per-Folder Grid Sizes
Photo folders with bigger buttons, action folders with smaller ones. Clinically useful for mixed motor/vision needs.

**Priority**: LOW -- nice to have, not blocking.

---

## Section 4: Strategic Positioning

### Our Niche (Where We Dominate)
**Families with autistic children ages 2-6 who need an affordable, cross-platform AAC solution with built-in therapy tools and usage tracking.**

Proloquo2Go cannot compete here because:
- They can't drop to $9.99 (their business model requires $249.99)
- They can't run on Chromebooks or Android (iOS-only architecture)
- They haven't built analytics in 15+ years (it's not in their DNA)
- They don't have reward trackers or visual schedules (pure communication focus)

### Their Niche (Where We Don't Compete Yet)
**Clinical/institutional AAC for all ages and disability types, with deep vocabulary and alternative access methods.**

We shouldn't try to compete here until:
- Vocabulary reaches 1,500+ words (Level 3)
- iOS native app is shipping
- Switch access is implemented (if targeting motor impairments)

---

## Section 5: Marci's Clinical Summary

"Here's the honest truth, sugar. Proloquo2Go is like a luxury SUV -- it does everything, it's been road-tested for 15 years, and every SLP knows how to use it. But it costs as much as a used car and it only runs on Apple roads.

AAC Board is like a really well-designed electric scooter. It gets you where you need to go for the early years, it runs on any road, and it costs less than dinner out. For a family just starting their AAC journey with a 2-4 year old autistic child, it's not just 'good enough' -- it's actually better in some ways. The analytics alone would make me recommend it to families.

But here's where I'd push: the vocabulary gap is real for clinical credibility. When I recommend a device to a family, I need to know the child won't outgrow it in a year. Getting to 1,500 words with solid Level 3 coverage would let me recommend AAC Board with confidence for children up to age 6-7. And those TTS voices -- a child's voice should sound like a child. That matters more than most engineers realize.

The reward tracker and visual schedules? Those are things I literally print out and tape to refrigerators every week. Having them IN the communication device is brilliant. Proloquo2Go has never done this, and I don't think they will -- it's not their vision. That's y'all's opening."

---

## Section 6: Reggie's Parent Summary

"Okay, real talk. I've tried Proloquo2Go. It's powerful but overwhelming. The first time I opened it, I spent 45 minutes just trying to figure out which grid size to pick from 23 options. And $250? I had to fight with insurance for 3 months.

AAC Board at $10 with a guided setup that walks me through it? I would have downloaded that at 2 AM the night after diagnosis and had it running before the first therapy appointment.

Here's what I care about as a mom:
1. Can my daughter communicate her basic needs? -> Both do this.
2. Can I see what words she's using? -> Only AAC Board does this well.
3. Can it run on her school Chromebook? -> Only AAC Board.
4. Will she outgrow it? -> Proloquo2Go wins here. For now.
5. Does it feel like it was made for MY kid? -> AAC Board's activity overlays and sensory options feel more personal.

The value proposition is clear: AAC Board is the best first AAC app. Proloquo2Go is the best last AAC app. We need to own 'first' and build toward 'only.'"

---

## Section 7: Recommended Actions

### Immediate (Close the credibility gaps)
1. **Vocabulary expansion to 1,500+ words** -- Level 3 coverage for clinical credibility
2. **Multiple TTS voices** -- Child/teen voices are identity, not a feature
3. **Password-protected parent mode** -- PIN lock for edit mode (table stakes)

### Near-term (Widen our advantages)
4. **Marketing the analytics gap** -- "The only AAC app that tells you what words your child uses" -- lead with this
5. **Chromebook/school positioning** -- Target school districts (93% Chromebook adoption)
6. **Enhanced data export** -- SLP-friendly progress reports, not just raw CSV

### Medium-term (Compete on depth)
7. **iOS native app** -- App Store presence for credibility and distribution
8. **Cloud sync** -- Multi-device, parent+SLP shared access
9. **OBF format support** -- Interoperability with other AAC systems
10. **Multi-user profiles** -- Shared device support for schools

---

## Appendix: Data Sources

- AssistiveWare product pages and support documentation
- Proloquo2Go App Store listing and release notes (v8.3-v8.7.3)
- Crescendo and Gateway vocabulary documentation
- AAC Board codebase audit (index.html, 11,600 lines)
- AAC Board ROADMAP.md and investor alignment analysis
- ARASAAC symbol library documentation
- AssistiveWare blog posts on grid sizes, grammar, bilingual AAC, VocaPriority
