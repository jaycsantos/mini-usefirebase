import { useRef } from 'react';

/**
 * Hook to compare value with previous value using an optional compare function.
 *
 * @template T - The type of value.
 *
 * @param value - Value, memoized if different to previous value.
 * @param compare - Optional compare function. Defaults to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is | Object.is}
 * @returns Memoized value.
 *
 *
 * @ignore
 * @group Common
 * @category Hooks
 */
export default function useEqual<T>(value: T, compare?: (a: T, b: T) => boolean): T {
  compare ??= Object.is;
  const ref = useRef<T>(value);
  if (!ref.current || !compare(ref.current, value)) {
    ref.current = value;
  }
  return ref.current;
}
