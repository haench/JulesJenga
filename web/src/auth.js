import { getAuthInstance, getAuthFns } from './firebase.js';

let cachedUser = null;

export function getCurrentUser() {
  return cachedUser || null;
}

export function listenForAuthChanges(callback) {
  return (async () => {
    const auth = await getAuthInstance();
    const { onAuthStateChanged } = await getAuthFns();
    return onAuthStateChanged(auth, (user) => {
      cachedUser = user;
      callback?.(user);
    });
  })();
}

export async function signInWithGoogle() {
  const auth = await getAuthInstance();
  const { GoogleAuthProvider, signInWithPopup } = await getAuthFns();
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  cachedUser = result.user;
  return cachedUser;
}
