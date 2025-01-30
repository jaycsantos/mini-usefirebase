import { Prettify } from '@/common/types';
import useAsyncState from '@/common/useAsyncState';
import { Auth } from 'firebase/auth';
import { useCallback } from 'react';
import { AuthOptions } from './types';
import { useAuth } from './useAuth';

/**
 * A hook that wraps Firebase Auth operations with state management and error handling.
 *
 * Accepts a callback that takes the Firebase Auth instance and additional arguments.
 * See {@link https://firebase.google.com/docs/reference/js/auth.md#functionauth_ | firebase documentation} for comprehensive list.
 *
 * @template R - Return type of the callback
 * @template A - Array type for the callback arguments
 *
 * @param callback - A function that takes Firebase Auth instance and additional arguments,
 *                  and can return a promise, value or void
 * @param options
 * @param options.onResult - Callback when the operation completes
 * @param options.app
 * @param options.auth
 *
 * @returns An object containing:
 * - invoke: Function to execute the auth operation. Calling invoke while isLoading will do nothing.
 * - result: The result of the last operation. Last result will be kept stale if invoke is called again.
 * - isLoading: Boolean indicating if an operation is in progress
 * - error: Any error that occurred during the operation or auth initialization
 *
 * @example
 * ```typescript
 * const { invoke, result, isLoading, error } = useAuthCallback(sendSignInLinkToEmail);
 * //...
 * return <Button onClick={() => invoke(email)} disabled={isLoading} >Send To Email</Button>;
 * ```
 *
 * or pass a custom callback
 *
 * ```typescript
 * const { invoke, result, isLoading, error } = useAuthCallback(async (auth, email, password) => {
 *   const userCred = await createUserWithEmailAndPassword(auth, email, password);
 *   await sendEmailVerification(userCred.user);
 *   return userCred.user;
 * });
 * //...
 * return <Button onClick={() => invoke(email, password)} disabled={isLoading} >Submit</Button>;
 * ```
 *
 * @see
 * - {@link useAuthState}
 * - {@link useAuthUserCallback}
 *
 * @group Authentication
 * @category Hooks
 */
export function useAuthCallback<R, A extends Array<unknown>>(
  callback: (auth: Auth, ...args: A) => PromiseLike<R> | R,
  options?: Prettify<
    AuthOptions & {
      onResult?: (result: R | undefined, error?: unknown) => void;
    }
  >
) {
  const auth = useAuth(options);
  const onResult = options?.onResult;
  const { value, error, isLoading, startAsync } = useAsyncState<R>();

  const invoke = useCallback(
    (...args: A) =>
      startAsync(async () => {
        await auth.authStateReady();
        try {
          const res = await callback(auth, ...args);
          if (onResult) onResult(res);
          return res;
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
