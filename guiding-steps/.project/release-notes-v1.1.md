# Guiding Steps v1.1 - Release Notes

## What's new

Fresh visual direction across the whole app.

- **New look and feel** -- warm ivory backgrounds, a single calm indigo accent, and a storybook-style serif for headlines. The app now feels like a quiet children's book, not a dashboard.
- **Numbered spine on Schedule** -- each step in the routine has a number and a connecting line, so kids can see what's done, what's now, and what's next.
- **Long-press "Done"** -- instead of a single tap, hold the Done button for a moment to confirm. Prevents accidental skips. Duration is adjustable (0.2s / 0.3s / 0.4s) in Settings.
- **Updated Stories tab** -- stories now appear as a scrolling list with "Recent" (this week) and "This month" sections. Newer reads surface first.
- **Storybook reader** -- each page is now a rounded card with a dedicated read-aloud button and a clearer page indicator.
- **Self-hosted fonts** -- app loads Fraunces and Inter from the bundle, no external network needed after first open.

## Behind the scenes

- Offline-first service worker cache (bumped to v18)
- Accessibility: visible focus indicators, WCAG-AA color contrast, screen-reader-friendly progress announcements
- Reduced motion honored throughout

## Tester notes

This release is a significant visual refresh. Please report:
- Any screen that feels off (unexpected spacing, wrong color, text clipped)
- Long-press Done feel -- too short? too long? (you can try the other durations in Settings)
- Story list sort -- are "Recent" / "This month" buckets useful, or would you prefer something else?
- Any feature that worked before but seems broken now

Known still-deferred: the secondary modals (Choose a Story, task strip editor, activity picker) use the new color palette but keep their previous layout. Full structural restyle lands in a future update.
