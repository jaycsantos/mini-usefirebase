import { useCallback, useState } from 'react';

export default function useAsyncState<T, E extends Error = Error>(options?: {
  initialValue?: T | null;
  initialError?: E | null;
}) {
  const [state, setState] = useState<{ value: T | null; error: E | null; isLoading: boolean }>({
    value: options?.initialValue ?? null,
    error: options?.initialError ?? null,
    isLoading: false,
  });

  const _setValue = useCallback(
    (value: T | null) => setState({ value, error: null, isLoading: false }),
    [setState]
  );

  const _setError = useCallback(
    (error: unknown) => {
      setState((old) => ({
        error: (error instanceof Error ? error : new Error(String(error))) as E,
        value: old.value,
        isLoading: false,
      }));
    },
    [setState]
  );

  const startAsync = useCallback(
    (
      action: (
        setValue: typeof _setValue,
        setError: typeof _setError
      ) => T | void | Promise<T> | Promise<void>
    ) => {
      setState((old) => ({ ...old, isLoading: true }));
      try {
        const res = action(_setValue, _setError);
        if (res instanceof Promise) {
          res.then((val) => val !== undefined && _setValue(val)).catch(_setError);
        } else if (res !== undefined) {
          _setValue(res);
        }
      } catch (e) {
        _setError(e);
      }
    },
    [_setValue, _setError]
  );

  return {
    ...state,
    startAsync,
  };
}
