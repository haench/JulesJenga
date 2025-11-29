import { describe, it, expect } from 'vitest';
import { parseQuestionsFile } from '../../src/services/uploadParser.js';

describe('parseQuestionsFile', () => {
  it('parses valid 55-line input', () => {
    const lines = ['Title', ...Array.from({ length: 54 }, (_, i) => `Q${i + 1}`)];
    const text = lines.join('\n');
    const result = parseQuestionsFile(text);
    expect(result.title).toBe('Title');
    expect(result.questions).toHaveLength(54);
    expect(result.questions[0]).toBe('Q1');
  });

  it('rejects missing lines', () => {
    const text = 'Only title';
    expect(() => parseQuestionsFile(text)).toThrow(/expected 55/);
  });

  it('rejects blank question', () => {
    const lines = ['Title', '', ...Array.from({ length: 53 }, (_, i) => `Q${i + 1}`)];
    const text = lines.join('\n');
    expect(() => parseQuestionsFile(text)).toThrow(/blank/);
  });

  it('rejects long question', () => {
    const lines = ['Title', 'a'.repeat(281), ...Array.from({ length: 53 }, () => 'ok')];
    expect(() => parseQuestionsFile(lines.join('\n'))).toThrow(/exceeds/);
  });
});
