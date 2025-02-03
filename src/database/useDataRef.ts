import useDistinct from '@/common/useDistinct';
import { DatabaseReference, Query, ref } from 'firebase/database';
import { DatabaseOptions } from './types';
import { useDatabase } from './useDatabase';
export function useDataRef(
  refOrPath: string | DatabaseReference | Query | null,
  options?: DatabaseOptions
): DatabaseReference | Query | null {
  const database = useDatabase(options);

  const dbRef =
    typeof refOrPath == 'string' ? (refOrPath.length ? ref(database, refOrPath) : null) : refOrPath;

  return useDistinct(dbRef, (a, b) => a.isEqual(b));
}
