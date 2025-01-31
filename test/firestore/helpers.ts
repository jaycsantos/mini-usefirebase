import * as firestoreAdmin from 'firebase-admin/firestore';
import { initializeFirestore as initializeAdminFirestore } from 'firebase-admin/firestore';
import {
  connectFirestoreEmulator,
  initializeFirestore,
  memoryLocalCache,
} from 'firebase/firestore';
import { adminApp, app } from '../helper';

export const firestore = initializeFirestore(app, { localCache: memoryLocalCache() });

const [host, port] = process.env.FIRESTORE_EMULATOR_HOST?.split(':') ?? ['localhost', '8080'];
connectFirestoreEmulator(firestore, host, parseInt(port));

const adminFirestore = initializeAdminFirestore(adminApp);

export const admin = {
  app: adminApp,
  firestore: adminFirestore,
  ...firestoreAdmin,
  async deleteCollection(collectionName: string): Promise<void> {
    const collRef = adminFirestore.collection(collectionName);
    const batch = adminFirestore.batch();
    const snap = await collRef.get();
    for (const { ref } of snap.docs) {
      batch.delete(ref);
    }
    await batch.commit();
  },
};
