import { getDb, getAuthInstance, getFirestoreFns } from '../firebase.js';

const COLLECTION = 'questionSets';

export async function fetchQuestionSets() {
  const db = await getDb();
  const { collection, query, orderBy, getDocs } = await getFirestoreFns();
  const colRef = collection(db, COLLECTION);
  const q = query(colRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function createQuestionSet({ title, questions }) {
  const auth = await getAuthInstance();
  const { collection, addDoc, serverTimestamp } = await getFirestoreFns();
  const db = await getDb();
  const user = auth.currentUser;
  if (!user) throw new Error('Authentifizierung für den Upload erforderlich');
  const docRef = await addDoc(collection(db, COLLECTION), {
    title,
    questions,
    createdAt: serverTimestamp(),
    createdBy: user.uid,
  });
  return docRef.id;
}
