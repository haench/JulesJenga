import { fetchQuestionSets } from '../services/setsService.js';
import { loadSets, setActiveSet } from '../state/appState.js';

export async function renderHome(root, { onStart, onUpload }) {
  root.innerHTML = '';
  const title = document.createElement('h1');
  title.textContent = 'JulesJenga';

  const status = document.createElement('div');
  status.className = 'status';

  const dropdown = document.createElement('select');
  dropdown.ariaLabel = 'Question sets';

  const startBtn = document.createElement('button');
  startBtn.textContent = 'Start';
  startBtn.disabled = true;

  const uploadBtn = document.createElement('button');
  uploadBtn.textContent = 'Upload';

  async function load() {
    status.textContent = 'Loading...';
    try {
      const sets = await fetchQuestionSets();
      loadSets(sets);
      dropdown.innerHTML = '';
      sets.forEach((set) => {
        const opt = document.createElement('option');
        opt.value = set.id;
        opt.textContent = `${set.title} (${set.createdBy || 'unknown'})`;
        dropdown.appendChild(opt);
      });
      if (sets.length) {
        dropdown.value = sets[0].id;
        setActiveSet(sets[0].id);
        startBtn.disabled = false;
      } else {
        startBtn.disabled = true;
      }
      status.textContent = sets.length ? '' : 'No question sets yet.';
    } catch (err) {
      console.error(err);
      status.textContent = 'Error loading sets.';
      startBtn.disabled = true;
    }
  }

  dropdown.addEventListener('change', (e) => {
    setActiveSet(e.target.value);
  });

  startBtn.addEventListener('click', () => {
    onStart?.();
  });

  uploadBtn.addEventListener('click', () => {
    onUpload?.();
  });

  root.appendChild(title);
  root.appendChild(status);
  root.appendChild(dropdown);
  root.appendChild(startBtn);
  root.appendChild(uploadBtn);

  await load();
}
