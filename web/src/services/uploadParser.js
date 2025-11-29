const MAX_TITLE = 120;
const MAX_QUESTION = 280;
const REQUIRED_LINES = 55; // 1 title + 54 questions

export function parseQuestionsFile(text) {
  const lines = text.split(/\r?\n/).map((l) => l.trim());
  if (lines.length < REQUIRED_LINES) {
    throw new Error('expected 55 lines: 1 title + 54 questions');
  }
  const trimmed = lines.slice(0, REQUIRED_LINES);
  const [title, ...questions] = trimmed;
  if (!title || title.length > MAX_TITLE) {
    throw new Error('invalid title: must be 1-120 chars');
  }
  if (questions.length !== 54) {
    throw new Error('expected 54 questions');
  }
  questions.forEach((q, idx) => {
    if (!q) {
      throw new Error(`question ${idx + 1} is blank`);
    }
    if (q.length > MAX_QUESTION) {
      throw new Error(`question ${idx + 1} exceeds ${MAX_QUESTION} chars`);
    }
  });
  return { title, questions };
}

export function summarizeParsedSet(parsed) {
  return {
    title: parsed.title,
    count: parsed.questions.length,
  };
}
