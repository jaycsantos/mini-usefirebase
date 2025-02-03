import useDistinct from '@/common/useDistinct';
import { query, Query, QueryConstraint } from 'firebase/database';
import { DataOptions } from './types';
import { useDataRef } from './useDataRef';
export function useQueryRef(
  pathOrRef: string | Query | null,
  constraints: QueryConstraint | QueryConstraint[],
  options?: DataOptions
) {
  const ref = useDataRef(pathOrRef, options);
  constraints = Array.isArray(constraints) ? constraints : [constraints];
  const queryRef = ref ? query(ref, ...constraints) : null;
  return useDistinct(queryRef, (a, b) => a.isEqual(b));
}
