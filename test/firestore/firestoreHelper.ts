import { vi } from 'vitest';
import { initializeApp } from 'firebase/app';
import { connectFirestoreEmulator, initializeFirestore, memoryLocalCache } from 'firebase/firestore';
import { initializeApp as initializeAdminApp } from 'firebase-admin/app';
import { initializeFirestore as initializeAdminFirestore } from 'firebase-admin/firestore';
import * as firestoreAdmin from 'firebase-admin/firestore';

const projectId = 'usefirebase-dbe87';

export const app = initializeApp({ projectId: projectId });
export const db = initializeFirestore(app, { localCache: memoryLocalCache() });

connectFirestoreEmulator(db, 'localhost', 8080);

vi.stubEnv('FIREBASE_AUTH_EMULATOR_HOST', '127.0.0.1:9099');
vi.stubEnv('FIRESTORE_EMULATOR_HOST', '127.0.0.1:8080');
vi.stubEnv('FIREBASE_DATABASE_EMULATOR_HOST', '127.0.0.1:9000');
vi.stubEnv('FIREBASE_STORAGE_EMULATOR_HOST', '127.0.0.1:9199');

const adminApp = initializeAdminApp({ projectId: projectId });
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
