import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';
import { app } from '../helper';

export const functions = getFunctions(app);

export const [host, port] = process.env.FIREBASE_FUNCTIONS_EMULATOR_HOST?.split(':') ?? [
  '127.0.0.1',
  '5001',
];
connectFunctionsEmulator(functions, host, parseInt(port));
