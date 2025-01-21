import * as firestoreAdmin from 'firebase-admin/firestore';
import { initializeFirestore as initializeAdminFirestore } from 'firebase-admin/firestore';
import {
  connectFirestoreEmulator,
  initializeFirestore,
  memoryLocalCache,
} from 'firebase/firestore';
import { adminApp, app } from '../helper';

export const db = initializeFirestore(app, { localCache: memoryLocalCache() });

const [host, port] = process.env.FIRESTORE_EMULATOR_HOST?.split(':') ?? ['localhost', '8080'];
connectFirestoreEmulator(db, host, parseInt(port));

const adminDb = initializeAdminFirestore(adminApp);

export const admin = {
  app: adminApp,
  db: adminDb,
  ...firestoreAdmin,
  async deleteCollection(collectionName: string): Promise<void> {
    const collRef = adminDb.collection(collectionName);
    const batch = adminDb.batch();
    const snap = await collRef.get();
    for (const { ref } of snap.docs) {
      batch.delete(ref);
    }
    await batch.commit();
  },
};
