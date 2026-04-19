# Initial Launch Plan -- AAC Board + Guiding Steps

## Executive Summary

Prepare both AAC Board and Guiding Steps for initial iOS App Store launch. iOS-first strategy, flat pricing (no subscription), with a marketing website and donate button. Android development follows post-launch.

---

## Stream 1: Branding & Identity

### 1A. App Names (Decision Required)

**AAC Board**
- Current name: "AAC Communication Board" (manifest), "AAC Board" (iOS bundle)
- Problem: "AAC" is clinical jargon. Parents searching the App Store may not know the term.
- Options to consider:
  - Keep "AAC Board" (clear to therapists, less so to parents)
  - Add a consumer-friendly subtitle: "AAC Board -- Communication for Kids"
  - Rename entirely to something parent-friendly (e.g., "TalkTiles", "SpeakBoard")
  - Use a parent-friendly name with "AAC" in the subtitle for searchability
- Apple allows: App Name (30 chars) + Subtitle (30 chars)

**Guiding Steps**
- Current name works well -- descriptive, warm, parent-friendly
- Subtitle opportunity: "Visual Schedules & Social Stories for Autism"

### 1B. Logo & Icon Review

- AAC Board icon exists: aac-board-icon-1024.png
- Guiding Steps icon exists: guiding-steps-icon-1024.png
- Both need visual review for App Store context:
  - Does it read well at 60x60px (home screen size)?
  - Does it stand out in search results?
  - Is the style consistent across both apps (family of products)?
  - Does it communicate the app's purpose at a glance?

### 1C. App Store Copy

For each app, we need:
- **App Name** (30 characters max)
- **Subtitle** (30 characters max)
- **Description** (4000 characters max, first 3 lines visible before "more")
- **Promotional Text** (170 characters, can be updated without new build)
- **Keywords** (100 characters, comma-separated, no spaces after commas)
- **What's New** text for v1.0
- **Support URL**
- **Marketing URL**

### 1D. Screenshots

Apple requires 6.7" (iPhone 15 Pro Max) and 6.5" (iPhone 11 Pro Max) sizes minimum.
Recommended: 5-8 screenshots per app showing key features.

**AAC Board screenshots needed:**
1. Communication board with sentence bar
2. Vocabulary folders open
3. Activity walkthrough in action
4. Settings/customization options
5. Grid size options (early learner -> advanced)

**Guiding Steps screenshots needed:**
1. Visual schedule with activities
2. Reward tracker with stepping stone path
3. Social story reading view
4. Story creation wizard
5. Settings/sensory options

---

## Stream 2: Pricing Strategy

### 2A. Pricing -- DECIDED

**Model:** Paid upfront (no IAP, no subscription, no free tier)

| App | Price | Apple Cut (15%) | Net per Sale |
|-----|-------|-----------------|--------------|
| AAC Board | $9.99 | $1.50 | $8.49 |
| Guiding Steps | $4.99 | $0.75 | $4.24 |
| Both apps | $14.98 | $2.25 | $12.73 |

**Rationale:**
- $9.99 is the established parent-tier price point (matches First Then Visual Schedule)
- $4.99 undercuts Choiceworks ($6.99) while signaling "real app" (not throwaway)
- Combined $14.98 is dramatically cheaper than professional AAC tools ($100-$300)
- Paid upfront = zero IAP implementation, clean UX, every user gets the full app
- No StoreKit 2 integration needed -- saves 1-2 weeks of development
- Apple Small Business Program (15% cut) applies under $1M/year revenue

**Market context:**
- Professional tier: Proloquo2Go ($249.99), TouchChat ($299.99), LAMP ($299.99)
- Parent tier: Choiceworks ($6.99), First Then Visual Schedule ($9.99)
- We are firmly in the parent tier

### 2B. iOS Distribution

- Both apps listed as paid apps in App Store (no free tier, no IAP)
- Price set in App Store Connect per territory
- Apple handles all payment processing and refunds
- No payment-related code needed in the apps themselves

---

## Stream 3: Git Branching Strategy

### 3A. Branch Structure

```
main (or master) -- production/live builds, App Store releases
  |
  +-- develop -- active development, feature integration
       |
       +-- feature/* -- individual feature branches
```

**Branch structure -- DECIDED:**
- `master` -- production/live builds, App Store releases (keeping existing name)
- `develop` -- active development, feature integration, internal testing
- `feature/*` -- individual feature branches off `develop`
- Hotfixes branch from `master`, merge back to both `master` and `develop`
- Tag releases on `master`: `v1.0.0`, `v1.0.1`, etc.

### 3B. TestFlight Distribution -- DECIDED (Option B: TestFlight Groups)

- **Internal Testing group** -- builds from `develop`, just the dev team
  - Used for QA, device testing, iterating on features
- **External Testing group** -- builds from `master`, beta testers
  - Used for pre-launch beta program and final validation
- Same app, same bundle ID, different distribution groups
- Build numbers auto-increment so TestFlight keeps them sorted
- Beta testers never see half-baked builds

### 3C. Release Process

1. Feature freeze on `develop`
2. QA pass on `develop` (Internal Testing group)
3. Open PR from `develop` to `master`
4. **Pre-merge gate: run `/review <PR-url>` in Claude Code.** Address any blockers Steve flags before merging. No merge without a clean review.
5. Merge `develop` -> `master`
6. Tag release (`v1.0.0`)
7. Fastlane builds from `master`
8. Push to External Testing group for final beta validation
9. Submit to App Store Review
10. Post-release: merge `master` back to `develop` (picks up any hotfix tags)

---

## Stream 4: Quality Assurance

### 4A. Full QA Pass -- AAC Board

**Functional testing:**
- [ ] All 415 vocabulary words render correctly
- [ ] All vocabulary folders open/close properly
- [ ] Sentence bar builds and clears correctly
- [ ] TTS speaks sentences in English and Spanish
- [ ] Grammar engine applies correctly (plurals, conjugation, articles)
- [ ] Word predictions appear and are contextually relevant
- [ ] Grid sizes work: 1x1, 2x1, 2x2, 3x3, 4x4, 6x6
- [ ] Custom word add/edit/delete works
- [ ] Custom image upload works
- [ ] Folder creation and reorder works
- [ ] Activities tab: all activity walkthroughs complete
- [ ] Guided vocabulary stories play through
- [ ] Quick phrases work
- [ ] Export/import boards (JSON format)
- [ ] CSV export of usage data
- [ ] Settings: all toggles function
- [ ] Sensory options: reduced motion, high contrast, quiet mode
- [ ] Onboarding flow completes for new users
- [ ] Parent mode lock/unlock works
- [ ] Getting started guide accordion works
- [ ] Spanish language toggle works end-to-end

**iOS-specific testing:**
- [ ] App installs and launches on physical device
- [ ] Haptic feedback fires on tile taps
- [ ] App works in portrait and landscape
- [ ] Safe area insets respected (notch, home indicator)
- [ ] App works offline after initial load
- [ ] App survives background/foreground cycling
- [ ] Memory usage stays reasonable (no leaks on repeated navigation)
- [ ] VoiceOver screen reader navigation

**Edge cases:**
- [ ] Empty state: brand new user, no custom words
- [ ] Large data: 50+ custom words, 10+ custom folders
- [ ] Long word/phrase in sentence bar
- [ ] Rapid tap sequences
- [ ] Interrupt TTS mid-speech
- [ ] Switch language mid-session

### 4B. Full QA Pass -- Guiding Steps

**Functional testing:**
- [ ] Visual schedules: create, edit, delete, complete steps
- [ ] 30+ default activities render with icons
- [ ] Custom schedule creation works
- [ ] Visible steps setting (2-6) works
- [ ] Reward tracker: create tracks, add tasks, complete, celebrate
- [ ] Reward timer functions correctly
- [ ] Social stories: all 8 templates readable
- [ ] Story page turning (swipe and tap)
- [ ] TTS reads story pages
- [ ] Custom story creation wizard
- [ ] Photo upload in stories
- [ ] Child name personalization throughout
- [ ] Settings: all toggles function
- [ ] Sensory options work
- [ ] Parent mode / Kids mode toggle

**iOS-specific testing:**
- [ ] Same checklist as AAC Board iOS testing above
- [ ] Haptic feedback on reward completion

### 4C. Accessibility Audit (Tony)

- WCAG 2.1 AA compliance check on both apps
- Touch target sizes (44x44px minimum)
- Color contrast ratios
- Screen reader flow (VoiceOver)
- Keyboard navigation
- Focus management in modals
- ARIA labels completeness

---

## Stream 5: Expert Reviews

### 5A. Marci Review (Early Intervention Specialist)

Full clinical review of both apps covering:
- Developmental appropriateness for target age (3-6)
- AAC best practices compliance (motor planning, Fitzgerald Key, core vocabulary)
- Sensory considerations (visual clutter, audio feedback, overstimulation risk)
- Therapy workflow compatibility (can an SLP use this in a 30-min session?)
- Caregiver experience (is it simple enough for a tired parent at 8pm?)
- Social story clinical validity (Carol Gray framework compliance)
- Reward system appropriateness (behavioral considerations)
- Missing features that clinicians would expect
- Vocabulary completeness and organization

### 5B. Reggie Review (Parent Voice)

Full parent-perspective review of both apps covering:
- First impression: does this feel trustworthy in 30 seconds?
- Onboarding: can a non-technical parent figure this out?
- Daily use: would this survive a real Tuesday morning routine?
- Customization depth: does it feel personal or generic?
- Value assessment: is this worth the price?
- Pain points: where would a real parent get frustrated and quit?
- Missing features a parent would expect
- Comparison to tools parents already use
- Messaging and copy review (does it resonate?)

---

## Stream 6: Activities Tutorialization

### 6A. AAC Board -- Activities Tab Tutorial

First-time walkthrough when parent opens Activities tab:
- Step-by-step overlay/coach marks explaining:
  1. What activities are and why they matter
  2. How to start an activity walkthrough
  3. How vocabulary surfaces during activities
  4. How to create a custom activity
- Dismissable, with "Don't show again" option
- Stored in localStorage (e.g., `ab-activities-tutorial-seen`)

### 6B. Guiding Steps -- Tab Tutorials

Apply the same formula to each Guiding Steps tab:

**Schedule tab tutorial:**
1. What visual schedules are
2. How to start a schedule
3. How to complete steps
4. How to create a custom schedule

**Rewards tab tutorial:**
1. What reward tracking does
2. How to set up a reward track
3. How completion and celebration work

**Stories tab tutorial:**
1. What social stories are and why they help
2. How to read a story with your child
3. How to create a custom story

---

## Stream 7: Marketing Website

### 7A. Website Requirements

- Landing page for both apps (or one page per app)
- App Store download button(s)
- Feature highlights with screenshots
- Testimonials section (placeholder initially)
- "About Us" / mission statement
- **Donate button** (Ko-fi, Buy Me a Coffee, or Stripe donation link)
- Privacy Policy page
- Terms of Service page
- Support/contact section
- Mobile-responsive
- Fast loading (static site)

### 7B. Hosting

- GitHub Pages (free, simple) or Netlify (free tier, more features)
- Custom domain recommended (e.g., guidingstepsapp.com, aacboard.app)
- SSL certificate (automatic with GitHub Pages or Netlify)

### 7C. Donate Button Strategy -- DECIDED

- **PayPal donate button** (PayPal.me link or embedded donate button)
- No third-party platform needed, no commission beyond standard PayPal rates (~2.9% + $0.30)
- Messaging: "Support continued development" not "Pay for the app"
- Prominent but not pushy placement
- One website for both apps (cohesive "tools for autism families" story)

---

## Stream 8: Marketing Plan (Data-Driven)

### 8A. Pre-Launch

- Identify target communities:
  - Autism parent Facebook groups
  - Reddit: r/autism, r/specialneeds, r/slp
  - Instagram autism parent influencers
  - SLP/OT professional communities
  - Special needs teacher networks
- Create social media presence (Instagram at minimum)
- Prepare launch announcement content
- Reach out to 5-10 autism parent bloggers/influencers for early access
- Submit to special needs app review sites

### 8B. Launch Week

- App Store launch with optimized listing
- Social media announcement campaign
- Email to beta testers asking for App Store reviews
- Submit to ProductHunt (accessibility category)
- Press release to special needs media outlets

### 8C. Post-Launch (First 90 Days)

- Monitor App Store reviews and respond to all
- Track key metrics:
  - Downloads per day/week
  - Conversion rate (if free + IAP model)
  - Retention: Day 1, Day 7, Day 30
  - Most/least used features (usage analytics)
  - App Store keyword rankings
- A/B test App Store screenshots and description
- Gather user feedback for v1.1 priorities
- Community building: start a Facebook group or Discord

### 8D. Analytics & Crash Reporting -- DECIDED

**v1.0: Crash reporting only**
- Firebase Crashlytics (free, integrates with iOS via Capacitor)
- Tracks crashes, error rates, affected devices
- No personal data collected -- COPPA-safe by default
- Essential for catching issues on devices we don't own

**v1.1: Usage analytics (deferred)**
- Firebase Analytics configured for COPPA compliance
- Key events to track:
  - Feature usage (which tabs, which features)
  - Session length and return rates (Day 1 / Day 7 / Day 30)
  - Onboarding completion rate
  - Words tapped per session, sentences built
- All data anonymous and aggregated -- no personal identifiers
- COPPA compliance built in from the start when we add this

**Social media -- DECIDED:**
- Use existing personal accounts flexed to support the apps
- Priority order: Instagram (first), Facebook (second), Twitter (third)
- Instagram is primary -- visual, parent-heavy audience

---

## Stream 9: SEO & App Store Optimization (ASO)

**Owner: Summer (ASO/SEO Specialist)**

### 9A. App Store Optimization

- **Keyword research**: identify high-volume, low-competition keywords
  - Primary: "AAC app", "autism communication", "speech therapy app"
  - Secondary: "visual schedule autism", "social stories", "picture communication"
  - Long-tail: "communication board for nonverbal children", "autism app for parents"
- Optimize title + subtitle + keyword field (100 chars)
- Localize for key markets (US, UK, Canada, Australia)
- Screenshot A/B testing (use Apple's product page optimization)

### 9B. Website SEO

- Target informational keywords parents search:
  - "best AAC app for toddlers"
  - "autism communication tools"
  - "visual schedule app for autism"
  - "social stories for kids with autism"
- Blog/resource content strategy (long-term):
  - "What is AAC and how does it help my child?"
  - "How to use visual schedules at home"
  - "Choosing the right communication app"
- Schema markup for software application
- Google Search Console setup

### 9C. Launch Agent Roster -- DECIDED

New specialist agents to support solo developer through launch and beyond:

| Agent | Domain | Cadence | Responsibilities |
|-------|--------|---------|-----------------|
| **Summer** (ASO/SEO) | App Store Optimization & Website SEO | Weekly reports | Keyword research, ranking monitoring, listing optimization, website SEO, action items for improving discoverability |
| **Sean** (Marketing & Growth) | Marketing & Community | Weekly content calendar | Social media content strategy, community engagement, influencer outreach, launch campaign, drafted posts ready to publish |
| **Lo** (Legal & Compliance) | Privacy, COPPA, App Store Rules | On-demand + pre-submission | Privacy policy, Terms of Service, COPPA compliance, Apple guidelines, flags rejection risks |
| **Hunter** (Analytics & Metrics) | Data & Reporting | Weekly performance reports | Crashlytics setup (v1.0), usage analytics (v1.1), metrics dashboards, trend identification, data-driven recommendations |

These join the existing roster: Larson (PM), Tony (QA), Marci (Clinical), Reggie (Parent), Noah (UI/UX), Pat (Product), Steve (Code Review), Robert (Architecture), Nina (Infrastructure)

---

## Stream 10: Legal & Compliance (BLINDSPOT)

### 10A. Privacy Policy (REQUIRED for App Store)

- Apple requires a privacy policy URL before submission
- Must disclose what data is collected, stored, and shared
- Since targeting children: COPPA (US), GDPR-K (EU) compliance
- Current state: all data is local (IndexedDB + localStorage) -- this is a STRONG privacy position
- Still need a formal document

### 10B. Terms of Service

- Required for App Store
- Covers: usage rights, refund policy (Apple handles), liability limitations
- Can be simple for v1.0

### 10C. Apple Kids Category Compliance -- DECIDED (Yes, listing in Kids category)

- No third-party advertising -- we have none
- No analytics that collect personal data from children -- Crashlytics only, COPPA-configured
- No links out of the app without parental gate -- **Links are only available in parent mode.** Both apps already have parent lock; all outbound links (Rate, Website, Support, cross-promotion) live in Settings behind the parent gate.
- No social features -- we have none
- Age rating must be accurate
- Privacy policy must specifically address children's data

### 10D. COPPA Compliance

- Children under 13: cannot collect personal information without verifiable parental consent
- Current architecture (all local data, no server) is naturally compliant
- If adding Firebase/analytics: must configure for COPPA compliance
- Document this clearly in privacy policy

---

## Stream 11: Pre-Launch Infrastructure (BLINDSPOT)

### 11A. Support Infrastructure

- Support email address (e.g., support@guidingstepsapp.com)
- FAQ page on website
- In-app feedback mechanism (link to email or form)
- Bug report process

### 11B. TestFlight Beta Program

- Recruit 10-20 beta testers before launch:
  - Parents of autistic children
  - SLPs and OTs
  - Special education teachers
- 2-4 week beta period
- Collect structured feedback (Google Form or similar)
- Fix critical issues before App Store submission

### 11C. Crash Reporting

- Firebase Crashlytics (free) or Sentry
- Must be in place before launch to catch issues quickly
- COPPA-compliant configuration

### 11D. App Store Developer Account

- Apple Developer Program ($99/year) -- already have this (team ID configured)
- Verify App Store Connect is set up for both apps
- Set up external testing group in TestFlight

---

## Stream 12: Post-Launch Roadmap (BLINDSPOT)

### 12A. v1.1 Priorities (First Update)

Based on beta feedback + analytics, likely candidates:
- Bug fixes from launch feedback
- Additional vocabulary based on user requests
- Backup/restore (iCloud or export)
- iPad-optimized layout
- Additional social story templates

### 12B. Android Timeline

- Begin Android development post iOS launch stabilization
- Capacitor already supports Android -- build infrastructure exists
- Google Play Store submission requirements differ from Apple
- Target: 2-3 months post iOS launch

---

## Launch Checklist (All Streams)

**Start date: 2026-03-23 (Monday)**
**Target launch: 2026-05-18 (Week 8)**

### Week 1 (Mar 23-29): Foundation + Expert Reviews
- [ ] Set up git branching (master + develop, TestFlight groups)
- [ ] Define new agent personas (Summer, Sean, Lo, Hunter) in CLAUDE.md
- [ ] Marci full review (both apps) -- runs in parallel
- [ ] Reggie full review (both apps) -- runs in parallel
- [ ] Review/update logos and icons

### Week 2 (Mar 30 - Apr 5): Legal + Infrastructure
- [ ] Lo: Draft Privacy Policy + Terms of Service
- [ ] Set up support email
- [ ] Integrate Firebase Crashlytics (COPPA-compliant)
- [ ] Set up App Store Connect for both apps (paid upfront: $9.99 / $4.99)
- [ ] Configure TestFlight Internal + External groups
- [ ] Triage and plan fixes from Marci + Reggie reviews
- [ ] Data persistence safeguards (both apps):
  - [ ] Document all IndexedDB object stores and localStorage keys as locked contract
  - [ ] Add data version flag (e.g., `ab-data-version: 1`, `gs-data-version: 1`) to localStorage
  - [ ] Build empty migration framework (detects version, runs migrations if needed)
  - [ ] Establish rule: no key renames or schema changes without migration path post-launch

### Week 3 (Apr 6-12): QA + Bug Fixes
- [ ] Full QA pass -- AAC Board (automated + manual device testing plan)
- [ ] Full QA pass -- Guiding Steps (automated + manual device testing plan)
- [ ] Accessibility audit -- Tony (both apps)
- [ ] Fix issues from QA + expert reviews

### Week 4 (Apr 13-19): Tutorials + Polish
- [ ] Implement Activities tab tutorial (AAC Board)
- [ ] Implement tab tutorials (Guiding Steps -- Schedule, Rewards, Stories)
- [ ] Fix remaining issues from QA

### Week 5 (Apr 20-26): Marketing + Website + ASO
- [ ] Build and deploy marketing website (one site, both apps, PayPal donate)
- [ ] Host Privacy Policy + Terms of Service on website
- [ ] Summer: ASO keyword research and listing optimization
- [ ] Summer: Website SEO setup (schema markup, Search Console)
- [ ] Sean: Social media content calendar and launch content
- [ ] Sean: Begin beta tester recruitment + influencer outreach
- [ ] Write App Store copy (both apps)
- [ ] Create App Store screenshots (both apps)

### Week 6-7 (Apr 27 - May 10): Beta + Polish
- [ ] TestFlight beta distribution (10 personal + recruited testers)
- [ ] Collect and triage beta feedback (Google Form)
- [ ] Fix critical issues
- [ ] Final QA pass
- [ ] Finalize app names and subtitles
- [ ] App Store submission (target end of Week 7)

### Week 8 (May 11-18): Launch
- [ ] App Store review (typically 24-48 hours)
- [ ] Sean: Launch day social media push
- [ ] Hunter: Monitor crash reports
- [ ] Monitor reviews and respond
- [ ] Celebrate

---

## Decisions Summary

### Decided
- **Pricing**: $9.99 AAC Board, $4.99 Guiding Steps, paid upfront, no IAP/subscription
- **Branching**: master (production) + develop (active work), keep master name
- **TestFlight**: Option B -- Internal group (develop) + External group (master)
- **Kids category**: Yes -- all outbound links only available in parent mode
- **Crash reporting**: Firebase Crashlytics for v1.0, COPPA-compliant
- **Usage analytics**: Deferred to v1.1, COPPA-compliant when added
- **Donate platform**: PayPal
- **Website**: One site for both apps
- **Social media**: Existing personal accounts, priority Instagram > Facebook > Twitter
- **Agent roster**: Summer (ASO/SEO), Sean (Marketing), Lo (Legal), Hunter (Analytics)
- **Beta testers**: ~10 from personal network + recruitment from target communities

### Deferred
- **App names and subtitles**: Finalized near end of process (Week 9-10)
- **Domain name**: Decided when naming is locked
- **Backup/restore**: v1.1 post-launch
- **Android**: 2-3 months post iOS launch stabilization

### Open
- **Timeline**: Is the week-by-week schedule realistic for your availability?
