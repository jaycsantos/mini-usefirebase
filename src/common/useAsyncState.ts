import { useState } from 'react';

export default function useAsyncState<T, E = Error>(initialValue?: T | null, initialError?: E | null) {
  const [value, setValue] = useState<T | null>(initialValue ?? null);
  const [error, setError] = useState<E | null>(initialError ?? null);
  const [retries, setRetries] = useState(1);

  return {
    value,
    setValue,
    error,
    setError,
    isLoading: !value && !error,
    retries,
    retry() {
      setRetries((prev) => prev + 1);
      setError(null);
    },
  };
}
