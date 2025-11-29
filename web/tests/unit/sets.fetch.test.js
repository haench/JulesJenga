import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../src/firebase.js', () => {
  const mockAddDoc = vi.fn(async () => ({ id: 'new-id' }));
  const mockCollection = vi.fn((db, name) => ({ db, name }));
  return {
    getDb: vi.fn(async () => ({})),
    getAuthInstance: vi.fn(async () => ({ currentUser: { uid: 'user-1' } })),
    getFirestoreFns: vi.fn(async () => ({
      collection: mockCollection,
      query: vi.fn((c) => c),
      orderBy: vi.fn(),
      getDocs: vi.fn(async () => ({
        docs: [
          { id: '1', data: () => ({ title: 'A', questions: [] }) },
          { id: '2', data: () => ({ title: 'B', questions: [] }) },
        ],
      })),
      addDoc: mockAddDoc,
      serverTimestamp: vi.fn(() => 'now'),
    })),
    __mock: { mockAddDoc, mockCollection },
  };
});

import { fetchQuestionSets, createQuestionSet } from '../../src/services/setsService.js';
import { __mock as firebaseMock } from '../../src/firebase.js';

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
    const payload = firebaseMock.mockAddDoc.mock.calls[0][1];
    expect(payload.createdByName).toBeUndefined();
    expect(payload).toMatchObject({ title: 'T', createdBy: 'user-1' });
  });
});
