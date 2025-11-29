import { fetchQuestionSets } from '../services/setsService.js';
import { loadSets, setActiveSet } from '../state/appState.js';
import { signInWithGoogle } from '../auth.js';

export async function renderHome(root, { onStart, onUpload, user }) {
  root.innerHTML = '';

  const greetingCard = document.createElement('section');
  greetingCard.className = 'card';
  const greet = document.createElement('p');
  greet.className = 'muted';
  const name = user?.displayName || user?.email || 'Spieler';
  greet.textContent = `Hallo ${name}, wähle ein Set, um zu spielen.`;
  greetingCard.appendChild(greet);

  const controlCard = document.createElement('section');
  controlCard.className = 'card';

  const status = document.createElement('div');
  status.className = 'status';

  const label = document.createElement('label');
  label.textContent = 'Fragensets';
  label.htmlFor = 'question-set';

  const dropdown = document.createElement('select');
  dropdown.id = 'question-set';
  dropdown.ariaLabel = 'Fragensets';

  const actions = document.createElement('div');
  actions.className = 'actions';

  const signInBtn = document.createElement('button');
  signInBtn.textContent = 'Mit Google anmelden';
  signInBtn.className = 'primary';

  const startBtn = document.createElement('button');
  startBtn.textContent = 'Starten';
  startBtn.className = 'primary';
  startBtn.disabled = true;

  const uploadBtn = document.createElement('button');
  uploadBtn.textContent = 'Upload';
  uploadBtn.className = 'secondary';

  const helper = document.createElement('p');
  helper.className = 'muted';
  helper.textContent = 'Jedes Set hat 54 Fragen; für den Upload wird eine Textdatei mit 55 Zeilen benötigt (Titel + 54 Fragen).';

  async function load() {
    status.textContent = user ? 'Lade ...' : 'Melde dich an, um Sets zu laden.';
    if (!user) {
      startBtn.disabled = true;
      dropdown.disabled = true;
      return;
    }
    try {
      const sets = await fetchQuestionSets();
      loadSets(sets);
      dropdown.innerHTML = '';
      sets.forEach((set) => {
        const opt = document.createElement('option');
        opt.value = set.id;
        const creatorName = set.createdByName?.trim();
        opt.textContent = creatorName ? `${set.title} (${creatorName})` : set.title;
        dropdown.appendChild(opt);
      });
      if (sets.length) {
        dropdown.value = sets[0].id;
        setActiveSet(sets[0].id);
        startBtn.disabled = false;
        status.textContent = '';
      } else {
        startBtn.disabled = true;
        status.textContent = 'Noch keine Fragensets vorhanden. Lade eines per Upload hoch, um loszulegen.';
      }
    } catch (err) {
      console.error(err);
      status.textContent = 'Fehler beim Laden der Sets.';
      startBtn.disabled = true;
    }
  }

  dropdown.addEventListener('change', (e) => {
    setActiveSet(e.target.value);
    startBtn.disabled = !e.target.value;
  });

  signInBtn.addEventListener('click', async () => {
    status.textContent = 'Anmeldefenster wird geöffnet...';
    try {
      await signInWithGoogle();
      status.textContent = 'Angemeldet. Lade Sets...';
      await load();
    } catch (err) {
      console.error(err);
      status.textContent = 'Anmeldung fehlgeschlagen.';
    }
  });

  startBtn.addEventListener('click', () => onStart?.());
  uploadBtn.addEventListener('click', () => onUpload?.());

  actions.appendChild(startBtn);
  actions.appendChild(uploadBtn);
  if (!user) {
    actions.prepend(signInBtn);
    dropdown.disabled = true;
  }

  controlCard.appendChild(label);
  controlCard.appendChild(dropdown);
  controlCard.appendChild(actions);
  controlCard.appendChild(helper);
  controlCard.appendChild(status);

  root.appendChild(greetingCard);
  root.appendChild(controlCard);

  await load();
}
