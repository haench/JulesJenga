import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import { db, auth } from '../firebase.js';

const COLLECTION = 'questionSets';

export async function fetchQuestionSets() {
  const colRef = collection(db, COLLECTION);
  const q = query(colRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function createQuestionSet({ title, questions }) {
  const user = auth.currentUser;
  if (!user) throw new Error('auth required to upload');
  const docRef = await addDoc(collection(db, COLLECTION), {
    title,
    questions,
    createdAt: serverTimestamp(),
    createdBy: user.uid,
  });
  return docRef.id;
}
