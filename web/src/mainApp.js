import { renderHome } from './ui/home.js';
import { renderGrid } from './ui/grid.js';
import { renderUpload } from './ui/upload.js';
import { createModal } from './ui/modal.js';
import { getStateSnapshot, setActiveSet } from './state/appState.js';
import { listenForAuthChanges } from './auth.js';

export function initApp(rootEl) {
  const modal = createModal();
  const layout = createLayout(rootEl);
  let currentUser = null;

  const views = {
    home: () =>
      renderHome(layout.main, {
        onStart: showGrid,
        onUpload: showUpload,
        user: currentUser,
      }),
    grid: () => showGrid(),
    upload: () => renderUpload(layout.main, { onDone: showHome }),
  };

  function clearMain() {
    layout.main.innerHTML = '';
  }

  async function showHome() {
    clearMain();
    await views.home();
  }

  function showUpload() {
    clearMain();
    views.upload();
  }

  function showGrid() {
    clearMain();
    renderGrid(layout.main, (_tile, question) => {
      modal.open(question);
    });
    const back = document.createElement('button');
    back.textContent = 'Zurück zur Startseite';
    back.className = 'ghost';
    back.addEventListener('click', showHome);
    layout.main.appendChild(back);
  }

  setActiveSet(null);
  listenForAuthChanges((user) => {
    currentUser = user;
    console.log('[auth] state changed', user ? user.uid : 'signed out');
    showHome();
  }).catch((err) => {
    console.error('[auth] listener failed', err);
  });
  showHome();
}

function createLayout(root) {
  root.innerHTML = '';
  const shell = document.createElement('div');
  shell.className = 'layout';

  const main = document.createElement('main');
  main.className = 'content';

  shell.appendChild(main);
  root.appendChild(shell);
  return { main };
}
