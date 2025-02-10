import { useCallback, useState } from 'react';

type AsyncState<T, E extends Error> = Readonly<{
  value: T | null;
  error: E | null;
  isLoading: boolean;
  startAsync: (action: StartAsyncAction<T>, compare?: Comparator<T>) => void;
  stopAsync: () => void;
}>;

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
  const [value, setValue] = useState<T | null>(options?.initialValue ?? null);
  const [error, setError] = useState<E | null>(options?.initialError ?? null);
  const [isLoading, setLoading] = useState(false);

  const startAsync = useCallback((action: StartAsyncAction<T>, compare?: Comparator<T>) => {
    setLoading(true);

    const callValue = (value: T | null) => {
      setLoading(false);
      setError(null);
      setValue((old) =>
        old == null || value == null || !(compare ?? Object.is)(old, value) ? value : old
      );
    };
    const callError = (error: unknown | null) => {
      setLoading(false);
      setError((error instanceof Error ? error : new Error(String(error))) as E);
    };

    try {
      const res = action(callValue, callError);
      if (res instanceof Promise) {
        res.then((val) => val !== undefined && callValue(val)).catch(callError);
      } else if (res !== undefined) {
        callValue(res);
      }
    } catch (e) {
      callError(e);
    }
  }, []);

  const stopAsync = useCallback(() => {
    setLoading(false);
    setValue(null);
    setError(null);
  }, []);

  return {
    value,
    error,
    isLoading,
    startAsync,
    stopAsync,
  } as const;
}
