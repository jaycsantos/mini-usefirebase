import { FirebaseFirestore } from '@firebase/firestore-types';
import { createContext, useContext } from 'react';
import { FirebaseApp as FirebaseAppCompat } from '@firebase/app-compat';

export interface FirebaseAppContextType {
  app: FirebaseAppCompat;
  db?: FirebaseFirestore;
}

/**
 * Return type for the useFirestore hook
 * @interface FirebaseAppData
 * @property {FirebaseApp} app - The Firebase application instance
 */
export interface FirebaseAppData {
  app: FirebaseAppCompat;
}

export const FirebaseAppContext = createContext<FirebaseAppData | null>(null);

/**
 * A custom hook that provides access to the Firebase application context.
 * This hook must be used within a component that is wrapped by a FirebaseProvider.
 *
 * @returns {FirebaseAppData} An object containing the Firebase application instance.
 * @throws {Error} If used outside of a FirebaseProvider context.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { app } = useFirebase();
 *   // Use Firebase app instance
 * }
 * ```
 */
export function useFirebase(): FirebaseAppData {
  const appData = useContext(FirebaseAppContext);
  if (!appData) {
    throw new Error('useFirebaseApp must be used within a FirebaseProvider');
  }
  return appData;
}
