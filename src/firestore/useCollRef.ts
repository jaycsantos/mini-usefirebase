import useEqual from '@/common/useEqual';
import { useFirestore } from './useFirestore';
import {
  collection,
  type DocumentData,
  Query,
  query,
  QueryConstraint,
  queryEqual,
  CollectionReference,
} from 'firebase/firestore';
import { RefOptions } from './types';

/**
 * A React hook that creates and memoizes a Firestore collection reference with query constraints.
 *
 * @template T - The type of document data. Defaults to DocumentData if no converter is provided.
 *
 * @param refOrName - Collection path string or a Firestore Query
 * @param constraints - Single or an array of query constraints
 * @param options - Hook options
 *
 * @returns A memoized Query object that represents the collection with applied constraints. The same
 * reference is returned unless the path or original reference changes (compared using `queryEqual`)
 *
 * @example
 * ```typescript
 * // Using with collection path
 * const query = useCollRef('users', where('age', '>', 18));
 *
 * // Using with multiple constraints
 * const query = useCollRef('users', [
 *   where('age', '>', 18),
 *   orderBy('name')
 * ]);
 * ```
 *
 * @see
 * - {@link useColl}
 * - {@link useDocRef}
 *
 * @group Firestore
 * @category Hooks
 */
export function useCollRef<T = DocumentData>(
  refOrName: Query | string,
  constraints?: QueryConstraint | QueryConstraint[],
  options?: RefOptions<T>
): Query<T> {
  const getFirestore = useFirestore(options);
  const db = typeof refOrName != 'string' ? refOrName.firestore : getFirestore();

  const collRef = typeof refOrName == 'string' ? (collection(db, refOrName) as Query) : refOrName;
  const queryRef = query(
    options?.converter
      ? collRef.withConverter<T>(options?.converter)
      : (collRef as CollectionReference<T>),
    ...(constraints ? (Array.isArray(constraints) ? constraints : [constraints]) : [])
  );

  return useEqual(queryRef, queryEqual);
}
