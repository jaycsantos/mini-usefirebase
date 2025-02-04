import useRetriableAsyncState from '@/common/useRetriableAsyncState';
import { DatabaseReference, DataSnapshot, onValue, Query } from 'firebase/database';
import { useEffect } from 'react';
import { DataOptions } from './types';
import { useDataRef } from './useDataRef';

/**
 * Hook to retrieve and subscribe to a Firebase Realtime Database object value.
 *
 * @param pathOrRef - The path or reference to the database location
 * @param options - Optional configuration object:
 * @param options.onlyOnce - If true, fetches the data once without setting up a realtime subscription
 * @param options.database - specific database instance to use or database url
 * @param options.app - specific Firebase app instance to use
 *
 * @returns An object containing:
 * - snapshot: The current DataSnapshot containing the data
 * - error: Any error that occurred during the operation
 * - isLoading: Boolean indicating if the initial data fetch is in progress
 * - retry: Function to retry the operation if it failed
 *
 * @example
 * ```typescript
 * const { snapshot, error, isLoading } = useData('users/123');
 * const userData = snapshot?.val();
 * ```
 *
 * @group Database
 * @category Hooks
 */
export function useData(
  pathOrRef: string | DatabaseReference | Query | null,
  options?: DataOptions
) {
  const dbRef = useDataRef(pathOrRef, options);
  const onlyOnce = options?.onlyOnce ?? false;

  const {
    value: snapshot,
    error,
    isLoading,
    startAsync,
    stopAsync,
    retries,
    retry,
  } = useRetriableAsyncState<DataSnapshot>();

  useEffect(() => {
    if (!dbRef) {
      stopAsync();
      return;
    }
    let unsub: () => void | undefined;
    startAsync((setSnapshot, setError) => {
      unsub = onValue(dbRef, setSnapshot, setError, { onlyOnce });
    });
    return () => unsub();
  }, [dbRef, startAsync, stopAsync, onlyOnce, retries]);

  return { snapshot, error, isLoading, retry };
}
