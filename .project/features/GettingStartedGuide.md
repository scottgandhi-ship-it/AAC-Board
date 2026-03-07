# Getting Started Guide

## Executive Summary

A warm, scannable guide built into the Settings panel that teaches parents how to use AAC with their child. Not a manual -- a friend sitting next to you saying "here's what actually works." Accordion-style expandable tips that a tired parent can skim in under 2 minutes or deep-dive one at a time over days.

**Philosophy**: Parents are not students. They are partners. This guide meets them where they are -- overwhelmed, hopeful, and short on time. Every word is warm, encouraging, and practical.

**Voice**: Same as onboarding -- friendly, pro-parent, non-clinical, welcoming. Written like Marci talks, not like a textbook reads.

## Requirements

### Location and Access

- Lives in the Settings panel as its own section titled "Getting Started"
- Positioned below the Insights button, above sensory/language settings
- Always visible (not gated behind parent mode)
- Accordion-style: short title + one-line preview visible, tap to expand full content

### Content: 8 Guides

Each guide has a **title**, a **preview line** (visible when collapsed), and **expanded content** (1-3 short sentences max).

**Guide 1: "You are their voice right now"**
- Preview: Your child learns by watching you use the board.
- Expanded: Tap words on the board while you talk out loud. Say "I want juice" while tapping each word. This is called modeling, and it's the single most powerful thing you can do. Your child is watching and learning even when it doesn't look like it.

**Guide 2: "Keep it natural"**
- Preview: Use the board during everyday moments, not as a quiz.
- Expanded: Never say "show me where juice is" or "use your words." That turns communication into a test. Instead, just tap words during meals, bath time, play, and bedtime. The more natural it feels, the faster your child connects with it.

**Guide 3: "Every sound, point, and gesture counts"**
- Preview: AAC adds to how your child already communicates.
- Expanded: If they pull your hand, grunt, point, or tap just one word -- that's communication. Celebrate it. The board doesn't replace what they're already doing. It gives them another way to be heard.

**Guide 4: "Stay one word ahead"**
- Preview: Match your child's level, then add just one word.
- Expanded: If your child isn't using the board yet, you model single words: "want." "more." "help." If they're tapping one word, you model two: "want juice." Always just one step ahead. Never three.

**Guide 5: "The small words matter most"**
- Preview: Words like "more," "want," "stop," and "help" are the foundation.
- Expanded: These core words get used dozens of times every day in every situation. They matter way more than specific nouns. Your child will build everything on top of these.

**Guide 6: "Give them time"**
- Preview: After you model, wait. Count to 10 in your head.
- Expanded: Processing takes time, especially for young communicators. Most of us jump in after 2 seconds -- that's not enough. Pause, wait, and trust that something is happening even in the silence.

**Guide 7: "Use it everywhere"**
- Preview: The board works at the table, in the car, at the park, and at bedtime.
- Expanded: The more places your child sees the board being used, the faster it becomes part of their world. Keep it nearby and pull it into as many moments as you can throughout the day.

**Guide 8: "This takes time, and you're doing great"**
- Preview: Most children need weeks or months before they start using the board on their own.
- Expanded: That is completely normal. You are not failing. Every time you model a word, you're planting a seed. Some days it will feel like nothing is happening. Keep going. You are giving your child a voice, and that is extraordinary.

### Design

- Accordion items: tap title row to expand/collapse
- Only one item open at a time (previous auto-collapses)
- Subtle expand/collapse animation (transform/opacity only)
- Each title row has a small chevron indicator (right side, rotates on expand)
- Preview text visible in collapsed state (smaller, lighter color)
- Expanded content appears below preview with comfortable padding
- No scroll within accordion -- page scrolls naturally

### Copy Tone Rules

- First person plural ("your child") not third person ("the child")
- Short sentences. No compound sentences with semicolons.
- No jargon. If a clinical term is used (like "modeling"), explain it inline.
- Encouraging, never prescriptive. "Here's what works" not "you must do this."
- One acknowledgment of difficulty per guide max -- don't overdo the empathy or it feels performative.

## Architecture Overview

### Design Principles (Robert)

- **No new localStorage**: Static content, no state to persist
- **HTML in index.html**: Accordion markup lives in the settings panel section
- **CSS-only animation**: Chevron rotation and content reveal via max-height or grid-template-rows transition
- **Minimal JS**: Toggle handler on title rows, auto-collapse siblings. No module object needed for static content.
- **Accessible**: Each accordion item uses button for title, aria-expanded, aria-controls linking to content panel

### HTML Structure

- Section wrapper with heading "Getting Started"
- Each guide: button.guide-title (with chevron span) + div.guide-content (with preview p and expanded div)
- Content divs hidden by default, shown when parent button has .open class

### CSS

- Chevron rotates 90 degrees on open (transform: rotate)
- Content reveal via max-height transition or CSS grid row transition
- Preview text: font-size 0.85rem, color #888
- Expanded text: font-size 0.9rem, color #555, padding-top 8px
- Guide items separated by subtle border-bottom

### JS

- Single event listener on the guide section container (event delegation)
- Click on .guide-title: toggle .open class, remove .open from siblings
- Update aria-expanded on toggle

## Task Breakdown

### Phase A: Implementation

**A1: HTML markup**
- Add Getting Started section to settings panel
- 8 accordion items with title, preview, and expanded content
- Proper aria attributes (button role, aria-expanded, aria-controls)

**A2: CSS styling**
- Accordion layout, chevron icon, expand/collapse transitions
- Preview and expanded text styles
- Mobile-friendly touch targets (title row min 48px height)

**A3: JS toggle behavior**
- Event delegation click handler
- Single-open accordion logic
- aria-expanded updates

## Accessibility Considerations

- Accordion titles are buttons (keyboard accessible, focusable)
- aria-expanded true/false on each button
- aria-controls links button to its content panel
- Content panels have role="region" and aria-labelledby linking back to button
- Focus remains on clicked button after toggle
- All text meets 4.5:1 contrast ratio
- Touch targets minimum 48px height

## Acceptance Criteria

- [ ] Getting Started section visible in Settings panel below Insights
- [ ] 8 accordion items with correct titles, previews, and expanded content
- [ ] Tapping a title expands its content and collapses any other open item
- [ ] Chevron rotates to indicate open/closed state
- [ ] All accordion items accessible via keyboard (Tab, Enter/Space)
- [ ] aria-expanded updates correctly on toggle
- [ ] No new localStorage keys introduced
- [ ] Content tone matches voice guidelines (warm, non-clinical, encouraging)
- [ ] Touch targets minimum 48px height
- [ ] Animations use only transform/opacity (no layout thrashing)
- [ ] Works on mobile and desktop
