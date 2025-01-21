import { vi } from 'vitest';
import { initializeApp } from 'firebase/app';
import { initializeApp as initializeAdminApp } from 'firebase-admin/app';
import { firebaseConfig } from './firebase';

export const app = initializeApp(firebaseConfig);

if (!process.env.FIREBASE_AUTH_EMULATOR_HOST)
  vi.stubEnv('FIREBASE_AUTH_EMULATOR_HOST', 'http://127.0.0.1:9099');
if (!process.env.FIRESTORE_EMULATOR_HOST) vi.stubEnv('FIRESTORE_EMULATOR_HOST', '127.0.0.1:8080');
if (!process.env.FIREBASE_DATABASE_EMULATOR_HOST)
  vi.stubEnv('FIREBASE_DATABASE_EMULATOR_HOST', '127.0.0.1:9000');
if (!process.env.FIREBASE_STORAGE_EMULATOR_HOST)
  vi.stubEnv('FIREBASE_STORAGE_EMULATOR_HOST', '127.0.0.1:9199');

export const adminApp = initializeAdminApp(firebaseConfig);

export async function delay(time: number) {
  await new Promise((resolve) => setTimeout(resolve, time));
}
