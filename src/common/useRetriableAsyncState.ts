import { useCallback, useState } from 'react';
import useAsyncState from './useAsyncState';

export default function useRetriableAsyncState<T, E extends Error = Error>(
  options?: Parameters<typeof useAsyncState<T, E>>[0]
) {
  const state = useAsyncState<T, E>(options);
  const [retries, setRetries] = useState(0);

  const retry = useCallback(() => {
    if (!state.isLoading) setRetries((prev) => prev + 1);
  }, [setRetries, state.isLoading]);

  return {
    ...state,
    retries,
    retry,
  };
}
