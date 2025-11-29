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

  function setViewTitle(title) {
    layout.title.textContent = title;
  }

  function clearMain() {
    layout.main.innerHTML = '';
  }

  async function showHome() {
    setViewTitle('Startseite');
    clearMain();
    await views.home();
  }

  function showUpload() {
    setViewTitle('Upload Fragen');
    clearMain();
    views.upload();
  }

  function showGrid() {
    setViewTitle('Spielen');
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
    layout.userInfo.textContent = user
      ? `Angemeldet als ${user.displayName || user.email || user.uid}`
      : 'Abgemeldet – zum Laden der Sets anmelden';
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

  const header = document.createElement('header');
  header.className = 'topbar';
  const title = document.createElement('div');
  title.className = 'view-title';
  title.textContent = 'JulesJenga';
  const userInfo = document.createElement('div');
  userInfo.className = 'muted';
  userInfo.textContent = 'Anmeldung erforderlich, um Sets zu laden';
  header.appendChild(title);
  header.appendChild(userInfo);

  const main = document.createElement('main');
  main.className = 'content';

  shell.appendChild(header);
  shell.appendChild(main);
  root.appendChild(shell);
  return { title, main, userInfo };
}
