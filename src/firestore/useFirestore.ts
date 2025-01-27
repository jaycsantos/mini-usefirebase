import { Prettify, WithFirebaseApp } from '@/common/types';
import { useFirebase } from '@/useFirebase';
import { Firestore, getFirestore } from 'firebase/firestore';

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
export function useFirestore(options?: Prettify<Partial<WithFirebaseApp>>): Firestore {
  const app = useFirebase(options);
  // meh, getFirestore does not have overload that support both `FirebaseApp|undefined`
  return app ? getFirestore(app) : getFirestore();
}
