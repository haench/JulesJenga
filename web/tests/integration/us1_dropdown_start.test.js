import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHome } from '../../src/ui/home.js';
import * as setsService from '../../src/services/setsService.js';

vi.mock('../../src/services/setsService.js');

describe('home UI', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>';
    vi.resetAllMocks();
  });

  it('enables start when set available', async () => {
    setsService.fetchQuestionSets.mockResolvedValueOnce([
      { id: 's1', title: 'Set 1', questions: Array(54).fill('Q'), createdBy: 'u1' },
    ]);
    const root = document.getElementById('root');
    let started = false;
    await renderHome(root, { onStart: () => (started = true), user: { displayName: 'Tester' } });
    const startBtn = root.querySelector('button.primary');
    expect(startBtn.disabled).toBe(false);
    startBtn.click();
    expect(started).toBe(true);
  });

  it('hides creator ids and shows friendly names when available', async () => {
    setsService.fetchQuestionSets.mockResolvedValueOnce([
      { id: 's1', title: 'Set 1', questions: Array(54).fill('Q'), createdBy: 'uid-123' },
      {
        id: 's2',
        title: 'Set 2',
        questions: Array(54).fill('Q'),
        createdBy: 'uid-456',
        createdByName: 'Friendly Creator',
      },
    ]);

    const root = document.getElementById('root');
    await renderHome(root, { user: { displayName: 'Tester' } });

    const options = Array.from(root.querySelectorAll('#question-set option'));
    expect(options[0].textContent).toBe('Set 1');
    expect(options[1].textContent).toBe('Set 2 (Friendly Creator)');
  });
});
