import { describe, it, expect } from 'vitest';
import { parseQuestionsFile } from '../../src/services/uploadParser.js';

const validText = ['Title', ...Array.from({ length: 54 }, (_, i) => `Q${i + 1}`)].join('\n');

describe('upload contract', () => {
  it('produces OpenAPI-compatible payload shape', () => {
    const parsed = parseQuestionsFile(validText);
    expect(typeof parsed.title).toBe('string');
    expect(Array.isArray(parsed.questions)).toBe(true);
    expect(parsed.questions).toHaveLength(54);
  });
});
