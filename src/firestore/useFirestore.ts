import { Prettify, WithFirebaseApp } from '@/common/types';
import { useFirebase } from '@/useFirebase';
import { Firestore, getFirestore } from 'firebase/firestore';
import { useCallback } from 'react';

/**
 * React hook to initialize and access Firebase Firestore
 *
 * @param [options] - Hook options, can pass app or db instance
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
export function useFirestore(options?: Prettify<Partial<WithFirebaseApp>>): () => Firestore {
  const getApp = useFirebase();
  const app = options?.app ?? getApp();
  return useCallback(() => (app ? getFirestore(app) : getFirestore()), [app]);
}
