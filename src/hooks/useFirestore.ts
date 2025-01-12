import { FirebaseAppData, useFirebase } from './useFirebase';
import { useMemo } from 'react';
import {
  type FirestoreSettings,
  Firestore,
  getFirestore,
  initializeFirestore,
} from '@firebase/firestore';
/**
 * Configuration options for the Firestore hook
 * @interface FirestoreOptions
 * @property {FirebaseApp} [app] - Optional Firebase app instance
 * @property {FirestoreSettings} [settings] - Optional Firestore settings
 * @property {string} [databaseName] - Optional database name for multi-database setup
 */
export interface FirestoreOptions extends Partial<FirebaseAppData> {
  settings?: FirestoreSettings;
  databaseName?: string;
}

/**
 * Return type for the useFirestore hook
 * @interface FirestoreData
 * @property {Firestore} db - The Firestore database instance
 */
export interface FirestoreHook {
  db: Firestore;
}

/**
 * React hook to initialize and access Firebase Firestore
 *
 * @param {FirestoreOptions} [options] - Configuration options for Firestore
 * @returns {FirestoreHook} Object containing the Firestore database instance
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
export function useFirestore(options?: FirestoreOptions): FirestoreHook {
  const app = options?.app ?? useFirebase().app!;
  const db = useMemo(() => {
    if (options?.settings) {
      return initializeFirestore(app, options.settings, options.databaseName);
    }
    return getFirestore(app);
  }, [app]);
  return { db };
}
