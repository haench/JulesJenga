<!--
Sync Impact Report
Version: N/A -> 1.0.0
Modified principles: New — I. Code Quality & Maintainability; II. Testing Discipline & Coverage; III. User Experience Consistency & Accessibility; IV. Performance & Efficiency Targets; V. Decision Traceability & Delivery Governance
Added sections: Quality Standards & Non-Functional Requirements; Development Workflow & Quality Gates
Removed sections: None
Templates requiring updates: .specify/templates/plan-template.md ✅; .specify/templates/spec-template.md ✅; .specify/templates/tasks-template.md ✅; .specify/templates/commands/* ⚠ (not present)
Follow-up TODOs: None
-->

# JulesJenga Constitution

## Core Principles

### I. Code Quality & Maintainability
Every change MUST improve or preserve readability, maintainability, and safety. Mandatory practices: consistent formatting and linting; small, cohesive changes with clear intent; peer review before merge; inline documentation for non-obvious logic and public interfaces; dead code and unused flags removed. Rationale: disciplined code reduces defects, lowers onboarding cost, and keeps future changes fast.

### II. Testing Discipline & Coverage
Automated tests MUST accompany all functional changes: unit tests for logic, contract/integration tests for interfaces, and regression tests for found defects. Critical flows (auth, payments, data integrity) require explicit negative tests. Tests MUST be deterministic and run in CI; failing or flaky tests block release. Rationale: predictable releases depend on fast, trusted feedback.

### III. User Experience Consistency & Accessibility
Implementations MUST adhere to the agreed design system (layout, components, tokens, copy style) and WCAG 2.1 AA accessibility standards. All user-facing changes require UX acceptance criteria: consistent navigation, clear error states, resilient offline/poor-network behavior where applicable, and localized text handling. Rationale: consistent UX builds trust and reduces user friction across features.

### IV. Performance & Efficiency Targets
Each feature MUST define and honor performance budgets (e.g., p95 latency, frame rate, memory/CPU bounds) and confirm them with measurement. Hot paths require profiling before optimization; any regression beyond agreed budgets blocks release. Backward-incompatible performance trade-offs need documented approval and mitigation. Rationale: performance is a user-visible feature and protects operational costs.

### V. Decision Traceability & Delivery Governance
Material technical decisions MUST be traceable to these principles via ADRs or design notes, including options considered and their principle alignment. Coupling, complexity, or tech-debt acceptance requires explicit, time-bound remediation plans. Rationale: transparent decisions keep the system coherent and auditable.

## Quality Standards & Non-Functional Requirements

- Security, privacy, and compliance requirements inherit the strictest applicable policy; do not store or transmit secrets in logs or telemetry.
- Dependencies MUST be current on security patches; deprecated packages require replacement plans before acceptance.
- Observability: structured logs, actionable alerts, and minimal SLOs for availability and latency are required for any new surface.
- Rollout safety: feature flags or gradual deployments are required for risky changes; rollback paths must be validated.

## Development Workflow & Quality Gates

- Definition of Ready: principle alignment checked, performance budgets defined, UX acceptance criteria captured, and test strategy agreed before implementation begins.
- Definition of Done: code merged only after tests pass in CI, UX acceptance is verified, performance checks meet budgets, and documentation (code-level and user-facing where applicable) is updated.
- Reviews: PRs must cite which principles are addressed; reviewers block merges when evidence is missing (tests, measurements, UX proof).
- Releases: no releases with unresolved flaky tests, unmeasured performance risks, or UX guideline deviations without explicit, time-limited exceptions approved by engineering leadership.

## Governance

- Authority: This constitution supersedes other engineering practice documents for conflicting topics.
- Amendments: Proposed via PR with redlines and rationale; require approval from engineering lead and one UX and one QA representative. Migration or remediation plans must accompany changes that alter obligations.
- Versioning: Semantic versioning for this document (MAJOR for breaking/removal of principles, MINOR for new or expanded principles/sections, PATCH for clarifications). Last Amended updates on every accepted change.
- Compliance: Feature plans and PR checklists must include a Constitution Check; periodic audits (at least quarterly) verify adherence, and gaps require tracked remediation tasks.

**Version**: 1.0.0 | **Ratified**: 2025-11-29 | **Last Amended**: 2025-11-29
