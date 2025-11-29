---

description: "Task list for JulesJenga feature"
---

# Tasks: JulesJenga

**Input**: Design documents from `/specs/001-julesjenga/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Automated tests are REQUIRED for every functional change (unit plus integration/contract per interface). Add explicit regression tests for fixed defects.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project structure `web/public`, `web/src`, `tests/unit`, `tests/integration`, `tests/e2e`
- [X] T002 Initialize project manifest (package.json) with scripts for dev/test in `web/package.json`
- [X] T003 Install dependencies (firebase, firebase-tools, playwright, test runner) in `web/package.json`
- [X] T004 Add base HTML/CSS shell in `web/public/index.html` and `web/public/styles/main.css`
- [X] T005 [P] Add lint/format config (e.g., eslint/prettier defaults) at repo root for JS/HTML/CSS

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [X] T006 Configure Firebase web app bootstrap in `web/src/firebase.js` with env placeholders
- [X] T007 Define Firestore security rules (auth required; validate 54-question array; prevent destructive overwrite) in `web/firestore.rules`
- [X] T008 Add emulator configuration for hosting/firestore in `firebase.json` and `.firebaserc`
- [X] T009 Wire build/serve scripts for Firebase Hosting and emulators in `package.json`
- [X] T010 Set up CI test command in `package.json` and document in `specs/001-julesjenga/quickstart.md`

---

## Phase 3: User Story 1 - Choose and start game (Priority: P1) MVP

**Goal**: Authenticated user picks a question set and starts the game.

**Independent Test**: User selects a set from dropdown, taps Start, and reaches grid with chosen set loaded.

### Tests for User Story 1 (required)

- [X] T011 [P] [US1] Unit test Firestore fetch/select flow in `web/tests/unit/sets.fetch.test.js`
- [X] T012 [P] [US1] Integration test: dropdown selection enables Start and loads grid in `web/tests/integration/us1_dropdown_start.test.js`

### Implementation for User Story 1

- [X] T013 [US1] Implement greeting, dropdown, Start/Upload buttons in `web/src/ui/home.js`
- [X] T014 [US1] Implement Firestore fetch of `questionSets` with createdAt ordering in `web/src/services/setsService.js`
- [X] T015 [US1] Wire selection state and Start navigation to grid in `web/src/state/appState.js`
- [X] T016 [US1] Render 6x9 grid shell with selected set loaded in `web/src/ui/grid.js`
- [X] T017 [US1] Handle loading/error states for set fetch and selection in `web/src/ui/home.js`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Play through tiles (Priority: P1)

**Goal**: Player taps tiles to reveal questions and track used tiles per session.

**Independent Test**: Grid tap opens correct question; closing returns to grid; used tiles marked; reset on reload.

### Tests for User Story 2 (required)

- [X] T018 [P] [US2] Unit test tile state transitions (open/close/mark used/reset) in `web/tests/unit/grid.state.test.js`
- [X] T019 [P] [US2] Integration test modal open/close and used-tile marking in `web/tests/integration/us2_grid_modal.test.js`

### Implementation for User Story 2

- [X] T020 [US2] Implement modal component with focus trap and ESC/close handling in `web/src/ui/modal.js`
- [X] T021 [US2] Connect grid tiles to questions by index (1-54) and open modal on tap in `web/src/ui/grid.js`
- [X] T022 [US2] Mark tiles as used in session state and visually in `web/src/ui/grid.js`
- [X] T023 [US2] Ensure session reset of opened tiles on reload in `web/src/state/appState.js`

**Checkpoint**: User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - Upload a question set (Priority: P2)

**Goal**: User uploads a 55-line text file to create a shared question set.

**Independent Test**: Valid file uploads, saves to Firestore, and appears in dropdown for all users; malformed files are rejected with clear errors.

### Tests for User Story 3 (required)

- [X] T024 [P] [US3] Unit test parser/validator for 55-line files and 280-char limit in `web/tests/unit/upload.parser.test.js`
- [X] T025 [P] [US3] Integration test upload flow: accept valid, reject malformed, refresh dropdown in `web/tests/integration/us3_upload_flow.test.js`
- [X] T026 [P] [US3] Contract test sample payload against `specs/001-julesjenga/contracts/openapi.yaml` in `web/tests/contract/upload.contract.test.js`

### Implementation for User Story 3

- [X] T027 [US3] Implement upload UI (file input, status/error display) in `web/src/ui/upload.js`
- [X] T028 [US3] Implement parser/validator (55 lines, trim, no blanks, <=280 chars) in `web/src/services/uploadParser.js`
- [X] T029 [US3] Implement Firestore write for new QuestionSet (no overwrite; include createdBy/createdAt) in `web/src/services/setsService.js`
- [X] T030 [US3] Refresh available sets after upload and handle duplicate title disambiguation in `web/src/state/appState.js`

**Checkpoint**: User Stories 1, 2, and 3 are independently functional and testable.

---

## Phase N: Polish & Cross-Cutting Concerns

- [X] T031 [P] Add accessibility audit (focus order, contrast, touch targets) and fixes across `web/src/ui/*`
- [X] T032 [P] Measure performance budgets (home->grid, modal open, frame timing) and optimize hot paths in `web/src`
- [X] T033 Harden Firestore rules and add README snippet in `specs/001-julesjenga/quickstart.md`
- [X] T034 [P] Add loading/error UX polish (spinners/toasts) in `web/src/ui`
- [X] T035 Final QA pass and update documentation links in `specs/001-julesjenga/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies
- Setup (Phase 1) -> Foundational (Phase 2) -> User Stories (3-5) -> Polish (N)

### User Story Dependencies
- User Story 1 (P1): No dependency on other stories (requires Phases 1-2)
- User Story 2 (P1): Depends on User Story 1 being functional (grid uses selected set)
- User Story 3 (P2): Can proceed after Foundational; dropdown refresh integrates with User Story 1

### Within Each User Story
- Tests written before implementation tasks; ensure failing first
- Models/state before UI bindings; UI before integration

### Parallel Opportunities
- Marked [P] tasks can run in parallel (e.g., tests in different files, lint setup vs. HTML shell)
- Within a story, test scaffolding and UI shells can proceed in parallel when files do not conflict

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Complete Phases 1-2
2. Implement Phase 3 (User Story 1) and validate independently
3. Deploy/demo MVP if desired

### Incremental Delivery
1. Add User Story 2 after MVP; validate independently
2. Add User Story 3; validate independently and with dropdown refresh

### Parallel Team Strategy
- One developer on upload flow (US3) after foundations
- One on home/dropdown/start (US1) and grid shell
- One on modal/tiles (US2) and accessibility/performance polish
