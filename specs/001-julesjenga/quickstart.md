# Quickstart: JulesJenga

## Prerequisites
- Node.js 18+
- Firebase CLI installed and logged in (`firebase login`)
- Firebase project configured (project id, Firestore, Hosting enabled; Auth handled externally but needs configuration)

## Setup
1. Install dependencies: `npm install` (from `web/`)
2. Configure Firebase project id and web app config in `web/src/firebase.js` (or inject `window.FIREBASE_CONFIG` in `public/index.html`).
3. Ensure Firestore rules allow authenticated users to read/write `questionSets` and disallow invalid question arrays; deploy rules from `web/firestore.rules`.

## Run locally
- Serve with Firebase Hosting emulator: `npm run dev` (from `web/`).
- Open the local hosting URL and verify login + dropdown + grid.

## Tests
- Unit/integration: `npm test` (or `npm run test:unit`) for parser/state logic.
- E2E: `npm run test:e2e` (Playwright) covering upload, selection, tile open/close.
- CI: `npm run ci:test` (headless).

## Deploy
- Ensure static assets in `web/public` and source in `web/src`.
- Deploy hosting and Firestore rules: `firebase deploy --only hosting,firestore` (project id set in `.firebaserc`).

## Verification checklist
- Home->grid navigation <1.5s on 4G (measure via Lighthouse/Performance API).
- Modal open <150ms; grid interactions smooth (<16ms frame time p95).
- Upload rejects malformed files; valid upload appears in dropdown and shares to another account.
- Tiles mark as used per session and reset on reload.
- Accessibility: focus trap in modal, 44px touch targets, contrast AA.
- Firestore rules deployed from `web/firestore.rules` and validated.
- QA: run unit/integration tests, then manual pass through dropdown/start, grid modal, upload.
