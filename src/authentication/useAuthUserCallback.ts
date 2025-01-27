import { Prettify } from '@/common/types';
import useAsyncState from '@/common/useAsyncState';
import { User } from 'firebase/auth';
import { useCallback } from 'react';
import { AuthOptions } from './types';
import { useAuth } from './useAuth';

/**
 * A hook that wraps Firebase Auth User operations with state management and error handling.
 *
 * Accepts a callback that takes the Firebase Auth User instance and additional arguments.
 * See {@link https://firebase.google.com/docs/reference/js/auth#functionuser_ | firebase documentation} for comprehensive list.
 *
 * @template R - Return type of the callback
 * @template A - Array type for the callback arguments
 *
 * @param callback - A function that takes Firebase Auth User instance and additional arguments,
 *                  and returns a promise or value
 * @param options - auth options
 * @param options.onResult - Callback when the operation completes
 *
 * @returns An object containing:
 * - invoke: Function to execute the auth operation
 * - result: The result of the last operation
 * - isLoading: Boolean indicating if an operation is in progress
 * - error: Any error that occurred during the operation or auth initialization
 *
 * @example
 * ```typescript
 * const { invoke, result, isLoading, error } = useAuthUserCallback(updatePassword);
 * //...
 * return <Button onClick={() => invoke(newPassword)} disabled={isLoading}>Submit</Button>;
 * ```
 *
 * or pass a custom callback
 *
 * ```typescript
 * const { invoke, result, isLoading, error } = useAuthUserCallback(async(user, email, password)=>{
 *   await updateEmail(user, email);
 *   await updatePassword(user, password);
 *   return true;
 * });
 * //...
 * return <Button onClick={() => invoke(email, password)} disabled={isLoading}>Submit</Button>;
 * ```
 *
 * @see
 * - {@link useAuthState}
 * - {@link useAuthCallback}
 *
 * @group Authentication
 * @category Hooks
 */
export function useAuthUserCallback<R, A extends Array<unknown>>(
  callback: (user: User, ...args: A) => PromiseLike<R> | R,
  options?: Prettify<AuthOptions & { onResult?: (result: R | undefined, error?: unknown) => void }>
) {
  const auth = useAuth(options);
  const onResult = options?.onResult;
  const { value, error, isLoading, startAsync } = useAsyncState<R>();

  const invoke = useCallback(
    (...args: A) =>
      startAsync(async () => {
        await auth.authStateReady();
        try {
          if (auth.currentUser) {
            const res = await callback(auth.currentUser, ...args);
            if (onResult) onResult(res);
            return res;
          }
          throw new Error('User is not authenticated');
        } catch (e) {
          if (onResult) onResult(undefined, e);
          throw e;
        }
      }),
    [auth, callback, onResult, startAsync]
  );

  return {
    invoke,
    result: value,
    isLoading,
    error,
  };
}
