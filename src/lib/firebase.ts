import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  onSnapshot,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with custom databaseId if configured
export const db = getFirestore(
  app,
  firebaseConfig.firestoreDatabaseId || '(default)'
);

export const AGENCY_DOC_ID = 'main_snapshot';
export const AGENCY_COLLECTION = 'agency_data';

// Connection test as required by Firebase integration
export async function testConnection(): Promise<boolean> {
  try {
    const testDocRef = doc(db, AGENCY_COLLECTION, 'connection_test');
    await getDocFromServer(testDocRef);
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client offline, checking connectivity.');
    }
    return false;
  }
}

// Fetch agency data once from Firestore
export async function getAgencyDataFromFirestore(): Promise<any | null> {
  try {
    const docRef = doc(db, AGENCY_COLLECTION, AGENCY_DOC_ID);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      return data?.data || null;
    }
    return null;
  } catch (err) {
    console.error('Erreur lecture Firestore:', err);
    return null;
  }
}

// Recursively sanitize objects to prevent Firestore "unsupported field value: undefined" errors
export function sanitizeForFirestore<T>(data: T): T {
  if (data === undefined || data === null) return null as unknown as T;
  return JSON.parse(
    JSON.stringify(data, (_, value) => (value === undefined ? null : value))
  );
}

// Save agency data to Firestore
export async function saveAgencyDataToFirestore(
  fullData: any,
  authorName: string = 'Utilisateur'
): Promise<boolean> {
  try {
    const docRef = doc(db, AGENCY_COLLECTION, AGENCY_DOC_ID);
    const sanitized = sanitizeForFirestore(fullData);
    await setDoc(
      docRef,
      {
        data: sanitized,
        updatedAt: new Date().toISOString(),
        updatedBy: authorName,
      },
      { merge: true }
    );
    return true;
  } catch (err) {
    console.error('Erreur écriture Firestore:', err);
    return false;
  }
}

// Real-time synchronization subscription
export function subscribeToAgencyData(
  onDataReceived: (data: any, metadata: { updatedAt: string; updatedBy: string }) => void,
  onError?: (err: any) => void
): () => void {
  const docRef = doc(db, AGENCY_COLLECTION, AGENCY_DOC_ID);
  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        const payload = snap.data();
        if (payload?.data) {
          onDataReceived(payload.data, {
            updatedAt: payload.updatedAt || new Date().toISOString(),
            updatedBy: payload.updatedBy || 'Inconnu',
          });
        }
      }
    },
    (error) => {
      console.warn('Erreur abonnement temps réel Firestore:', error);
      onError?.(error);
    }
  );
}
