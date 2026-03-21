# Launch Plan -- Expert Review Findings & Decisions

## Reviewed: 2026-03-20
## Reviewers: Marci (Clinical), Reggie (Parent)
## Decisions by: Scott

---

## AAC Board -- Approved Fixes for v1.0

### CRITICAL
1. **Parental gate** -- Implement tap+hold gate for parent mode. Must be obvious to parents how it works. Apple Kids category requirement.

### HIGH
2. ~~Home grid folders text-only~~ -- NOT AN ISSUE. Emojis exist in BUTTON_ICONS. Simulator rendering bug (black box w/ question marks) is known. No fix needed.
3. **Default grid 3x3 if onboarding skipped** -- Change default from 6x6 to 3x3 when onboarding is not completed.
4. **Add stop/yes/no to core word strip for 3x3 and 4x4 grids.** Triple-check these are already present in 5x5 and 6x6.
5. **Fix Fitzgerald Key color consistency** -- "stop," "all done," "no" must use consistent colors across all contexts.
6. **Rephrase auto-speak setting** -- "When turned on, your child's sentence will be spoken out loud as soon as they pick the last word."
7. **Parent mode auto-lock 30min -> 5min.**
8. ~~Reset all to defaults protection~~ -- DEFERRED to v1.1.
9. **Safeguard grid-size switching** -- CRITICAL. Currently calls clearAllData() which wipes custom words, images, folders, usage data. Implement auto-backup before switch so it's reversible.
10. ~~Coach marks concrete example~~ -- WON'T DO.
11. ~~Grid size descriptions in onboarding~~ -- WON'T DO.
12. **Grammar Assistance plain language** -- Rewrite "articles" to "Automatically add 'a' and 'the' before words."
13. ~~App header logo~~ -- Will fix once we have a name. Ignore for now.
14. **Car Ride activity sensory vocabulary** -- Add "loud," "bumpy," "stop," "too fast."
15. **Spanish accent marks** -- Review and fix diacritical marks throughout translations.

### MEDIUM
16. ~~Fitzgerald Key color explanation~~ -- WON'T DO.
17. ~~Vocabulary level naming~~ -- WON'T DO.
18. **Toileting vocabulary** -- Add "wet," "dry," "pull up," "flush," "wipe."
19. ~~Cross-promote Guiding Steps~~ -- Will do later, good note.
20. **Privacy statement** -- Add "Your data stays on this device" visible in app.

### PROMOTED FROM v1.1 TO v1.0
22. **Session export for SLP documentation** -- Quick "share session summary" feature.
25. **Use child's name more throughout** -- "[Name]'s AAC Board" in header, personalized prompts.
26. **Therapist sharing features** -- Export reports, import custom boards.
27. **Search should find core words and folders** -- Currently limited to fringe words only.

### WON'T DO
- #10: Coach marks concrete example
- #11: Grid size descriptions in onboarding
- #16: Fitzgerald Key color explanation for parents
- #17: Vocabulary level naming change
- #21: Modeling mode toggle
- #23: Core word of the week
- #24: Undo button for message bar
- #28: Entertainment folder clinical note
- #29: Audio tap cue

---

## Guiding Steps -- Approved Fixes for v1.0

### CRITICAL
1. **Parental gate** -- Same tap+hold solution as AAC Board. Must be obvious to parents.
2. **Pre-load sample content** -- Sample schedule, sample reward track, and first 4 social story templates surfaced on Stories tab at first boot.

### HIGH
3. ~~Step-count guidance in rewards~~ -- WON'T DO for launch.
4. **Auto-assign sentence types in quick-create story flow** -- Pages should auto-tag based on content (perspective, descriptive, etc.)
5. ~~Directive ratio warning~~ -- WON'T DO.
6. ~~Quick-describe coping strategy coaching~~ -- WON'T DO.
7. **Rename "Start Schedule"** -- Clarify label (e.g., "Set Up a Schedule" or "Choose a Routine").
8. **Rename "track" to "chart"** throughout the reward system.
9. **Reward creation contextual labels** -- "Task" -> "What is your child working on?" / "Reward" -> "What do they earn?"
10. ~~Steps shown at a time visibility~~ -- WON'T DO.
11. **Add confirmation dialog to "Reset all to defaults."**
12. **Guide users through pre-loaded sample** on first use (coach mark leads to sample content, not empty picker).
13. **Pre-built social stories at launch** -- Surface first 4 templates on Stories tab at first boot. Templates already exist in code.
14. ~~Inline guidance for first-time creation~~ -- WON'T DO.
15. **Schedule empty state clarification** -- "Pick from built-in templates or create your own routine."
16. ~~Steps shown at a time label rewrite~~ -- WON'T DO.

### MEDIUM
17. ~~Celebration overlay simplification~~ -- Save for v1.1.
18. ~~Reward dependency coaching~~ -- WON'T DO.
19. **Cross-promote AAC Board** -- Will do when we know app names.
20. **Privacy statement** -- Add "Your data stays on this device."
21. **Visual branding connecting both apps** -- Will do when we know app names.

### PROMOTED FROM v1.1 TO v1.0
24. **Communication log / narrative summary** -- Daily use summary for parents and therapists.
25. **Auto-read for social stories** -- "Play all" hands-free reading, page by page.
29. **Reorder steps in active schedule** -- Swap steps without ending and restarting.

### PLAN FOR v1.1
- #3: Step-count guidance in rewards
- #17: Celebration overlay sensory-friendly simplification
- #23: Nested schedule sub-steps
- #26: Pre-event reminders for social stories
- #28: Time-of-day awareness

### WON'T DO
- #5: Directive ratio warning
- #6: Quick-describe coping coaching
- #10: Steps shown at a time visibility
- #14: Inline guidance text
- #16: Steps label rewrite
- #18: Reward dependency coaching
- #22: Transition timer for schedules
- #27: Print option for social stories

---

## Cross-App Issues

| # | Issue | Decision |
|---|-------|----------|
| 1 | Share child name and sensory prefs between apps | WON'T DO for v1.0 |
| 2 | Parental gate (both apps) | v1.0 -- tap+hold, obvious to parents |
| 3 | Cross-promote each other | When we know app names |
| 4 | Privacy statement | v1.0 -- "Your data stays on this device" |
| 5 | Visual branding as family | When we know app names |
