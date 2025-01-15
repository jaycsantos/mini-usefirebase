import cancellable from '@/utils/cancellable';
import useAsyncState from '@/common/useAsyncState';
import useEqual from '@/common/useEqual';
import {
  AggregateQuerySnapshot,
  type AggregateSpec,
  type AggregateSpecData,
  getAggregateFromServer,
  Query,
  queryEqual,
} from 'firebase/firestore';
import { useEffect } from 'react';
import { type RefResult } from './types';

/**
 * Hook to retrieve aggregate data from a Firestore query.
 *
 * @template T - The type of AggregateSpec being used for the query
 *
 * @param query - The Firestore query to aggregate data from
 * @param aggregate - The aggregate specification defining what data to collect
 *
 * @returns An object containing:
 * - `snapshot`: The {@link https://firebase.google.com/docs/reference/js/firestore_.aggregatequerysnapshot | AggregateQuerySnapshot}
 * - `data`: The processed aggregate data
 * - `isLoading`: Boolean indicating if the query is in progress
 * - `error`: Any error that occurred during the query
 * - `retry`: Function to retry the failed query
 *
 * @example
 * ```typescript
 * function MyComponent(){
 *   const query = useCollRef('users', where('age', '>=', 30));
 *   const { data, isLoading } = useAggr(query, { count: count() });
 *
 *   return <>{isLoading ? '...' : data.count}</>;
 * }
 * ```
 *
 * @see
 * - {@link useCollRef}
 * - {@link useColl}
 *
 * @group Firestore
 * @category Hooks
 */
export function useAggr<T extends AggregateSpec>(
  query: Query,
  aggregate: T
): RefResult<AggregateSpecData<T>, AggregateQuerySnapshot<T>> {
  const {
    value: snapshot,
    setValue: setSnapshot,
    error,
    setError,
    isLoading,
    retries,
    retry,
  } = useAsyncState<AggregateQuerySnapshot<T> | null>();

  const queryRef = useEqual(query, queryEqual);

  useEffect(() => {
    const { promise, cancel } = cancellable<AggregateQuerySnapshot<T>>(
      getAggregateFromServer(queryRef, aggregate)
    );
    promise.then(setSnapshot).catch(setError);
    return () => cancel();
  }, [queryRef, aggregate, retries, setError, setSnapshot]);

  return {
    snapshot,
    get data() {
      return snapshot?.data();
    },
    isLoading,
    error,
    retry,
  };
}
