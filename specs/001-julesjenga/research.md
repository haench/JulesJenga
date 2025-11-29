# Research: JulesJenga

## Decision: Use Firebase modular Web SDK (Auth, Firestore; Storage optional for raw files)
- Rationale: Minimal dependencies with hosting integration; modular SDK keeps bundle size smaller and supports tree-shaking; Auth already handled externally, Firestore fits shared read model.
- Alternatives considered: Realtime Database (less structured queries, harder per-document rules), REST-only access (adds auth token handling and overhead), bundler-based frameworks (overkill for static app).

## Decision: Firestore schema for shared question sets
- Rationale: One collection `questionSets` with documents `{ title, questions[54], createdAt, createdBy }` enforces fixed-size arrays and auditability; duplicate titles allowed without overwrite; index on `createdAt` for listing.
- Alternatives considered: Store raw file + parse per use (worse latency), nested subcollections per user (conflicts with shared requirement), dynamic question counts (breaks Jenga board mapping).

## Decision: Upload validation and error handling
- Rationale: Client-side parse requires exactly 55 lines, strips whitespace, rejects blanks/overlong questions (>280 chars), shows specific error; prevents malformed data entering Firestore.
- Alternatives considered: Server-side validation (no server), allowing variable counts (breaks grid), auto-padding blanks (ambiguous content).

## Decision: UX and accessibility approach
- Rationale: Smartphone-first layout with accessible modal (focus trap, ESC/close button), 44px touch targets, WCAG 2.1 AA contrast, keyboard support for dropdown/grid; aligns with constitution UX principle.
- Alternatives considered: Desktop-first layout (violates smartphone priority), click-only modals (excludes keyboard users), non-blocking overlays (harder focus management).

## Decision: Testing strategy
- Rationale: Unit tests for parser and state marking; integration tests for upload->Firestore write and set selection; e2e (Playwright) for login stub, set selection, tile open/close, used tile state reset; aligns with testing principle.
- Alternatives considered: Manual-only validation (non-compliant), unit-only (misses integration with Firestore), e2e-only (slow feedback, gaps in parsing edge cases).

## Decision: Performance budgets and measurement
- Rationale: Use Lighthouse/Performance API to measure home->grid (<1.5s p95 on 4G), modal open (<150ms), frame timing (<16ms p95); Firestore write monitored for <2s p95; regressions gate releases per constitution.
- Alternatives considered: No measurement (non-compliant), looser budgets (worse UX), synthetic-only without CI checks (misses real regressions).
