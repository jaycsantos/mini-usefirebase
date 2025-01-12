import { CollectionReference, type DocumentData, collection } from 'firebase/firestore';
import { useMemo } from 'react';
import { useFirestore } from '../useFirestore';
import { DocRefOptions } from './useDocRef';

export interface ColRefHook<T = DocumentData, D extends DocumentData = DocumentData> {
  colRef: CollectionReference<T, D>;
}

export function useColRef<T = DocumentData, D extends DocumentData = DocumentData>(
  path: string,
  options?: DocRefOptions<T, D>
): ColRefHook<T, D> {
  const db = options?.db ?? useFirestore({ app: options?.app }).db;

  // CollectionReference is memoized to prevent unnecessary re-renders
  const colRef = useMemo(
    () =>
      options?.converter
        ? collection(db, path).withConverter(options.converter)
        : (collection(db, path).withConverter(null) as CollectionReference<T, D>),
    [db, path, options?.converter]
  );

  return { colRef };
}
