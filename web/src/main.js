import { initApp } from './mainApp.js';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  if (!app) return;
  initApp(app);
});
