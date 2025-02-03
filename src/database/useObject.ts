import useRetriableAsyncState from '@/common/useRetriableAsyncState';
import { DatabaseReference, DataSnapshot, onValue, Query } from 'firebase/database';
import { useEffect } from 'react';
import { DataOptions } from './types';
import { useDataRef } from './useDataRef';
export function useObject(
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
