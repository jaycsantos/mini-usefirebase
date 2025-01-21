import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { adminApp, app } from '../helper';

export const auth = getAuth(app);

console.log(process.env.FIREBASE_AUTH_EMULATOR_HOST);
connectAuthEmulator(
  auth,
  'http://' + (process.env.FIREBASE_AUTH_EMULATOR_HOST ?? '127.0.0.1:9099')
);

export const admin = getAdminAuth(adminApp);
