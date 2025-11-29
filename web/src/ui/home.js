import { fetchQuestionSets } from '../services/setsService.js';
import { loadSets, setActiveSet } from '../state/appState.js';
import { signInWithGoogle } from '../auth.js';

export async function renderHome(root, { onStart, onUpload, user }) {
  root.innerHTML = '';

  const greetingCard = document.createElement('section');
  greetingCard.className = 'card';
  const greet = document.createElement('p');
  greet.className = 'muted';
  const name = user?.displayName || user?.email || 'Player';
  greet.textContent = `Hi ${name}, pick a set to start playing.`;
  greetingCard.appendChild(greet);

  const controlCard = document.createElement('section');
  controlCard.className = 'card';

  const status = document.createElement('div');
  status.className = 'status';

  const label = document.createElement('label');
  label.textContent = 'Question sets';
  label.htmlFor = 'question-set';

  const dropdown = document.createElement('select');
  dropdown.id = 'question-set';
  dropdown.ariaLabel = 'Question sets';

  const actions = document.createElement('div');
  actions.className = 'actions';

  const signInBtn = document.createElement('button');
  signInBtn.textContent = 'Sign in with Google';
  signInBtn.className = 'primary';

  const startBtn = document.createElement('button');
  startBtn.textContent = 'Start';
  startBtn.className = 'primary';
  startBtn.disabled = true;

  const uploadBtn = document.createElement('button');
  uploadBtn.textContent = 'Upload';
  uploadBtn.className = 'secondary';

  const helper = document.createElement('p');
  helper.className = 'muted';
  helper.textContent = 'Each set has 54 questions; uploading requires a 55-line text file (title + 54 questions).';

  async function load() {
    status.textContent = user ? 'Loading...' : 'Sign in to load sets.';
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
        const creator = set.createdByName?.trim();
        opt.textContent = creator ? `${set.title} (${creator})` : set.title;
        dropdown.appendChild(opt);
      });
      if (sets.length) {
        dropdown.value = sets[0].id;
        setActiveSet(sets[0].id);
        startBtn.disabled = false;
        status.textContent = '';
      } else {
        startBtn.disabled = true;
        status.textContent = 'No question sets yet. Upload one to get started.';
      }
    } catch (err) {
      console.error(err);
      status.textContent = 'Error loading sets.';
      startBtn.disabled = true;
    }
  }

  dropdown.addEventListener('change', (e) => {
    setActiveSet(e.target.value);
    startBtn.disabled = !e.target.value;
  });

  signInBtn.addEventListener('click', async () => {
    status.textContent = 'Opening sign-in...';
    try {
      await signInWithGoogle();
      status.textContent = 'Signed in. Loading sets...';
      await load();
    } catch (err) {
      console.error(err);
      status.textContent = 'Sign-in failed.';
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
