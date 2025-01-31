import { useFirestoreGetter } from '@/firestore/useFirestoreGetter';
import {
  DocumentReference,
  DocumentSnapshot,
  getDoc,
  getDocFromCache,
  getDocFromServer,
  onSnapshot,
  type DocumentData,
} from 'firebase/firestore';
import { RefCache, RefOptions, RefResult } from './types';
import { useDocRef } from './useDocRef';

/**
 * Hook to fetch or subscribe to a Firestore document.
 *
 * Internally uses {@link useDocRef} to memoize the DocumentReference.
 *
 * @template T - The type of document data. Defaults to DocumentData if no converter is used.
 *
 * @param pathOrRef - String path to the document or a DocumentReference
 * @param options - Hook options
 *
 * @returns Object containing:
 * - `snapshot` - Memoized firestore DocumentSnapshot
 * - `data` - document data getter
 * - `isLoading` - Loading state
 * - `error` - Any error that occurred
 * - `retry()` - A function to retry the operation
 *
 * @example
 * Using with path
 * ```typescript
 * const { data, loading, error } = useDoc('users/123');
 * ```
 *
 * Using with existing DocumentReference
 * ```typescript
 * const docRef = doc(firestore, 'users/125');
 * const { data, loading, error } = useDoc(docRef);
 * ```
 *
 * Refetching a one-off data
 * ```typescript
 * const options = { cache: RefCache.one };
 * const { snapshot, isLoading, retry } = useDoc('users', [where('height', '>', 160)], options);
 * // ...
 * return <button onClick={retry} disabled={isLoading}>Refresh</button>;
 * ```
 *
 * @see
 * - {@link useDocRef}
 * - {@link useColl}
 *
 * @group Firestore
 * @category Hooks
 */
export function useDoc<T = DocumentData, R = DocumentData>(
  pathOrRef: string | DocumentReference<R>,
  options?: RefOptions<T>
): RefResult<T, DocumentSnapshot<T>> {
  const docRef = useDocRef<T, R>(pathOrRef, options);

  const results = useFirestoreGetter<T, DocumentReference<T>, DocumentSnapshot<T>>({
    from,
    ref: docRef,
    options: Object.assign({ cache: RefCache.liveServer }, options ?? {}) as RefOptions<T>,
  });

  return {
    ...results,
    get data() {
      return results.snapshot?.data();
    },
  };
}

const from = {
  getDefault: getDoc,
  getCache: getDocFromCache,
  getServer: getDocFromServer,
  onSnapshot,
} as const;
