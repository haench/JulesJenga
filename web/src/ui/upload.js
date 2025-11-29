import { parseQuestionsFile } from '../services/uploadParser.js';
import { createQuestionSet, fetchQuestionSets } from '../services/setsService.js';
import { loadSets } from '../state/appState.js';

export function renderUpload(root, { onDone }) {
  root.innerHTML = '';
  const heading = document.createElement('h2');
  heading.textContent = 'Fragenset Upload';

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.txt,text/plain';

  const hint = document.createElement('p');
  hint.className = 'muted';
  hint.textContent =
    'Dateiformat: erste Zeile = Titel, nächste 54 Zeilen = Fragen. Max. 280 Zeichen pro Frage. Jedes Set hat 54 Fragen; für den Upload wird eine Textdatei mit 55 Zeilen benötigt (Titel + 54 Fragen).';

  const status = document.createElement('div');
  status.className = 'status';

  const uploadBtn = document.createElement('button');
  uploadBtn.textContent = 'Katalog hochladen';

  const backBtn = document.createElement('button');
  backBtn.textContent = 'Zurück';

  uploadBtn.addEventListener('click', async () => {
    const file = fileInput.files?.[0];
    if (!file) {
      status.textContent = 'Wähle zuerst eine Datei aus.';
      return;
    }
    const text = await file.text();
    try {
      const parsed = parseQuestionsFile(text);
      status.textContent = 'Upload läuft...';
      await createQuestionSet(parsed);
      const sets = await fetchQuestionSets();
      loadSets(sets);
      status.textContent = 'Upload abgeschlossen.';
      onDone?.();
    } catch (err) {
      status.textContent = err.message || 'Upload fehlgeschlagen.';
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
