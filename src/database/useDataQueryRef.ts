import useDistinct from '@/common/useDistinct';
import { query, Query, QueryConstraint } from 'firebase/database';
import { DatabaseOptions } from './types';
import { useDataRef } from './useDataRef';

/**
 * Hook to obtain a Firebase Database Query with filter/limit constraints.
 *
 * @param pathOrRef - The path to the database location or an existing reference.
 * @param constraints - Single or array of query constraints to apply (e.g., orderByChild, limitToFirst, equalTo).
 * @param options
 *
 * @returns A memoized Query reference that only updates when the reference query or constraints changes.
 *
 * @example
 * ```typescript
 * const usersQuery = useDataQueryRef(
 *   'users',
 *   [orderByChild('age'), limitToFirst(10)]
 * );
 * const {snapshot, isLoading, error} = useData(usersQuery);
 *
 * return <>{isLoading ? '...' : snapshot?.val()}</>;
 * ```
 *
 * @see
 * - {@link useData}
 * - {@link useDataRef}
 *
 *
 * @group Database
 * @category Hooks
 */
export function useDataQueryRef(
  pathOrRef: string | Query | null,
  constraints: QueryConstraint | QueryConstraint[],
  options?: DatabaseOptions
) {
  const ref = useDataRef(pathOrRef, options);
  constraints = Array.isArray(constraints) ? constraints : [constraints];
  const queryRef = ref ? query(ref, ...constraints) : null;
  return useDistinct(queryRef, (a, b) => a.isEqual(b));
}
