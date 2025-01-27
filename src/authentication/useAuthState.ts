import { Prettify } from '@/common/types';
import useAsyncState from '@/common/useAsyncState';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useEffect } from 'react';
import { AsyncUser, AuthOptions } from './types';
import { useAuth } from './useAuth';

/**
 * A hook that provides the current authenticated user state.
 *
 * This hook listens to Firebase authentication state changes and returns the current user,
 * loading state, and any authentication errors that occur.
 *
 * @param options - auth options
 * @param options.onChange - callback when the auth state changes
 *
 * @returns An object containing:
 * - user: The current User object or null if not authenticated
 * - isLoading: Boolean indicating if the authentication state is being determined
 * - error: Any error that occurred during authentication
 *
 * @example
 * ```typescript
 * const { user, isLoading, error } = useAuthUser({
 *   onChange: async (user) => {
 *     console.log('Auth state changed:', user);
 *   }
 * });
 * ```
 *
 * @see
 * - {@link useAuthCallback}
 *
 * @group Authentication
 * @category Hooks
 */
export function useAuthState(
  options?: Prettify<AuthOptions & { onChange?: (user: User | null) => Promise<void> | void }>
): AsyncUser {
  const auth = useAuth(options);

  const { value: user, isLoading, error, startAsync } = useAsyncState<User>();
  const onChange = options?.onChange;

  useEffect(() => {
    let unsub: () => void;
    startAsync((setValue, setError) => {
      unsub = onAuthStateChanged(
        auth,
        async (user) => {
          if (onChange) {
            try {
              await onChange(user);
            } catch (e) {
              setError(e instanceof Error ? e : new Error(String(e)));
              return;
            }
          }
          setValue(user);
        },
        setError
      );
    });
    return () => unsub();
  }, [auth, startAsync, onChange]);

  return { user, isLoading, error };
}
