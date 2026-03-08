# Web Payment Gate

**Author**: Planning phase
**Date**: 2026-03-08
**Status**: PLANNING -- awaiting developer review and approval
**Milestone**: 5 (Platform and Distribution)

---

## Executive Summary

Gate the AAC Board web app behind a $9.99 one-time purchase using Stripe Checkout and Firebase Auth/Firestore. Users land on a public marketing page, purchase via Stripe, and receive an authenticated account that unlocks the full app. This same user record will later serve as the cross-platform purchase flag for iOS and Android.

---

## Requirements

1. Free public landing page that showcases the app (marketing, screenshots, value prop)
2. "Buy Now" button triggers Stripe Checkout for $9.99 one-time payment
3. After purchase, user gets a Firebase Auth account (email-based)
4. Authenticated users with `purchased: true` in Firestore can access the full app
5. Unauthenticated or unpurchased users see only the landing page
6. Returning users can log in to access the app on any browser/device
7. Offline-first behavior preserved -- once authenticated, the app works offline
8. Foundation for future iOS/Android purchase sync (same Firestore user record)

---

## Architecture Overview

### Payment Flow

```
Landing Page (public)
    |
    v
"Buy Now" button
    |
    v
Stripe Checkout (hosted by Stripe -- handles card, tax, receipts)
    |
    v
Stripe webhook -> Cloud Function
    |
    v
Creates Firebase Auth user (email from Stripe)
Sets Firestore: users/{uid}/purchased = true
Sends magic link or temp password to user email
    |
    v
User logs in -> App checks Firestore -> Full app loads
```

### Tech Stack Additions

| Component | Service | Why |
|-----------|---------|-----|
| Payment processing | Stripe Checkout | Hosted UI, PCI compliant, handles tax/receipts |
| User accounts | Firebase Auth | Already planned for data sync, free tier sufficient |
| Purchase records | Cloud Firestore | Real-time, offline-capable, cross-platform |
| Webhook handler | Firebase Cloud Functions | Receives Stripe payment confirmation |
| Landing page | Static HTML | Same repo, separate page or gated section of index.html |

### Data Model

**Firestore: users/{uid}**

| Field | Type | Description |
|-------|------|-------------|
| email | string | User email from Stripe checkout |
| purchased | boolean | true after successful payment |
| purchaseDate | timestamp | When payment was confirmed |
| purchaseSource | string | "stripe" (later: "app_store", "google_play") |
| stripeCustomerId | string | For future billing/refund lookups |

---

## Task Breakdown

### Phase A: Firebase Setup

- A1: Create Firebase project (or use existing if one exists)
- A2: Enable Firebase Auth (email/password + magic link)
- A3: Set up Cloud Firestore with security rules
- A4: Add Firebase SDK to the app (lightweight, CDN-hosted)

**Security Rules (Firestore)**:
- users/{uid}: read/write only if request.auth.uid == uid
- Purchase flag can only be written by Cloud Functions (admin SDK), never client

### Phase B: Landing Page

- B1: Create public landing page (landing.html or gate section in index.html)
- B2: Content: hero section, feature highlights, screenshots, pricing, "Buy Now" CTA
- B3: Login link for returning users
- B4: Mobile-responsive, fast-loading, accessible
- B5: No access to the communication board from this page

**Design Decision**: Separate landing.html vs gated index.html
- Option 1: landing.html redirects to index.html after auth (cleaner separation)
- Option 2: index.html shows landing view when not authenticated (single-file stays single)
- **Recommendation**: Option 1 -- separate landing.html. Keeps the app file clean and the marketing page independently optimizable (SEO, performance, A/B testing).

### Phase C: Stripe Integration

- C1: Create Stripe account and configure product ($9.99 one-time)
- C2: Set up Stripe Checkout session (server-side via Cloud Function)
- C3: "Buy Now" button calls Cloud Function to create checkout session
- C4: Configure success and cancel redirect URLs
- C5: Set up Stripe webhook endpoint (Cloud Function)
- C6: Webhook handler: on payment_intent.succeeded -> create Firebase user, set purchased flag
- C7: Send login credentials to user (magic link email via Firebase Auth)

### Phase D: Auth Gate in App

- D1: On app load, check Firebase Auth state
- D2: If not authenticated -> redirect to landing page
- D3: If authenticated but not purchased -> show "purchase required" message
- D4: If authenticated and purchased -> load full app
- D5: Add login/logout UI (minimal -- email display, logout button in settings)
- D6: Persist auth state for offline use (Firebase Auth persistence)

### Phase E: Offline Considerations

- E1: Firebase Auth persists login state in IndexedDB (built-in)
- E2: On first successful auth, cache the purchase flag locally
- E3: App checks local flag first (instant), syncs with Firestore when online
- E4: Service worker caches app shell as before -- auth check happens in JS
- E5: Update sw.js to handle landing.html caching separately

### Phase F: Testing and Hardening

- F1: Test full purchase flow (Stripe test mode)
- F2: Test returning user login flow
- F3: Test offline behavior after purchase
- F4: Test on mobile devices (PWA install after purchase)
- F5: Verify Firestore security rules (unauthorized access blocked)
- F6: Test edge cases: expired sessions, cleared cache, multiple devices

---

## Dependencies

| Dependency | Required For | Notes |
|------------|-------------|-------|
| Stripe account | Phase C | Need to create and verify |
| Firebase project | Phase A | Blaze plan needed for Cloud Functions |
| Custom domain (optional) | Landing page SEO | Can use GitHub Pages domain initially |

**Firebase Blaze Plan Note**: Cloud Functions require the Blaze (pay-as-you-go) plan. At our scale, this will cost essentially $0 (generous free tier). But it does require a billing account on file.

---

## Cost Analysis

| Item | Cost |
|------|------|
| Stripe fee per transaction | ~$0.59 ($9.99 x 2.9% + $0.30) |
| Net revenue per sale | ~$9.40 |
| Firebase Auth | Free (up to 50K monthly active users) |
| Cloud Firestore | Free (up to 1 GiB storage, 50K reads/day) |
| Cloud Functions | Free (up to 2M invocations/month) |
| Stripe account | Free (no monthly fee) |

---

## Cross-Platform Purchase Strategy (Future)

This architecture is designed so iOS and Android can plug in later:

1. iOS app uses StoreKit for purchase -> calls Cloud Function -> sets same `purchased: true` flag
2. Android app uses Google Play Billing -> calls Cloud Function -> sets same flag
3. All platforms check the same Firestore user record on login
4. "Buy once, use everywhere" becomes possible if we choose to honor cross-platform purchases

**Apple/Google Policy Note**: Apple requires apps to use their IAP system for digital content. We cannot direct iOS users to buy via Stripe. The web purchase gate is for web users only. iOS and Android will have their own purchase flows writing to the same Firestore record.

---

## Acceptance Criteria

- [ ] New user can visit landing page without any authentication
- [ ] "Buy Now" completes a $9.99 Stripe Checkout and creates a Firebase account
- [ ] User receives login credentials via email after purchase
- [ ] Logged-in user with purchase flag sees the full AAC Board app
- [ ] Unauthenticated user is redirected to landing page
- [ ] App works offline after initial authenticated load
- [ ] Returning user can log in from any browser and access the app
- [ ] Firestore security rules prevent unauthorized access to user records
- [ ] Purchase flag field supports future values ("stripe", "app_store", "google_play")
- [ ] Mobile PWA install flow works correctly after purchase

---

## Open Questions

1. **Magic link vs password**: Should users log in via magic link (easier, no password to remember) or email/password (more traditional)? Magic link recommended for simplicity.
2. **Free trial**: Should there be a limited free trial before purchase? (e.g., 7 days, or limited to 3x3 grid only). Not recommended for v1 -- keep it simple.
3. **Refund flow**: Stripe handles refunds natively. Do we revoke access on refund? Recommended: yes, webhook on refund -> set purchased = false.
4. **Landing page hosting**: Same repo (GitHub Pages) or separate? Same repo recommended for simplicity.
5. **Marketing website**: The InvestorDeck-RoadmapAlignment doc mentions a marketing website. Should this landing page BE the marketing website, or is that separate? Recommend: this IS the marketing site for v1.

---

## Sequencing Recommendation

**Build order**: A (Firebase) -> B (Landing) -> C (Stripe) -> D (Auth Gate) -> E (Offline) -> F (Testing)

This can begin immediately on the current web stack. No Mac mini or Xcode required. The Firestore user record created here becomes the foundation for iOS and Android purchase verification later.
