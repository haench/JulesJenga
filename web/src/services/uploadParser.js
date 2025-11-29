const MAX_TITLE = 120;
const MAX_QUESTION = 280;
const REQUIRED_LINES = 55; // 1 title + 54 questions

export function parseQuestionsFile(text) {
  const lines = text.split(/\r?\n/).map((l) => l.trim());
  if (lines.length < REQUIRED_LINES) {
    throw new Error('Es werden 55 Zeilen erwartet: 1 Titel + 54 Fragen');
  }
  const trimmed = lines.slice(0, REQUIRED_LINES);
  const [title, ...questions] = trimmed;
  if (!title || title.length > MAX_TITLE) {
    throw new Error('Ungültiger Titel: 1-120 Zeichen erforderlich');
  }
  if (questions.length !== 54) {
    throw new Error('Es werden 54 Fragen erwartet');
  }
  questions.forEach((q, idx) => {
    if (!q) {
      throw new Error(`Frage ${idx + 1} ist leer`);
    }
    if (q.length > MAX_QUESTION) {
      throw new Error(`Frage ${idx + 1} überschreitet ${MAX_QUESTION} Zeichen`);
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
