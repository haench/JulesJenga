import { auth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from './firebase.js';

let cachedUser = null;

export function getCurrentUser() {
  return cachedUser || auth.currentUser;
}

export function listenForAuthChanges(callback) {
  return onAuthStateChanged(auth, (user) => {
    cachedUser = user;
    callback?.(user);
  });
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  cachedUser = result.user;
  return cachedUser;
}
