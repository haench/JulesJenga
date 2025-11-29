# Data Model: JulesJenga

## Entities

### QuestionSet (Firestore document)
- id: string (Firestore document id)
- title: string (1-120 chars)
- questions: array<string>[54] (each 1-280 chars, trimmed)
- createdAt: timestamp
- createdBy: string (uid)

Constraints:
- Exactly 54 questions; reject otherwise.
- Duplicate titles allowed; no overwrite on collision.
- Ordering of questions must align with tile numbers (index 0 -> tile 1).
- Input sanitized to remove leading/trailing whitespace; empty lines disallowed.

Indexes:
- `createdAt` descending for listing latest uploads.

### UIState (client, not persisted)
- activeSetId: string
- openedTileIds: array<number> (session-only)

Constraints:
- openedTileIds resets on reload; cannot exceed 54 entries; unique values 1-54.
