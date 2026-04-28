import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../firebase';

const getUid = () => auth?.currentUser?.uid || 'demo-user';

export const saveAuditResult = async (audit) => {
  if (!isFirebaseConfigured || !db) {
    return null;
  }

  return addDoc(collection(db, 'audits'), {
    uid: getUid(),
    ...audit,
    createdAt: serverTimestamp(),
  });
};

export const saveFairnessReport = async (report) => {
  if (!isFirebaseConfigured || !db) {
    return null;
  }

  return addDoc(collection(db, 'reports'), {
    uid: getUid(),
    ...report,
    createdAt: serverTimestamp(),
  });
};
