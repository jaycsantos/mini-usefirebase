import { WithFirebaseApp } from '@/types';
import { Firestore, type FirestoreSettings, getFirestore, initializeFirestore } from '@firebase/firestore';
import { useCallback, useRef } from 'react';
import { useFirebase } from '../useFirebase';
import { WithFirestore } from './types';

/**
 * Configuration options for the Firestore hook
 * @interface FirestoreOptions
 * @group Firestore
 * @category Interfaces
 */
export type FirestoreOptions = Partial<WithFirebaseApp> &
  Partial<WithFirestore> & {
    /** Firestore settings */
    settings?: FirestoreSettings;
    /** database name for multi-database setup */
    databaseName?: string;
  };

/**
 * React hook to initialize and access Firebase Firestore
 *
 * @group Firestore
 * @category Hooks
 *
 * @param {FirestoreOptions} [options] - Configuration options for Firestore
 * @returns {Firestore} A function that returns the {@link https://firebase.google.com/docs/reference/js/firebase.firestore | Firestore} database
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { db } = useFirestore();
 *   // or with custom options
 *   const { db } = useFirestore({
 *     settings: { cacheSizeBytes: 1048576 },
 *     databaseName: 'my-database'
 *   });
 *
 *   return <div>My Component</div>;
 * }
 * ```
 *
 * @remarks
 * - If no app is provided, it will use the default Firebase app from useFirebase hook
 * - Custom settings will trigger initialization with initializeFirestore
 * - Without custom settings, it will use getFirestore with default configuration
 */
export function useFirestore(options?: FirestoreOptions): () => Firestore {
  const getApp = useFirebase();
  const ref = useRef<Firestore>(null);

  const getDb = useCallback(() => {
    if (options?.db) return options.db;

    const app = options?.app ?? getApp();
    if (ref.current == null && options?.settings) {
      ref.current = initializeFirestore(app, options.settings, options.databaseName);
    } else if (ref.current?.app != app) {
      ref.current = getFirestore(app);
    }
    return ref.current;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getApp, options?.app, options?.db]);

  return getDb;
}
