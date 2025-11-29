import { renderHome } from './ui/home.js';
import { renderGrid } from './ui/grid.js';
import { renderUpload } from './ui/upload.js';
import { createModal } from './ui/modal.js';
import { getStateSnapshot, setActiveSet } from './state/appState.js';

export function initApp(rootEl) {
  const modal = createModal();

  const views = {
    home: () => renderHome(rootEl, { onStart: showGrid, onUpload: showUpload }),
    grid: () => showGrid(),
    upload: () => renderUpload(rootEl, { onDone: showHome }),
  };

  function clearRoot() {
    rootEl.innerHTML = '';
  }

  async function showHome() {
    clearRoot();
    await views.home();
  }

  function showUpload() {
    clearRoot();
    views.upload();
  }

  function showGrid() {
    clearRoot();
    const stateSnap = getStateSnapshot();
    const header = document.createElement('div');
    header.className = 'grid-header';
    const back = document.createElement('button');
    back.textContent = 'Back';
    back.addEventListener('click', showHome);
    header.appendChild(back);
    rootEl.appendChild(header);
    renderGrid(rootEl, (_tile, question) => {
      modal.open(question);
    });
  }

  // Initial render
  setActiveSet(null);
  showHome();
}
