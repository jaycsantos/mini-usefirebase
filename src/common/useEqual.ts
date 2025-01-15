import { useRef } from 'react';

export default function useEqual<T>(value: T, compare: (a: T, b: T) => boolean): T {
  const ref = useRef<T>(value);
  if (!ref.current || !compare(ref.current, value)) {
    ref.current = value;
  }
  return ref.current;
}
