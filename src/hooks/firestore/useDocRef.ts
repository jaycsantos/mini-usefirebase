import {
  doc,
  DocumentData,
  DocumentReference,
  Firestore,
  FirestoreDataConverter,
} from 'firebase/firestore';
import { useFirestore } from '../useFirestore';
import { useMemo, useState } from 'react';
import { FirebaseAppData } from '../useFirebase';

/**
 * Options for configuring the `useDocRef` hook.
 *
 * @template T - The type of document data if converter is used.
 * @template D - The type of the document data with default value.
 */
export interface DocRefOptions<T = DocumentData, D extends DocumentData = DocumentData>
  extends Partial<FirebaseAppData> {
  /**
   * Optional Firestore database instance.
   */
  db?: Firestore;
  /**
   * Optional data converter for the document reference.
   */
  converter?: FirestoreDataConverter<T, D>;
}

/**
 * The return type of the `useDocRef` hook.
 *
 * @template T - The type of document data if converter is used.
 * @template D - The type of the document data with default value.
 */
export interface DocRefHook<T = DocumentData, D extends DocumentData = DocumentData> {
  /**
   * The document reference object.
   */
  docRef: DocumentReference<T, D> | null;
  /**
   * Any error that occurred while creating the document reference.
   */
  error: Error | null;
}

/**
 * A custom hook to create a Firestore document reference.
 *
 * @template T - The type of document data if converter is used.
 * @template D - The type of the document data with default value.
 * @param path - The path to the Firestore document.
 * @param options - Configuration options including database instance and data converter.
 * @returns An object containing the document reference and any error.
 */
export function useDocRef<T = DocumentData, D extends DocumentData = DocumentData>(
  path: string,
  options?: DocRefOptions<T, D>
): DocRefHook<T, D> {
  const db = options?.db ?? useFirestore({ app: options?.app }).db;
  const [error, setError] = useState<Error | null>(null);

  // DocumentReference is memoized to prevent unnecessary re-renders
  const docRef = useMemo(() => {
    try {
      return options?.converter
        ? doc(db, path).withConverter(options.converter)
        : (doc(db, path).withConverter(null) as DocumentReference<T, D>);
    } catch (e: any) {
      setError(e);
    }
    return null;
  }, [db, path, options?.converter]);

  return { docRef, error };
}
