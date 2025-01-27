import { useCallback, useState } from 'react';

type AsyncState<T, E extends Error> = {
  value: T | null;
  error: E | null;
  isLoading: boolean;
  startAsync: (action: StartAsyncAction<T>, compare?: Comparator<T>) => void;
};

type StartAsyncAction<T> = (
  setValue: (value: T | null) => void,
  setError: (error: unknown) => void
) => T | void | Promise<T> | Promise<void>;

type Comparator<T> = (a: T, b: T) => boolean;

/** @internal */
export default function useAsyncState<T, E extends Error = Error>(options?: {
  initialValue?: T | null;
  initialError?: E | null;
}): AsyncState<T, E> {
  const [state, setState] = useState<{ value: T | null; error: E | null; isLoading: boolean }>({
    value: options?.initialValue ?? null,
    error: options?.initialError ?? null,
    isLoading: false,
  });

  const startAsync = useCallback((action: StartAsyncAction<T>, compare?: Comparator<T>) => {
    setState((old) => ({ ...old, isLoading: true }));

    const setValue = (value: T | null) =>
      setState((old) => ({
        value:
          old.value == null || value == null || !(compare ?? Object.is)(old.value, value)
            ? value
            : old.value,
        error: null,
        isLoading: false,
      }));
    const setError = (error: unknown | null) =>
      setState((old) => ({
        ...old,
        error: (error instanceof Error ? error : new Error(String(error))) as E,
        isLoading: false,
      }));

    try {
      const res = action(setValue, setError);
      if (res instanceof Promise) {
        res.then((val) => val !== undefined && setValue(val)).catch(setError);
      } else if (res !== undefined) {
        setValue(res);
      }
    } catch (e) {
      setError(e);
    }
  }, []);

  return {
    ...state,
    startAsync,
  };
}
