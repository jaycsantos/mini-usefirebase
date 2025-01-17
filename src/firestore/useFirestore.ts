import { WithFirebaseApp } from '@/types';
import { Firestore, getFirestore } from '@firebase/firestore';
import { useCallback, useRef } from 'react';
import { useFirebase } from '../useFirebase';

/**
 * React hook to initialize and access Firebase Firestore
 *
 * @param {FirestoreOptions} [options] - Hook options, can pass app or db instance
 * @returns A function that returns the {@link https://firebase.google.com/docs/reference/js/firebase.firestore | Firestore} database
 *
 * @example
 * ```tsx
 * const getDb = useFirestore();
 * const db = getDb();
 * ```
 *
 * @remarks
 * - useFirebase hook is used if options is not provided
 *
 * @group Firestore
 * @category Hooks
 */
export function useFirestore(options?: Partial<WithFirebaseApp>): () => Firestore {
  const getApp = useFirebase();
  const ref = useRef<Firestore>(null);

  const getDb = useCallback(() => {
    const app = options?.app ?? getApp();
    if (ref.current == null || ref.current?.app != app) {
      ref.current = getFirestore(app);
    }
    return ref.current;
  }, [getApp, options?.app]);

  return getDb;
}
