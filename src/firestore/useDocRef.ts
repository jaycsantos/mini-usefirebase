import useEqual from '@/common/useEqual';
import { doc, DocumentData, DocumentReference, refEqual } from '@firebase/firestore';
import { RefOptions } from './types';
import { useFirestore } from './useFirestore';

/**
 * A custom hook for creating and memoizing Firestore DocumentReferences.
 *
 * This hook can be used in two ways:
 * 1. With an existing DocumentReference to memoize it
 * 2. With a path string to create and memoize a new DocumentReference
 *
 * @template T - The type of document data if converter is used, defaults to DocumentData
 *
 * @param pathOrRef - String path to the document or a DocumentReference
 * @param options - Hook options
 *
 * @returns A memoized DocumentReference instance. The same reference is returned
 * unless the path or reference changes (compared using refEqual)
 *
 * @example
 * ```typescript
 * // Using with path
 * const docRef = useDocRef('users/123');
 *
 * // Using with existing reference
 * const docRef = useDocRef(existingDocRef);
 *
 * // Using with converter
 * const docRef = useDocRef<UserType>('users/123', {
 *   converter: userConverter
 * });
 * ```
 *
 * @see
 * - {@link useDoc}
 * - {@link useCollRef}
 *
 * @group Firestore
 * @category Hooks
 */
export function useDocRef<T = DocumentData>(
  pathOrRef: string | DocumentReference<T>,
  options?: RefOptions<T>
): DocumentReference<T> {
  const firestore = useFirestore(options);
  const db = typeof pathOrRef != 'string' ? pathOrRef.firestore : (options?.db ?? firestore());

  const docRef = typeof pathOrRef == 'string' ? doc(db, pathOrRef) : pathOrRef;
  const docRefT = options?.converter
    ? docRef.withConverter(options.converter)
    : (docRef.withConverter(null) as DocumentReference<T>);

  return useEqual(docRefT, refEqual);
}
