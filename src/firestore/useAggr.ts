import cancellable from '@/utils/cancellable';
import useRetriableAsyncState from '@/common/useRetriableAsyncState';
import useDistinct from '@/common/useDistinct';
import {
  AggregateQuerySnapshot,
  aggregateQuerySnapshotEqual,
  type AggregateSpec,
  type AggregateSpecData,
  DocumentData,
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
    error,
    startAsync,
    isLoading,
    retries,
    retry,
  } = useRetriableAsyncState<AggregateQuerySnapshot<T>>();

  const queryRef = useDistinct(query, queryEqual);

  useEffect(() => {
    const { promise, cancel } = cancellable<AggregateQuerySnapshot<T>>(
      getAggregateFromServer<T, DocumentData, DocumentData>(queryRef, aggregate)
    );
    startAsync(() => promise, aggregateQuerySnapshotEqual<T, DocumentData, DocumentData>);
    return () => cancel();
  }, [queryRef, aggregate, retries, startAsync]);

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
