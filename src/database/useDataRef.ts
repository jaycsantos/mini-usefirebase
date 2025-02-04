import useDistinct from '@/common/useDistinct';
import { DatabaseReference, Query, ref } from 'firebase/database';
import { DatabaseOptions } from './types';
import { useDatabase } from './useDatabase';

/**
 * Hook to obtain a Firebase Database Reference or Query instance.
 *
 * @param refOrPath - The path to the data location or an existing DatabaseReference/Query object.
 *                    If a string is provided, it will be converted to a DatabaseReference.
 *                    If an empty string is provided, it will return null.
 *                    If a DatabaseReference or Query is provided, it will be returned as is.
 * @param options
 *
 * @returns A memoized Database Reference or Query instance, or null.
 *
 * @see
 * - {@link useData}
 *
 * @group Database
 * @category Hooks
 */
export function useDataRef(
  refOrPath: string | DatabaseReference | Query | null,
  options?: DatabaseOptions
): DatabaseReference | Query | null {
  const database = useDatabase(options);

  const dbRef =
    typeof refOrPath == 'string' ? (refOrPath.length ? ref(database, refOrPath) : null) : refOrPath;

  return useDistinct(dbRef, (a, b) => a.isEqual(b));
}
