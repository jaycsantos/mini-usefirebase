import useDistinct from '@/common/useDistinct';
import { doc, DocumentData, DocumentReference, refEqual } from 'firebase/firestore';
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
 * @param refOrPath - String path to the document or a DocumentReference
 * @param options - {@link RefOptions}
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
export function useDocRef<T = DocumentData, R = DocumentData>(
  refOrPath: string | DocumentReference<R> | null,
  options?: RefOptions<T>
): DocumentReference<T> | null {
  options = Object.assign(
    refOrPath instanceof DocumentReference ? { app: refOrPath.firestore.app } : {},
    options ?? {}
  );
  const firestore = useFirestore(options);
  const docRef =
    typeof refOrPath == 'string'
      ? refOrPath.length
        ? (doc(firestore, refOrPath) as DocumentReference<R>)
        : null
      : refOrPath;

  let ref = docRef as DocumentReference<T> | null;
  if (options && docRef) {
    if (options.converter) {
      ref = docRef.withConverter(options.converter);
    } else if (options.converter === null) {
      ref = docRef.withConverter(null) as DocumentReference<T>;
    }
  }

  return useDistinct(ref, refEqual);
}
