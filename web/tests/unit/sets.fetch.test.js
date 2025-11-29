import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('firebase/app', () => ({ initializeApp: vi.fn(() => ({})), getApps: vi.fn(() => []) }));
vi.mock('firebase/auth', () => ({ getAuth: vi.fn(() => ({ currentUser: { uid: 'user-1' } })) }));
vi.mock('firebase/firestore', () => {
  return {
    getFirestore: vi.fn(() => ({})),
    collection: vi.fn((db, name) => ({ db, name })),
    query: vi.fn((c) => c),
    orderBy: vi.fn(),
    getDocs: vi.fn(async () => ({
      docs: [
        { id: '1', data: () => ({ title: 'A', questions: [] }) },
        { id: '2', data: () => ({ title: 'B', questions: [] }) },
      ],
    })),
    addDoc: vi.fn(async () => ({ id: 'new-id' })),
    serverTimestamp: vi.fn(() => 'now'),
  };
});

import { fetchQuestionSets, createQuestionSet } from '../../src/services/setsService.js';

describe('setsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches and maps sets', async () => {
    const sets = await fetchQuestionSets();
    expect(sets).toHaveLength(2);
    expect(sets[0]).toMatchObject({ id: '1', title: 'A' });
  });

  it('creates set with auth user', async () => {
    const id = await createQuestionSet({ title: 'T', questions: Array(54).fill('q') });
    expect(id).toBe('new-id');
  });
});
