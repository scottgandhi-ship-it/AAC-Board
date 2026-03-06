# AAC Board - Project Guide

## Strategic Decisions

1. **Learning Platform** - This app is a building ground. We are learning lessons that will forge our path forward. Move fast, experiment, iterate.
2. **Pricing** - $9.99 one-time purchase to offset development cost, data management, and security.
3. **iOS App** - This will become a native iOS app as well. Architect decisions with this migration in mind (e.g., keep logic separable from DOM, consider React Native or similar cross-platform path).

## Architecture

- **Current stack**: Single-file PWA (index.html + manifest.json + sw.js)
- **Target**: Cross-platform (web PWA + iOS app)
- Keep offline-first. The app must work without internet after initial load.

## Design Principles (Research-Backed)

- **Motor planning consistency**: Words must NEVER move positions across views or vocabulary levels
- **Core words on home screen**: "I", "want", "don't want", "help", "more", "stop", "yes", "no" should be immediately accessible
- **Progressive vocabulary disclosure**: Reveal words over time, never relocate existing ones
- **Modified Fitzgerald Key color coding**: verbs=green, nouns=orange, descriptors=blue, pronouns=yellow, social=pink, prepositions=purple
- **Activity-based organization**: Group vocabulary by activity (mealtime, playground, bath) not taxonomy (food, animals)
- **Minimize taps**: Common requests should take 2 taps max, not 4+

## Development Notes

- Main branch: `master`
- The entire app is currently in a single `index.html` (~77k tokens). Will need to be broken into modules as complexity grows.
