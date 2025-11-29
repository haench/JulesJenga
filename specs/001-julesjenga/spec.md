# Feature Specification: JulesJenga

**Feature Branch**: `001-julesjenga`  
**Created**: 2025-11-29  
**Status**: Draft  
**Input**: User description: "Create a mobile-friendly web app (plain HTML/JS/CSS) hosted on Firebase. Uses Firebase Authentication (handled externally) and Firestore. App name: JulesJenga. After login, greet user by name, show Start button, Upload button, dropdown of available question sets (shared between users). Question set = title + exactly 54 questions. Upload: text file where line 1 is title and lines 2–55 are questions; store in Firestore for persistence. Start: go to 6×9 grid numbered 1–54; tapping a tile opens the corresponding question; closing returns to grid; opened tiles marked. Opened tiles do not persist across sessions."

## Clarifications

### Session 2025-11-29

- Q: How should duplicate titles on upload be handled? ? A: Allow duplicate titles; each upload creates a distinct set; show creator/timestamp in UI to disambiguate; never overwrite.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Choose and start game (Priority: P1)

As an authenticated user, I want to pick a question set and start the game so I can play immediately.

**Why this priority**: Core entry path for every game session.

**Independent Test**: User can select a set from dropdown, press Start, and reach the grid with the chosen set loaded.

**Acceptance Scenarios**:

1. **Given** user is authenticated and at the home screen, **When** they open the dropdown and choose a set, **Then** the selection is reflected and Start becomes enabled.
2. **Given** a set is selected, **When** the user taps Start, **Then** they see a 6×9 grid labeled 1–54 loaded with that set’s questions (ready to open).

### User Story 2 - Play through tiles (Priority: P1)

As a player, I want to tap tiles to reveal questions and track which tiles were used during this session.

**Why this priority**: Primary gameplay loop.

**Independent Test**: From the grid, user taps any number 1–54, sees the right question, closes it, and the tile shows as used; state resets on reload.

**Acceptance Scenarios**:

1. **Given** the grid is displayed, **When** the user taps tile 17, **Then** a modal shows question 17’s text with a close action.
2. **Given** a question modal is open, **When** the user closes it, **Then** they return to the grid and tile 17 is visibly marked as used while other tiles remain untouched.
3. **Given** the session ends or the page reloads, **When** the grid reappears, **Then** all tiles are unmarked (session-only state).

### User Story 3 - Upload a question set (Priority: P2)

As a user, I want to upload a text file with 54 questions and a title so it becomes available to everyone.

**Why this priority**: Enables custom/shared content.

**Independent Test**: User uploads a valid file; set appears in dropdown for all users after successful save; malformed files are rejected with clear error.

**Acceptance Scenarios**:

1. **Given** the user taps Upload, **When** they select a valid file (55 lines), **Then** the app parses title + 54 questions, saves to Firestore, confirms success, and the new set appears in the dropdown (after refresh or auto-refresh).
2. **Given** the user selects a file with missing lines, **When** upload is attempted, **Then** the app blocks the upload and shows a specific error ("expected 55 lines: 1 title + 54 questions").
3. **Given** network loss during upload, **When** save fails, **Then** the user sees a retry option and no partial set is listed.

### Edge Cases

- File has more or fewer than 55 lines: reject and show precise error.
- Duplicate titles: allow multiple sets; do not overwrite; disambiguate in UI (e.g., creator/timestamp).
- Empty lines within the 54 questions: reject with specific error.
- Long question text: enforce max length (e.g., 280 chars) and validate on upload.
- Offline at app start: show error and retry; grid unusable without data.
- Rapid tile taps: ensure only one modal opens at a time.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST list all shared question sets from Firestore in a dropdown after login.
- **FR-002**: System MUST require a selected set before enabling Start.
- **FR-003**: System MUST render a 6×9 grid with tiles numbered 1–54.
- **FR-004**: System MUST open the correct question in a modal when a tile is tapped.
- **FR-005**: System MUST mark tiles as used after viewing; this state MUST reset on reload/new session.
- **FR-006**: System MUST accept text file uploads where line 1 = title and lines 2–55 = questions; reject invalid counts.
- **FR-007**: System MUST persist uploaded sets to Firestore and make them available to all authenticated users.
- **FR-008**: System MUST show clear error states for malformed uploads, network failures, and missing data.
- **FR-009**: System MUST display the user’s name from Firebase Auth on the home screen.
- **FR-010**: System MUST create a new QuestionSet even when the uploaded title duplicates an existing one and present disambiguation in the UI (e.g., creator or timestamp) without overwriting prior sets.

### Non-Functional Requirements

- **NFR-001**: UX MUST be smartphone-first responsive; touch targets at least 44px; modal accessible (focus trap, ESC/close), dropdown and buttons keyboard-focusable; color contrast meets WCAG 2.1 AA.
- **NFR-002**: Performance budgets: home-to-grid navigation <1.5s p95 on 4G; modal open <150ms p95; grid interactions maintain <16ms frame time p95; upload parse <300ms, Firestore save <2s p95.
- **NFR-003**: Reliability/observability: show user-facing spinners/progress for loads/uploads; log errors to console with actionable messages during development; handle retries for transient Firestore errors.
- **NFR-004**: Security/privacy: enforce Firestore security rules so only authenticated users can read/write; uploaded content contains no secrets; no PII stored beyond Firebase Auth profile.
- **NFR-005**: Shared sets: all authenticated users can read sets; writes create new sets; deletion/update policy TBD (default: no delete path yet).

### Key Entities *(include if feature involves data)*

- **QuestionSet**: `{ id, title, questions[54], createdAt, createdBy }` in Firestore.
- **UI State (ephemeral)**: `{ activeSetId, openedTileIds[] }` held in memory (not persisted).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% of users reach the grid from home within 1.5s on 4G.
- **SC-002**: 95% of modal opens occur within 150ms from tile tap.
- **SC-003**: 0 invalid (non-55-line) files are accepted; 100% show clear error.
- **SC-004**: 100% of uploaded valid sets appear in dropdown for another authenticated user within 5s.
- **SC-005**: Mobile usability: at least 90% of test participants (or heuristic check) can start a game and open a question without guidance on a smartphone layout.
