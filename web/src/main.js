import { initApp } from './mainApp.js';

function isRunningStandalone() {
  const displayModeStandalone = window.matchMedia?.('(display-mode: standalone)').matches;
  const iosStandalone = window.navigator.standalone === true;
  const androidWebApkReferrer = document.referrer?.startsWith('android-app://');
  return Boolean(displayModeStandalone || iosStandalone || androidWebApkReferrer);
}

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  if (!app) return;
  const runningStandalone = isRunningStandalone();
  try {
    console.log(`[app] booting JulesJenga (mode=${runningStandalone ? 'standalone' : 'browser'})`);
    initApp(app, { showInstallTip: !runningStandalone });
  } catch (err) {
    console.error('[app] failed to start', err);
    app.innerHTML = '<p style="color:red">App konnte nicht geladen werden. Siehe Konsole für Details.</p>';
  }
});
