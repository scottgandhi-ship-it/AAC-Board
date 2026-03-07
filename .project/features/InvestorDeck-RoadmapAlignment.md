# Investor Deck -> Roadmap Alignment Analysis

**Author**: Larson (Project Manager)
**Date**: 2026-03-07
**Source**: AAC-Board_Investor_Deck.pptx (March 2026, Series A)
**Status**: PLANNING -- awaiting developer review and approval

---

## Executive Summary

The investor deck promises a 24-month product vision across 4 phases with specific milestone dates. Cross-referencing against our current ROADMAP.md reveals **19 net-new features or workstreams** not yet in the backlog, plus **3 existing items that need scope expansion**. This document catalogs every gap, proposes a revised roadmap structure, and flags sequencing risks.

**Scope Decision**: We are 100% focused on **children with autism ages 2-6 and their families**. This sharpens our focus, reduces complexity, and lets us dominate the pediatric autism AAC segment.

---

## Section 1: What the Deck Promises

### Technology Roadmap (Slide 31)

| Phase | Timeline | Deliverables |
|-------|----------|--------------|
| Phase 1: Launch | Now | Core AAC grid, PWA, offline-first, Fitzgerald Key, $9.99 pricing |
| Phase 2: Enhance | 6 months | Usage analytics, multiple TTS voices, reward system v2 |
| Phase 3: Expand | 12 months | Multilingual (8+ lang), OBF export/import, SLP dashboard |
| Phase 4: Lead | 18 months | BCI readiness, AI voice cloning, content marketplace, enterprise licensing |

### Critical Must-Build Features (Slide 30)

| Feature | Deck Status | Deck Priority |
|---------|-------------|---------------|
| Deep Vocabulary (4,750+ words) | In Progress | HIGH |
| Multiple TTS Voices | Planned | HIGH |
| Grammar Engine | Planned | MEDIUM |
| Bilingual Support | Planned | MEDIUM |
| Content Ecosystem | Planned | LOWER |

### Feature Gap Claims (Slide 23)

The deck claims AAC-Board has (or will have) these differentiators:
- Modern UX
- Cross-Platform
- Usage Analytics
- Reward System
- Visual Schedules
- Team Collaboration

### Revenue Model (Slide 37)

| Stream | Description |
|--------|-------------|
| Core App | $9.99 one-time per user |
| Premium | AI voices, advanced analytics, cloud sync ($4.99/mo) |
| Institutional | Per-seat licensing for schools/clinics |
| Donations | Sponsor a Family + institutional grants |
| Future | Content marketplace, enterprise API |

### Community Model (Slide 36)

- Sponsor a Family donation program
- Public Feature Voting
- Wall of Supporters
- Transparent Funding Tracker

### Series A Milestones (Slide 44)

| Month | Milestone |
|-------|-----------|
| 3 | Public beta launch (PWA + iOS + Android) |
| 6 | 1,000 active users |
| 9 | First school district partnership |
| 12 | 5,000 users, ATIA conference debut |
| 18 | 15,000 users |
| 24 | 25,000 users, break-even, 8+ languages |

### Target Segments (Slide 34) -- REVISED

| Segment | Description |
|---------|-------------|
| Primary | Families with nonverbal children (900K+ autism) |
| Secondary | Schools and districts (55% of AAC procurement, 93% Chromebook) |

---

## Section 2: Current Roadmap Status

### DONE (shipping today)

- 1.1 Core Words on Home Screen
- 1.2 Consistent Motor Planning
- 1.3 Grid Templates by Communication Level
- 2.1 Sensory-Friendly Options
- 2.2 Symbol/Image Library (ARASAAC)
- 3.1 Word Prediction (basic n-gram chains)
- 3.2 Basic Grammar (plurals, conjugation, articles)
- 3.3 Spanish Language Support
- 4.2 Data/Usage Tracking (Insights)
- Navigation and Parent Mode
- Reward Tracker
- Visual Schedules
- UX Design Pass
- Competitive Analysis

### IN PROGRESS

- Parent Mode Refactor (implementation done, awaiting device validation)

### PLANNED (in roadmap, not started)

- 4.3 Guided Setup and Teaching Tutorial
- 4.4 Export/Share Boards
- 5.0 iOS App + Distribution
- Marketing Website

---

## Section 3: Gap Analysis -- What the Deck Promises That We Do NOT Have

### GAP 1: Deep Vocabulary Expansion (4,750+ words)
- **Deck says**: "In Progress, HIGH priority" (Slide 30)
- **Reality**: We have ~150 default mapped buttons. Nowhere close to 4,750.
- **Scope**: Vocabulary organized by communication level, not age. Progressive disclosure -- words available when ready, not overwhelming.
- **Risk**: HIGH. This is table-stakes for clinical credibility. Proloquo2Go has 10,000+ words.
- **Target audience**: Children with autism ages 2-6. Communication level matters more than age.

**Vocabulary Tiers (Marci-approved)**:

| Level | Communication Stage | Words Available | Words Actively Used | Grid Size |
|-------|-------------------|-----------------|---------------------|-----------|
| Level 1 | Beginning (just starting AAC) | 100-200 | 10-50 | 3x3 |
| Level 2 | Emerging (combining 2 words) | 300-600 | 50-200 | 4x4 |
| Level 3 | Developing (short sentences) | 800-1,500 | 200-500 | 6x6 |
| Level 4 | Expanding (complex communication) | 2,000-4,750+ | 500+ | 6x6+ |

**Phasing decision**:
- **SHORT TERM (Phase 2)**: Build Level 1 (100-200 words) and Level 2 (300-600 words). This covers the vast majority of young autistic communicators ages 2-4.
- **DEFERRED**: Level 3 and Level 4 vocabulary delayed until Levels 1-2 are validated with real families and SLPs.

**Key principle**: The device needs to be a step or two ahead of the child (for parent modeling via aided language stimulation), but not ten steps ahead. Parents use words the child isn't using yet to model language -- so available words > active words.

- **Suggested milestone**: Phase 2 (Levels 1-2 only)

### GAP 2: Multiple TTS Voices
- **Deck says**: "Planned, HIGH priority" (Slide 30)
- **Reality**: We use Web Speech API default voices. No voice selection UI.
- **Scope**: Voice picker in settings, age/gender-appropriate options, potentially premium AI voices (ElevenLabs, Azure Neural TTS)
- **Revenue tie**: Premium tier ($4.99/mo) includes "AI voices"
- **TTS Research**: .project/features/TTS-Research.md exists (untracked)
- **Suggested milestone**: Phase 2 (6-month)

### GAP 4: Multilingual Expansion (8+ Languages)
- **Deck says**: Phase 3 at 12 months; Month 24 milestone says "8+ languages"
- **Reality**: We have English + Spanish only.
- **Scope**: At minimum 6 more languages. Each needs: vocabulary translation, grammar rules, TTS voice, ARASAAC symbol mapping verification
- **Suggested milestone**: New Milestone 8

### GAP 6: Team Collaboration
- **Deck says**: Feature gap chart claims "Team Collaboration" (Slide 23)
- **Reality**: Nothing built. No accounts, no cloud, no sharing.
- **Scope**: Cloud accounts, board sharing between parent/SLP/teacher, shared usage data, notes/comments
- **Dependency**: Requires cloud infrastructure (Firebase or similar)
- **Suggested milestone**: New Milestone 10

### GAP 7: SLP Dashboard
- **Deck says**: Phase 3 at 12 months (Slide 31)
- **Reality**: Not in roadmap.
- **Scope**: Web dashboard for SLPs to manage multiple clients, view usage data across users, configure boards remotely, assign vocabulary goals
- **Dependency**: Cloud infrastructure, user accounts, team collaboration
- **Suggested milestone**: New Milestone 10 (with Team Collaboration)

### GAP 8: OBF (Open Board Format) Export/Import
- **Deck says**: Phase 3 at 12 months (Slide 31)
- **Reality**: 4.4 covers JSON export but NOT OBF standard
- **Scope**: Implement Open Board Format (.obf/.obz) for interoperability with other AAC apps
- **Action**: Expand 4.4 scope to include OBF alongside our JSON format

### GAP 9: Premium Tier ($4.99/mo)
- **Deck says**: Revenue stream -- AI voices, advanced analytics, cloud sync (Slide 37)
- **Reality**: No payment system, no premium features, no cloud sync
- **Scope**: Payment integration (Stripe), feature gating, cloud sync (Firebase), premium voice packs, advanced analytics dashboard
- **Dependency**: Cloud infrastructure
- **Suggested milestone**: New Milestone 11

### GAP 10: Sponsor a Family Program
- **Deck says**: Donation model -- donors fund $9.99 licenses (Slide 36)
- **Reality**: Nothing built.
- **Scope**: Donation page, license generation/redemption, transparent tracker showing donations and impact
- **Suggested milestone**: Part of Marketing Website or standalone

### GAP 11: Community Platform Features
- **Deck says**: Public feature voting, wall of supporters, transparent funding tracker (Slide 36)
- **Reality**: Nothing built.
- **Scope**: Could be part of marketing website or a separate community portal
- **Suggested milestone**: Part of Marketing Website

### GAP 12: Content Ecosystem
- **Deck says**: "Planned, LOWER priority" (Slide 30); Phase 4 "content marketplace" (Slide 31)
- **Reality**: Not in roadmap.
- **Scope**: Printable boards, starter kits, SLP resources, eventually a marketplace for user-created content
- **Suggested milestone**: New Milestone 12 (Phase 4)

### GAP 13: Android App Store Submission
- **Deck says**: Month 3 milestone includes "Android" (Slide 44)
- **Reality**: PWA works on Android already, but no Play Store listing
- **Scope**: TWA (Trusted Web Activity) wrapper for Play Store, or Capacitor/native wrapper
- **Action**: Add to Milestone 5 alongside iOS

### GAP 15: Reward System v2
- **Deck says**: Phase 2 at 6 months (Slide 31)
- **Reality**: Reward Tracker v1 is done. No v2 planned.
- **Scope**: TBD -- likely enhanced gamification, SLP-configurable goals, data integration
- **Suggested milestone**: Phase 2

### GAP 16: Cloud Sync / Backup-Restore
- **Deck says**: Premium feature (Slide 37); Milestone 5 already has "backup/restore"
- **Reality**: All data is local-only (localStorage + IndexedDB)
- **Scope**: Firebase backend, user accounts, cross-device sync, backup/restore for device migration
- **Dependency**: Cloud infrastructure, user accounts
- **Suggested milestone**: Prerequisite for premium tier, team collaboration, SLP dashboard

### GAP 17: Enterprise/Institutional Licensing
- **Deck says**: "Per-seat licensing for schools/clinics" (Slide 37); Phase 4 "enterprise licensing" (Slide 31)
- **Reality**: Not in roadmap.
- **Scope**: Volume licensing portal, admin dashboard, deployment tools for IT departments, MDM compatibility
- **Suggested milestone**: Phase 4 (New Milestone 13)

### GAP 18: BCI Readiness
- **Deck says**: Phase 4 at 18 months (Slide 31)
- **Reality**: Not in roadmap.
- **Scope**: Brain-computer interface input support. Research-stage. Neuralink mentioned.
- **Suggested milestone**: Phase 4 research item

### GAP 19: AI Voice Cloning
- **Deck says**: Phase 4 at 18 months (Slide 31)
- **Reality**: Not in roadmap.
- **Scope**: Parents record voice samples so child hears a familiar voice, or generate age-appropriate child voices. Personalizes the communication experience.
- **Suggested milestone**: Phase 4

---

## Section 4: Existing Items Needing Scope Expansion

### EXPAND 1: Export/Share Boards (4.4)
- Current scope: JSON export/import, file-based sharing
- **Add**: OBF (Open Board Format) support for interoperability

### EXPAND 2: iOS App + Distribution (Milestone 5)
- Current scope: iOS app wrapper, App Store, $9.99 payment
- **Add**: Android Play Store (TWA or Capacitor), backup/restore, password-protected edit mode

---

## Section 5: Proposed Revised Roadmap Structure

### Phase 1: Launch (NOW -- current state)
**Status: ~85% complete**

| ID | Feature | Status |
|----|---------|--------|
| 1.1 | Core Words on Home Screen | DONE |
| 1.2 | Consistent Motor Planning | DONE |
| 1.3 | Grid Templates | DONE |
| 2.1 | Sensory-Friendly Options | DONE |
| 2.2 | Symbol/Image Library | DONE |
| 3.1 | Word Prediction (basic) | DONE |
| 3.2 | Basic Grammar | DONE |
| 3.3 | Spanish Language Support | DONE |
| 4.2 | Data/Usage Tracking | DONE |
| PMR | Parent Mode Refactor | Validating |
| 4.3 | Guided Setup and Teaching Tutorial | Planned (blocked on PMR) |
| MW | Marketing Website | Planning |

### Phase 2: Enhance (Months 1-6)

| ID | Feature | Priority | New? |
|----|---------|----------|------|
| 6.1 | Deep Vocabulary Expansion (Levels 1-2: up to 600 words) | P0 | YES |
| 6.2 | Multiple TTS Voices (voice picker + options) | P1 | YES |
| 6.4 | Reward System v2 (enhanced gamification) | P2 | YES |
| 4.4 | Export/Share Boards + OBF format | P2 | EXPANDED |

### Phase 3: Expand (Months 6-12)

| ID | Feature | Priority | New? |
|----|---------|----------|------|
| 7.1 | Cloud Infrastructure (Firebase backend, accounts) | P0 | YES |
| 7.2 | Cloud Sync and Backup/Restore | P1 | YES |
| 7.4 | Multilingual Expansion (8+ languages) | P2 | YES |
| 7.5 | SLP Dashboard (web portal) | P2 | YES |
| 7.6 | Team Collaboration (parent/SLP/teacher sharing) | P2 | YES |

### Phase 4: Monetize and Scale (Months 12-18)

| ID | Feature | Priority | New? |
|----|---------|----------|------|
| 8.1 | Premium Tier ($4.99/mo -- AI voices, analytics, sync) | P0 | YES |
| 8.2 | iOS + Android App Store Submissions | P0 | EXPANDED |
| 8.3 | Sponsor a Family Program | P1 | YES |
| 8.4 | Community Platform (voting, wall of supporters) | P2 | YES |
| 8.5 | Enterprise/Institutional Licensing | P2 | YES |

### Phase 5: Lead (Months 18-24)

| ID | Feature | Priority | New? |
|----|---------|----------|------|
| 9.1 | Content Marketplace | P1 | YES |
| 9.2 | AI Voice Cloning | P2 | YES |
| 9.3 | BCI Readiness (research) | P3 | YES |
| 9.4 | Enterprise API | P3 | YES |

---

## Section 6: Sequencing Dependencies

These must be respected:

1. **Parent Mode Refactor** -> Guided Setup (4.3) -- already tracked
2. **Cloud Infrastructure (7.1)** -> Cloud Sync (7.2) -> Premium Tier (8.1)
4. **Cloud Infrastructure (7.1)** -> Team Collaboration (7.6) -> SLP Dashboard (7.5)
5. **Cloud Infrastructure (7.1)** -> Sponsor a Family (8.3)
6. **Multiple TTS Voices (6.2)** -> AI Voice Cloning (9.2)
7. **App Store Submissions (8.2)** -> Enterprise Licensing (8.5)
9. **OBF Export (4.4 expanded)** -> Content Marketplace (9.1)

---

## Section 7: Risk Flags

### HIGH RISK: Deep Vocabulary Timeline
The deck says "In Progress" but we have ~150 buttons. Building 4,750+ clinically-validated vocabulary items with symbol mappings, folder hierarchies, and prediction chains is a multi-month content effort. This is the single biggest credibility gap.

### HIGH RISK: Cloud Infrastructure
At least 5 features depend on cloud (sync, team collab, SLP dashboard, premium tier, sponsor program). This is a foundational decision that affects architecture, cost, privacy posture, and HIPAA considerations. Must be planned carefully.

### LOW RISK: Feature Voting / Community
Nice-to-have. Can be built incrementally using simple tools (GitHub Discussions, Canny, etc.) before building custom.

---

## Section 8: Recommended Immediate Actions

1. **Validate and merge Parent Mode Refactor** -- unblocks Guided Setup
2. **Begin Deep Vocabulary planning** -- this is the #1 credibility gap
3. **Read and integrate TTS-Research.md** -- already researched, needs roadmap slot
4. **Approve this alignment doc** -- so we can update ROADMAP.md
5. **Decide cloud strategy** -- Firebase vs. Supabase vs. custom -- this gates 5+ features
6. **Scope the "public beta" definition** -- Month 3 milestone says "PWA + iOS + Android" beta

---

## Section 9: Deck Claims vs Reality -- Honesty Check

| Deck Claim | Reality | Gap Severity |
|------------|---------|--------------|
| "4,750+ words" | ~150 mapped buttons. Levels 1-2 (up to 600 words) prioritized; Levels 3-4 deferred. | HIGH |
| "Multiple TTS voices" | Web Speech API defaults only | HIGH |
| "Team collaboration" | Nothing built | HIGH |
| "Cross-platform" | PWA works everywhere | OK (accurate) |
| "Offline-first" | Service worker caching | OK (accurate) |
| "Usage analytics" | Insights tab with CSV export | OK (accurate) |
| "Fitzgerald Key colors" | Fully implemented | OK (accurate) |
| "Motor planning consistency" | Fixed core word strip | OK (accurate) |
| "Reward system" | Reward tracker v1 | OK (accurate) |
| "Visual schedules" | Visual schedule builder | OK (accurate) |
| "$9.99 one-time" | Not yet collecting payment | MEDIUM |
| "Bilingual support" | English + Spanish done | OK (partial -- deck says 8+) |

---

## Approval

- [ ] Developer has reviewed gap analysis
- [ ] Priority order confirmed or adjusted
- [ ] Phase timelines accepted or revised
- [ ] Cloud strategy decision made
- [ ] Ready to update ROADMAP.md
