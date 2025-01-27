import { Prettify, WithFirebaseApp } from '@/common/types';
import { useFirebase } from '@/useFirebase';
import { Auth, getAuth } from 'firebase/auth';

/**
 * A hook that provides access to Firebase Authentication.
 *
 * @param options - Optional configuration object that can include a Firebase App instance
 * @param options.app - Optional Firebase App instance or app name. If not provided, uses the default Firebase App
 * @returns A function that returns the Firebase Auth instance
 *
 * @example
 *
 * ```typescript
 * const auth = useAuth();
 * console.log(auth.currentUser);
 * ```
 *
 * With custom Firebase app
 * ```typescript
 * const app = initializeApp({ ... });
 * const auth = useAuth({ app });
 * console.log(auth.currentUser);
 * ```
 *
 * @remarks uses useFirebase hook to resolve the firebase app instance
 *
 * @see
 * - {@link useAuthCallback}
 * - {@link useAuthUserCallback}
 *
 * @group Authentication
 * @category Hooks
 */
export function useAuth(options?: Prettify<Partial<WithFirebaseApp>>): Auth {
  const app = useFirebase(options);
  return getAuth(app);
}

/**
 * const auth = initializeAuth(app, {
  persistence: browserSessionPersistence,
  popupRedirectResolver: undefined,
});
 */
