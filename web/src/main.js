import { initApp } from './mainApp.js';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  if (!app) return;
  app.innerHTML = '<h1>JulesJenga</h1><p>Scaffold ready.</p>';
  initApp(app);
});
