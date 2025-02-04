import * as adminDb from 'firebase-admin/database';
import { connectDatabaseEmulator, getDatabase } from 'firebase/database';
import { adminApp, app } from '../helper';

export const database = getDatabase(app);

const [host, port] = process.env.FIREBASE_DATABASE_EMULATOR_HOST?.split(':') ?? [
  '127.0.0.1',
  '9000',
];
connectDatabaseEmulator(database, host, parseInt(port));

export const admin = adminDb.getDatabase(adminApp);
