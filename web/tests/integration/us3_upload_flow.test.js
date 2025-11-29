import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderUpload } from '../../src/ui/upload.js';
import * as uploadParser from '../../src/services/uploadParser.js';
import * as setsService from '../../src/services/setsService.js';

const wait = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('upload flow', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>';
    vi.restoreAllMocks();
  });

  it('accepts valid file and refreshes sets', async () => {
    const root = document.getElementById('root');
    const file = new File(['placeholder'], 'qs.txt', { type: 'text/plain' });
    file.text = () => Promise.resolve('dummy');
    const parsed = { title: 'Title', questions: Array(54).fill('Q') };
    vi.spyOn(uploadParser, 'parseQuestionsFile').mockReturnValue(parsed);
    vi.spyOn(setsService, 'createQuestionSet').mockResolvedValue('new-id');
    vi.spyOn(setsService, 'fetchQuestionSets').mockResolvedValue([{ id: 'id', title: 'Title', questions: parsed.questions }]);

    renderUpload(root, { onDone: () => {} });
    const input = root.querySelector('input[type="file"]');
    const buttons = root.querySelectorAll('button');
    const uploadBtn = buttons[0];
    Object.defineProperty(input, 'files', { value: [file] });
    uploadBtn.click();
    await wait();
    await wait();
    expect(setsService.createQuestionSet).toHaveBeenCalledWith(parsed);
    expect(setsService.fetchQuestionSets).toHaveBeenCalled();
  });

  it('rejects malformed file', async () => {
    const root = document.getElementById('root');
    const file = new File(['placeholder'], 'qs.txt', { type: 'text/plain' });
    file.text = () => Promise.resolve('bad');
    vi.spyOn(uploadParser, 'parseQuestionsFile').mockImplementation(() => {
      throw new Error('expected 55 lines');
    });
    renderUpload(root, { onDone: () => {} });
    const input = root.querySelector('input[type="file"]');
    const buttons = root.querySelectorAll('button');
    const uploadBtn = buttons[0];
    Object.defineProperty(input, 'files', { value: [file] });
    uploadBtn.click();
    await wait();
    const status = root.querySelector('.status');
    expect(status.textContent).toContain('expected 55 lines');
  });
});
