# Web Payment Gate - Implementation Notes

**Feature**: Web Payment Gate (Stripe + Firebase Auth)
**Plan Doc**: WebPaymentGate.md
**Status**: PLANNING -- awaiting approval

---

## Implementation Checklist

### Phase A: Firebase Setup
- [ ] Create Firebase project
- [ ] Enable Firebase Auth (email/magic link)
- [ ] Set up Cloud Firestore with security rules
- [ ] Add Firebase SDK to app

### Phase B: Landing Page
- [ ] Create landing.html with marketing content
- [ ] Hero section, features, screenshots, pricing
- [ ] Login link for returning users
- [ ] Mobile-responsive and accessible

### Phase C: Stripe Integration
- [ ] Create Stripe account and product
- [ ] Cloud Function for Checkout session creation
- [ ] "Buy Now" button wired to checkout
- [ ] Stripe webhook Cloud Function
- [ ] Webhook creates Firebase user and sets purchase flag
- [ ] Magic link email sent to user

### Phase D: Auth Gate in App
- [ ] Firebase Auth state check on app load
- [ ] Redirect unauthenticated users to landing page
- [ ] Login/logout UI in settings
- [ ] Auth persistence for offline

### Phase E: Offline Considerations
- [ ] Local purchase flag caching
- [ ] Service worker updates for landing.html
- [ ] Offline auth state verification

### Phase F: Testing
- [ ] Full purchase flow (Stripe test mode)
- [ ] Returning user login
- [ ] Offline after purchase
- [ ] Mobile PWA install after purchase
- [ ] Firestore security rules verification
- [ ] Edge cases (expired session, cleared cache, multi-device)

---

## Issues and Resolutions

(None yet -- planning phase)

---

## Session Log

| Date | Action |
|------|--------|
| 2026-03-08 | Plan document created, awaiting approval |
