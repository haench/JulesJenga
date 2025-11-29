import { initApp } from './mainApp.js';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  if (!app) return;
  try {
    console.log('[app] booting JulesJenga');
    initApp(app);
  } catch (err) {
    console.error('[app] failed to start', err);
    app.innerHTML = '<p style="color:red">App failed to load. Check console for details.</p>';
  }
});
