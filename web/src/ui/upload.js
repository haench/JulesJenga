import { parseQuestionsFile } from '../services/uploadParser.js';
import { createQuestionSet, deleteQuestionSet, fetchQuestionSets } from '../services/setsService.js';
import { loadSets } from '../state/appState.js';

export function renderUpload(root, { onDone }) {
  root.innerHTML = '';

  const uploadCard = document.createElement('section');
  uploadCard.className = 'card upload-card';

  const heading = document.createElement('h2');
  heading.textContent = 'Fragenset Upload';

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.txt,text/plain';
  fileInput.className = 'file-input';

  const hint = document.createElement('p');
  hint.className = 'muted';
  hint.textContent =
    'Dateiformat: erste Zeile = Titel, nächste 54 Zeilen = Fragen. Max. 280 Zeichen pro Frage. Jedes Set hat 54 Fragen; für den Upload wird eine Textdatei mit 55 Zeilen benötigt (Titel + 54 Fragen).';

  const uploadStatus = document.createElement('div');
  uploadStatus.className = 'status';

  const uploadBtn = document.createElement('button');
  uploadBtn.textContent = 'Katalog hochladen';

  const uploadActions = document.createElement('div');
  uploadActions.className = 'control-stack upload-controls';
  uploadActions.appendChild(fileInput);
  uploadActions.appendChild(uploadBtn);

  uploadBtn.addEventListener('click', async () => {
    const file = fileInput.files?.[0];
    if (!file) {
      uploadStatus.textContent = 'Wähle zuerst eine Datei aus.';
      return;
    }
    const text = await file.text();
    try {
      const parsed = parseQuestionsFile(text);
      uploadStatus.textContent = 'Upload läuft...';
      await createQuestionSet(parsed);
      const sets = await fetchQuestionSets();
      loadSets(sets);
      uploadStatus.textContent = 'Upload abgeschlossen.';
      await loadCatalogs();
      onDone?.();
    } catch (err) {
      uploadStatus.textContent = err.message || 'Upload fehlgeschlagen.';
    }
  });

  uploadCard.appendChild(heading);
  uploadCard.appendChild(hint);
  uploadCard.appendChild(uploadActions);
  uploadCard.appendChild(uploadStatus);

  const manageCard = document.createElement('section');
  manageCard.className = 'card manage-card';

  const manageHeading = document.createElement('h3');
  manageHeading.textContent = 'Kataloge bearbeiten';

  const catalogDropdown = document.createElement('select');
  catalogDropdown.id = 'catalog-dropdown';
  catalogDropdown.ariaLabel = 'Katalog auswählen';

  const manageControls = document.createElement('div');
  manageControls.className = 'control-stack manage-controls';

  const downloadBtn = document.createElement('button');
  downloadBtn.textContent = 'Herunterladen';
  downloadBtn.className = 'secondary';

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Löschen';
  deleteBtn.className = 'ghost';

  manageControls.appendChild(catalogDropdown);
  manageControls.appendChild(downloadBtn);
  manageControls.appendChild(deleteBtn);

  const manageStatus = document.createElement('div');
  manageStatus.className = 'status';

  manageCard.appendChild(manageHeading);
  manageCard.appendChild(manageControls);
  manageCard.appendChild(manageStatus);

  const backActions = document.createElement('div');
  backActions.className = 'control-stack page-nav';

  const backBtn = document.createElement('button');
  backBtn.textContent = 'Zurück zur Startseite';

  backActions.appendChild(backBtn);

  root.appendChild(uploadCard);
  root.appendChild(manageCard);
  root.appendChild(backActions);

  backBtn.addEventListener('click', () => onDone?.());

  let catalogs = [];

  function populateDropdown() {
    catalogDropdown.innerHTML = '';
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = '';
    catalogDropdown.appendChild(placeholder);

    catalogs.forEach((set) => {
      const opt = document.createElement('option');
      opt.value = set.id;
      opt.textContent = set.title || 'Unbenannter Katalog';
      catalogDropdown.appendChild(opt);
    });
  }

  async function loadCatalogs() {
    manageStatus.textContent = 'Lade Kataloge...';
    try {
      catalogs = await fetchQuestionSets();
      loadSets(catalogs);
      populateDropdown();
      manageStatus.textContent = catalogs.length ? '' : 'Keine Kataloge vorhanden.';
    } catch (err) {
      manageStatus.textContent = err.message || 'Fehler beim Laden der Kataloge.';
    }
  }

  function buildCatalogText(selectedSet) {
    if (!selectedSet?.title || !Array.isArray(selectedSet.questions)) {
      return null;
    }
    if (selectedSet.questions.length !== 54) {
      return null;
    }
    return [selectedSet.title, ...selectedSet.questions].join('\n');
  }

  function sanitizeFileName(title) {
    const safeTitle = title?.trim().replace(/[^a-zA-Z0-9-_ ]+/g, '') || 'katalog';
    return `${safeTitle || 'katalog'}.txt`;
  }

  function triggerDownload(text, fileName) {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function showConfirm(message) {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'modal-overlay';
      overlay.tabIndex = -1;

      const dialog = document.createElement('div');
      dialog.className = 'modal-dialog';
      dialog.role = 'dialog';
      dialog.ariaModal = 'true';
      dialog.tabIndex = -1;

      const content = document.createElement('div');
      content.className = 'modal-content';
      content.textContent = message;

      const actions = document.createElement('div');
      actions.className = 'modal-actions';

      const yesBtn = document.createElement('button');
      yesBtn.textContent = 'Ja';
      yesBtn.className = 'primary';

      const noBtn = document.createElement('button');
      noBtn.textContent = 'Nein';
      noBtn.className = 'ghost';

      actions.appendChild(yesBtn);
      actions.appendChild(noBtn);
      dialog.appendChild(content);
      dialog.appendChild(actions);
      overlay.appendChild(dialog);

      function close(result) {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        resolve(result);
      }

      yesBtn.addEventListener('click', () => close(true));
      noBtn.addEventListener('click', () => close(false));
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          close(false);
        }
      });
      overlay.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          close(false);
        }
      });

      document.body.appendChild(overlay);
      dialog.focus();
      noBtn.focus();
    });
  }

  downloadBtn.addEventListener('click', () => {
    const selectedId = catalogDropdown.value;
    if (!selectedId) {
      manageStatus.textContent = 'Wähle einen Katalog zum Herunterladen aus.';
      return;
    }
    const set = catalogs.find((c) => c.id === selectedId);
    const text = buildCatalogText(set);
    if (!text) {
      manageStatus.textContent = 'Der Katalog ist unvollständig und kann nicht exportiert werden.';
      return;
    }
    const fileName = sanitizeFileName(set.title);
    triggerDownload(text, fileName);
    manageStatus.textContent = 'Download gestartet.';
  });

  deleteBtn.addEventListener('click', async () => {
    const selectedId = catalogDropdown.value;
    if (!selectedId) {
      manageStatus.textContent = 'Wähle einen Katalog zum Löschen aus.';
      return;
    }
    const set = catalogs.find((c) => c.id === selectedId);
    if (!set) {
      manageStatus.textContent = 'Katalog konnte nicht gefunden werden.';
      return;
    }
    const confirmed = await showConfirm(`Willst du ${set.title} wirklich löschen?`);
    if (!confirmed) {
      return;
    }
    manageStatus.textContent = 'Katalog wird gelöscht...';
    try {
      await deleteQuestionSet(selectedId);
      await loadCatalogs();
      manageStatus.textContent = 'Katalog gelöscht.';
    } catch (err) {
      manageStatus.textContent = err.message || 'Löschen fehlgeschlagen.';
    }
  });

  loadCatalogs();
}
