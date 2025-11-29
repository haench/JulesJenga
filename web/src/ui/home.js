import { fetchQuestionSets } from '../services/setsService.js';
import { loadSets, setActiveSet } from '../state/appState.js';
import { signInWithGoogle } from '../auth.js';

export async function renderHome(root, { onStart, onUpload, user }) {
  root.innerHTML = '';

  const logo = document.createElement('img');
  logo.src = './assets/julesjenga_logo.svg';
  logo.alt = 'JulesJenga Logo';
  logo.className = 'home-logo';
  root.appendChild(logo);

  const homeCard = document.createElement('section');
  homeCard.className = 'card home-card';
  const greet = document.createElement('p');
  greet.className = 'muted';
  const name = user?.displayName?.split(' ')[0] || user?.email || 'Spieler';
  greet.textContent = `Hallo ${name}, wähle einen Fragenkatalog, um Jenga zu spielen.`;
  homeCard.appendChild(greet);

  const status = document.createElement('div');
  status.className = 'status';

  const dropdown = document.createElement('select');
  dropdown.id = 'question-set';
  dropdown.ariaLabel = 'Fragenset auswählen';

  const controlStack = document.createElement('div');
  controlStack.className = 'control-stack';

  const controlsArea = document.createElement('div');
  controlsArea.className = 'control-card home-controls';

  const signInBtn = document.createElement('button');
  signInBtn.textContent = 'Mit Google anmelden';
  signInBtn.className = 'primary';

  const startBtn = document.createElement('button');
  startBtn.textContent = 'Starten';
  startBtn.className = 'primary';
  startBtn.disabled = true;

  const uploadBtn = document.createElement('button');
  uploadBtn.textContent = 'Katalog hochladen';
  uploadBtn.className = 'secondary upload-spacer';

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

  controlStack.appendChild(dropdown);
  controlStack.appendChild(startBtn);
  controlStack.appendChild(uploadBtn);

  if (!user) {
    controlStack.prepend(signInBtn);
    dropdown.disabled = true;
  }

  controlsArea.appendChild(controlStack);
  controlsArea.appendChild(status);

  homeCard.appendChild(controlsArea);

  root.appendChild(homeCard);

  await load();
}
