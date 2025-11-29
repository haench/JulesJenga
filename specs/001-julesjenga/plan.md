# Implementation Plan: JulesJenga

**Branch**: `001-julesjenga` | **Date**: 2025-11-29 | **Spec**: specs/001-julesjenga/spec.md
**Input**: Feature specification from `specs/001-julesjenga/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Mobile-friendly web app for JulesJenga: Firebase-authenticated users select shared 54-question sets, upload new sets via text file, and play via a 6x9 numbered grid that reveals questions. Uses plain HTML/CSS/JS, Firebase Auth (handled externally), and Firestore for shared persistence. Performance and UX budgets: home->grid <1.5s p95 on 4G, modal open <150ms p95, smartphone-first responsive with accessible controls.

## Technical Context

**Language/Version**: HTML5, CSS, JavaScript (ES2020+ modules)
**Primary Dependencies**: Firebase JS SDK (Auth handled externally, Firestore, optional Storage for raw uploads), lightweight modal utility (vanilla or minimal helper)
**Storage**: Firestore collection for QuestionSets; optional Firebase Storage for archived raw text uploads (non-blocking)
**Testing**: Unit tests for parsing/state (Vitest or Jest); UI/e2e via Playwright; run in CI
**Target Platform**: Modern browsers on smartphones and desktop
**Project Type**: Single-page web app (static hosting via Firebase Hosting)
**Performance Goals**: p95 home->grid <1.5s on 4G; modal open <150ms p95; grid interactions <16ms frame time p95; upload parse <300ms; Firestore save <2s p95
**Constraints**: WCAG 2.1 AA contrast/focus/touch targets; session-only tile state; shared question sets readable by all authenticated users; offline usage not required (must show graceful errors)
**Scale/Scope**: Small concurrent usage (dozens to low hundreds); minimal data volume (tens/hundreds of sets)

## Constitution Check

- Code Quality & Maintainability: PASS — modular JS, lint/format, dead-code removal, peer review planned (Phase 2).
- Testing Discipline & Coverage: PASS — unit + integration + e2e committed (Phase 2 tasks); regression tests for upload parser.
- User Experience Consistency & Accessibility: PASS — smartphone-first, WCAG 2.1 AA, modal focus trap, 44px targets (Phase 2 tasks).
- Performance & Efficiency Targets: PASS — budgets defined; measurement tasks in Phase 2; rollback via feature flag noted.
- Decision Traceability & Delivery Governance: PASS — ADR/research recorded; PRs must cite principle coverage.

## Project Structure

### Documentation (this feature)

```text
specs/001-julesjenga/
+- plan.md              # This file (/speckit.plan output)
+- research.md          # Phase 0 output
+- data-model.md        # Phase 1 output
+- quickstart.md        # Phase 1 output
+- contracts/           # Phase 1 output (OpenAPI/usage)
+- tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
web/
+- public/
|  +- index.html
|  +- styles/
|  +- assets/
+- src/
   +- main.js
   +- firebase.js
   +- ui/
   +- state/
   +- services/

tests/
+- unit/
+- integration/
+- e2e/
```

**Structure Decision**: Single web app hosted on Firebase Hosting; plain HTML/CSS/JS with Firebase SDK. Tests live under `tests/` aligned to unit/integration/e2e.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |

## Phase 0: Research & Clarifications

- Review spec (`specs/001-julesjenga/spec.md`) and research (`specs/001-julesjenga/research.md`); confirm no [NEEDS CLARIFICATION] markers remain.
- Finalize Firestore schema decisions (duplicate title policy, 54-question enforcement) and validation thresholds (55 lines, 280-char limit).
- Document performance and accessibility measurement approach in research.md if further detail needed.

## Phase 1: Design, Data Model, Contracts, Quickstart

- Data model: Validate `specs/001-julesjenga/data-model.md` against spec; ensure question order index 0->tile 1 and duplicate-title policy reflected.
- Contracts: Align `specs/001-julesjenga/contracts/openapi.yaml` with Firestore usage; add any missing fields (createdBy, timestamps) and sample payloads if needed.
- Quickstart: Ensure local emulator/hosting steps in `specs/001-julesjenga/quickstart.md` match planned repo structure (`web/`, `tests/`).
- Security rules: Draft Firestore rules to allow authenticated read/write, validate array length, and prevent destructive overwrite; link rule deployment steps in quickstart.
- Update plan if any new constraints emerge from these artifacts.

## Phase 2: Implementation & Testing (inform tasks.md)

- Scaffold project structure (`web/public`, `web/src`, `tests/`).
- Implement Firebase bootstrap (`web/src/firebase.js`) with config placeholders.
- UI flow: home screen with greeting, dropdown of sets, Start and Upload buttons; route/state management in `web/src`.
- Upload flow: client parse/validate 55-line text; show errors; write to Firestore; optional store raw file in Storage; refresh dropdown.
- Play flow: render 6x9 grid; open modal with question; mark used tiles (session-only); reset on reload.
- Accessibility: modal focus trap, keyboard/touch navigation, 44px targets, contrast checks.
- Performance: measure home->grid, modal open, frame timing; optimize if budgets missed; feature-flag risky changes.
- Testing: unit tests for parser/state; integration tests for Firestore read/write flow; e2e for upload, set selection, tile open/close/reset. Ensure CI determinism.
