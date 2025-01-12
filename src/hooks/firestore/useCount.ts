import {
  AggregateQuerySnapshot,
  type AggregateSpec,
  AggregateSpecData,
  getAggregateFromServer,
  Query,
} from 'firebase/firestore';
import makeCancellablePromise from 'make-cancellable-promise';
import { useState, useEffect } from 'react';
import { DocRefOptions } from './useDocRef';

export interface CountOptions extends DocRefOptions {}

export interface CountHook<T extends AggregateSpec> {
  snapshot: AggregateQuerySnapshot<T> | null;
  data?: AggregateSpecData<T>;
  isLoading: boolean;
  error: Error | null;
}

export function useCount<T extends AggregateSpec>(query: Query, aggregate: T): CountHook<T> {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [snapshot, setSnapshot] = useState<AggregateQuerySnapshot<T> | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const { promise, cancel } = makeCancellablePromise<AggregateQuerySnapshot<T>>(
      getAggregateFromServer(query, aggregate)
    );
    promise.then(setSnapshot, setError).finally(() => setLoading(false));
    return () => cancel();
  }, [query, aggregate]);

  return {
    snapshot,
    get data() {
      return snapshot?.data();
    },
    isLoading,
    error,
  };
}
