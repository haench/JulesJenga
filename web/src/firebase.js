import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const defaultConfig = {
  apiKey: process.env.FIREBASE_API_KEY || 'TODO_API_KEY',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'TODO_PROJECT_ID.firebaseapp.com',
  projectId: process.env.FIREBASE_PROJECT_ID || 'TODO_PROJECT_ID',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'TODO_PROJECT_ID.appspot.com',
  messagingSenderId: process.env.FIREBASE_SENDER_ID || 'TODO_SENDER_ID',
  appId: process.env.FIREBASE_APP_ID || 'TODO_APP_ID',
};

function resolveConfig() {
  if (typeof window !== 'undefined' && window.FIREBASE_CONFIG) {
    return window.FIREBASE_CONFIG;
  }
  return defaultConfig;
}

const firebaseConfig = resolveConfig();
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export { app };
