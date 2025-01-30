import { useFirebase } from '@/useFirebase';
import { Firestore, getFirestore } from 'firebase/firestore';
import { WithFirestore } from './types';

/**
 * React hook to initialize and access Firebase Firestore
 *
 * @param options - Optional configuration object
 * @param options.app - Optional Firebase App instance or app name. If not provided, uses the default Firebase App
 *
 * @returns The {@link https://firebase.google.com/docs/reference/js/firebase.firestore | Firestore} database instance
 *
 * @example
 * ```tsx
 * const getDb = useFirestore();
 * const db = getDb();
 * ```
 *
 * @remarks uses useFirebase hook to resolve the firebase app instance
 *
 * @group Firestore
 * @category Hooks
 */
export function useFirestore(options?: WithFirestore): Firestore {
  const app = useFirebase(Object.assign({ app: options?.db?.app }, options ?? {}));
  // meh, getFirestore does not have overload that support both `FirebaseApp|undefined`
  return options?.db ?? (app ? getFirestore(app) : getFirestore());
}
