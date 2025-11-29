# Quickstart: JulesJenga

## Prerequisites
- Node.js 18+
- Firebase CLI installed and logged in (`firebase login`)
- Firebase project configured (project id, Firestore, Hosting enabled; Auth handled externally but needs configuration)

## Setup
1. Install dependencies (if using package.json): `npm install`
2. Configure Firebase project id and web app config in `web/src/firebase.js` (or environment setup).
3. Ensure Firestore rules allow authenticated users to read/write `questionSets` and disallow overwrites by title.

## Run locally
- Serve with Firebase Hosting emulator: `firebase emulators:start --only hosting,firestore`
- Open the local hosting URL and verify login + dropdown + grid.

## Tests
- Unit/integration: `npm test` (or `npm run test:unit`) for parser/state logic.
- E2E: `npm run test:e2e` (Playwright) covering upload, selection, tile open/close.

## Deploy
- Build (if needed) or ensure static assets in `web/public`.
- Deploy hosting and Firestore rules: `firebase deploy --only hosting,firestore`

## Verification checklist
- Home->grid navigation <1.5s on 4G.
- Modal open <150ms; grid interactions smooth (<16ms frame time p95).
- Upload rejects malformed files; valid upload appears in dropdown and shares to another account.
- Tiles mark as used per session and reset on reload.
- Accessibility: focus trap in modal, 44px touch targets, contrast AA.
