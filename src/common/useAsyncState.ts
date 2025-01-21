import { useCallback, useState, useTransition } from 'react';

export default function useAsyncState<T, E extends Error = Error>(options?: {
  initialValue?: T | null;
  initialError?: E | null;
}) {
  const [state, setState] = useState<{ value: T | null; error: E | null }>({
    value: options?.initialValue ?? null,
    error: options?.initialError ?? null,
  });
  const [isLoading, startTransition] = useTransition();

  const setValue = useCallback(
    (value: T | null) => startTransition(() => setState({ value, error: null })),
    []
  );

  const setError = useCallback((error: unknown) => {
    startTransition(() =>
      setState((old) => ({
        error: (error instanceof Error ? error : new Error(String(error))) as E,
        value: old.value,
        isLoading: false,
      }))
    );
  }, []);

  const startAsync = useCallback(
    async (
      action: (
        setVal: typeof setValue,
        setErr: typeof setError
      ) => T | Promise<T> | void | Promise<void>
    ) => {
      startTransition(async () => {
        try {
          const res = await action(setValue, setError);
          const value = res instanceof Promise ? await res : res;
          if (value !== undefined) setValue(value);
        } catch (e) {
          setError(e);
        }
      });
    },
    [setValue, setError]
  );

  return {
    ...state,
    isLoading,
    setValue,
    setError,
    startAsync,
  };
}
