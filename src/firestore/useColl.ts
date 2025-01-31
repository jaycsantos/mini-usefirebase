import {
  type DocumentData,
  getDocs,
  getDocsFromCache,
  getDocsFromServer,
  onSnapshot,
  Query,
  QueryConstraint,
  QuerySnapshot,
} from 'firebase/firestore';
import { RefCache, RefOptions, RefResult } from './types';
import { useCollRef } from './useCollRef';
import { useFirestoreGetter } from './useFirestoreGetter';

/**
 * Hook to fetch or subscribe to a Firestore collection or Query.
 *
 * Internally uses {@link useCollRef} to memoize the Query reference.
 *
 * @template T - The type of document data if converter is used
 *
 * @param pathOrQuery - Collection path string or a Firestore Query
 * @param constraints - Single or an array of query constraints
 * @param options - Hook options
 *
 * @returns Object containing:
 * - `snapshot` - Memoized firestore QuerySnapshot. But each QueryDocumentSnapshot is not memoized.
 * - `data` - Array of document data
 * - `isLoading` - Loading state
 * - `error` - Any error that occurred
 * - `retry()` - A function to retry the operation
 *
 * @example
 * Basic usage with collection name, gets all documents from collection
 * ```typescript
 * const { data, isLoading } = useColl('users');
 * ```
 *
 * With query constraints
 * ```typescript
 * const { data, isLoading } = useColl('users', [where('age', '>', 18)]);
 * ```
 *
 * With options
 * ```typescript
 * const options = { cache: RefCache.oneCacheAndServer };
 * const { data, isLoading } = useColl('users', [where('height', '>', 160)], options);
 * ```
 *
 * With separate memoized query object
 * ```typescript
 * const queryRef = useCollRef('users');
 * const { data, isLoading } = useColl(queryRef, [where('age', '>', 18)]);
 * ```
 *
 * Refetching will use old stale data while loading. You can use isLoading to determine
 * if a new data is potentially incoming.
 * ```typescript
 * function MyComponent({firebaseApp}) {
 *   const options = { cache: RefCache.one };
 *   const { snapshot, isLoading, retry } = useColl('users', [where('height', '>', 160)], options);
 *   // ...
 *   return <button onClick={retry} disabled={isLoading}>Refresh</button>;
 * }
 * ```
 *
 * If you did not use {@link FirebaseAppContext} you need to pass the Firebase app instance or
 * a Firestore instance in the options.
 * ```typescript
 * function MyComponent({firebaseApp}) {
 *  const options = {
 *    app: firebaseApp, // either app
 *    firestore: getFirestore(firebaseApp), // or firestore
 *  }
 *  const result = useColl('users', [where('verified', '==', true)], options);
 *  //...
 * }
 * ```
 *
 * @see
 * - {@link useCollRef}
 * - {@link useDoc}
 *
 * @group Firestore
 * @category Hooks
 */
export function useColl<T = DocumentData, R = DocumentData>(
  pathOrQuery: Query<R> | string,
  constraints?: QueryConstraint | QueryConstraint[],
  options?: RefOptions<T>
): RefResult<Array<T>, QuerySnapshot<T>> {
  options = Object.assign({ cache: RefCache.liveServer }, options ?? {});

  const queryRef = useCollRef<T, R>(pathOrQuery, constraints ?? [], options);

  const results = useFirestoreGetter<T, Query<T>, QuerySnapshot<T>>({
    from,
    ref: queryRef,
    options,
  });

  return {
    ...results,
    get data() {
      return results.snapshot?.docs.map((snapshot) => snapshot.data());
    },
  };
}

const from = {
  getDefault: getDocs,
  getCache: getDocsFromCache,
  getServer: getDocsFromServer,
  onSnapshot,
} as const;
