import { parseQuestionsFile } from '../services/uploadParser.js';
import { createQuestionSet, fetchQuestionSets } from '../services/setsService.js';
import { loadSets } from '../state/appState.js';

export function renderUpload(root, { onDone }) {
  root.innerHTML = '';
  const heading = document.createElement('h2');
  heading.textContent = 'Upload question set';

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.txt,text/plain';

  const hint = document.createElement('p');
  hint.className = 'muted';
  hint.textContent = 'File format: first line = title, next 54 lines = questions. Max 280 chars per question.';

  const status = document.createElement('div');
  status.className = 'status';

  const uploadBtn = document.createElement('button');
  uploadBtn.textContent = 'Upload';

  const backBtn = document.createElement('button');
  backBtn.textContent = 'Back';

  uploadBtn.addEventListener('click', async () => {
    const file = fileInput.files?.[0];
    if (!file) {
      status.textContent = 'Select a file first.';
      return;
    }
    const text = await file.text();
    try {
      const parsed = parseQuestionsFile(text);
      status.textContent = 'Uploading...';
      await createQuestionSet(parsed);
      const sets = await fetchQuestionSets();
      loadSets(sets);
      status.textContent = 'Upload complete.';
      onDone?.();
    } catch (err) {
      status.textContent = err.message || 'Upload failed.';
    }
  });

  backBtn.addEventListener('click', () => onDone?.());

  root.appendChild(heading);
  root.appendChild(hint);
  root.appendChild(fileInput);
  root.appendChild(uploadBtn);
  root.appendChild(backBtn);
  root.appendChild(status);
}
