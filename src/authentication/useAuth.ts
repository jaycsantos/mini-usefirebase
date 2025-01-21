import { Prettify, WithFirebaseApp } from '@/common/types';
import { useFirebase } from '@/useFirebase';
import { Auth, getAuth } from 'firebase/auth';
import { useCallback } from 'react';

/**
 * A hook that provides access to Firebase Authentication.
 *
 * @param options - Optional configuration object that can include a Firebase App instance
 * @returns A function that returns the Firebase Auth instance
 *
 * @example
 * ```typescript
 * const getAuth = useAuth();
 * const auth = getAuth();
 * ```
 *
 * With custom Firebase app
 * ```typescript
 * const customApp = initializeApp({ ... });
 * const getAuth = useAuth({ app: customApp });
 * const auth = getAuth();
 * ```
 *
 * @see
 * - {@link useAuthCallback}
 * - {@link useAuthUserCallback}
 *
 * @group Authentication
 * @category Hooks
 */
export function useAuth(options?: Prettify<Partial<WithFirebaseApp>>): () => Auth {
  const getApp = useFirebase();
  const app = options?.app ?? getApp();

  return useCallback(() => getAuth(app), [app]);
}

/**
 * const auth = initializeAuth(app, {
  persistence: browserSessionPersistence,
  popupRedirectResolver: undefined,
});
 */
