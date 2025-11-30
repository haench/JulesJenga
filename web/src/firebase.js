let initialized = false;
let appMod;
let firestoreMod;
let authMod;
let app;
let db;
let auth;

const hasProcess = typeof process !== 'undefined' && !!process.env;
const isVitest = hasProcess && !!process.env.VITEST;
const isBrowser = typeof window !== 'undefined' && window.document && !isVitest;

async function ensureFirebase() {
  if (initialized) return;
  if (isBrowser) {
    appMod = await import('https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js');
    firestoreMod = await import('https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js');
    authMod = await import('https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js');
  } else {
    appMod = await import('firebase/app');
    firestoreMod = await import('firebase/firestore');
    authMod = await import('firebase/auth');
  }

  const { initializeApp, getApps } = appMod;

  const defaultConfig = (() => {
    if (isBrowser && window.FIREBASE_CONFIG) return window.FIREBASE_CONFIG;
    if (hasProcess) {
      return {
        apiKey: process.env.FIREBASE_API_KEY || 'TODO_API_KEY',
        authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'TODO_PROJECT_ID.firebaseapp.com',
        projectId: process.env.FIREBASE_PROJECT_ID || 'TODO_PROJECT_ID',
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'TODO_PROJECT_ID.appspot.com',
        messagingSenderId: process.env.FIREBASE_SENDER_ID || 'TODO_SENDER_ID',
        appId: process.env.FIREBASE_APP_ID || 'TODO_APP_ID',
      };
    }
    return {
      apiKey: 'TODO_API_KEY',
      authDomain: 'TODO_PROJECT_ID.firebaseapp.com',
      projectId: 'TODO_PROJECT_ID',
      storageBucket: 'TODO_PROJECT_ID.appspot.com',
      messagingSenderId: 'TODO_SENDER_ID',
      appId: 'TODO_APP_ID',
    };
  })();

  const firebaseConfig = defaultConfig;
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  db = firestoreMod.getFirestore(app);
  auth = authMod.getAuth(app);
  initialized = true;
}

export async function getFirebaseApp() {
  await ensureFirebase();
  return app;
}

export async function getDb() {
  await ensureFirebase();
  return db;
}

export async function getAuthInstance() {
  await ensureFirebase();
  return auth;
}

export async function getFirestoreFns() {
  await ensureFirebase();
  const { collection, getDocs, addDoc, serverTimestamp, query, orderBy, doc, deleteDoc } = firestoreMod;
  return { collection, getDocs, addDoc, serverTimestamp, query, orderBy, doc, deleteDoc };
}

export async function getAuthFns() {
  await ensureFirebase();
  const { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } = authMod;
  return { GoogleAuthProvider, signInWithPopup, onAuthStateChanged };
}
