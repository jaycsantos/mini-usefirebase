/**
 * Imports necessary Firestore functions and types from Firebase and React.
 */
import {
  type DocumentData,
  DocumentSnapshot,
  getDoc,
  getDocFromCache,
  getDocFromServer,
  onSnapshot,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { FirestoreSource } from '../../types';
import makeCancellablePromise from 'make-cancellable-promise';
import { DocRefOptions, useDocRef } from './useDocRef';

/**
 * Options for configuring the `useDoc` hook.
 *
 * @template T - The type of the document data.
 * @template D - The type of the document data with default value.
 */
export interface DocOptions<T = DocumentData, D extends DocumentData = DocumentData>
  extends DocRefOptions<T, D> {
  /**
   * Whether to listen for real-time updates. 'metadata' will listen for metadata changes as well.
   */
  listen?: boolean | 'metadata';
  /**
   * Caching strategy to use for fetching the document. Only cacheOnly applies if `listen` is true.
   */
  src?: FirestoreSource;
}

/**
 * The return type of the `useDoc` hook.
 *
 * @template T - The type of document data if converter is used.
 * @template D - The type of the document data with default value.
 */
export interface DocHook<T = DocumentData, D extends DocumentData = DocumentData> {
  /**
   * The document snapshot.
   */
  snapshot: DocumentSnapshot<T, D> | null;
  /**
   * The document data.
   */
  data?: T;
  /**
   * Whether the document is currently being loaded.
   */
  isLoading: boolean;
  /**
   * Any error that occurred while fetching the document.
   */
  error: Error | null;
}

/**
 * A custom hook to fetch and listen to a Firestore document.
 *
 * @template T - The type of document data if converter is used.
 * @template D - The type of the document data with default value.
 * @param path - The path to the Firestore document.
 * @param options - Options to configure the hook.
 * @returns An object containing the document snapshot, data, loading state, and any error.
 */
export function useDoc<T = DocumentData, D extends DocumentData = DocumentData>(
  path: string,
  options?: DocOptions<T, D>
): DocHook<T, D> {
  const { docRef, error: docRefError } = useDocRef<T, D>(path, options);

  const [isLoading, setLoading] = useState<boolean>(true);
  const [snapshot, setSnapshot] = useState<DocumentSnapshot<T, D> | null>(null);
  const [error, setError] = useState<Error | null>(docRefError);

  useEffect(() => {
    if (!docRef) {
      setError(docRefError);
      return;
    }
    if (options?.listen || options?.src == FirestoreSource.cacheAndServer) {
      const unsub = onSnapshot<T, D>(
        docRef,
        {
          includeMetadataChanges: options.listen == 'metadata',
          source: options?.src === FirestoreSource.cacheOnly ? 'cache' : 'default',
        },
        (snapshot) => {
          setSnapshot(snapshot);
          setLoading(false);

          if (
            options?.src == FirestoreSource.cacheAndServer &&
            snapshot.metadata.fromCache
          ) {
            unsub();
          }
        },
        (e) => setError(e)
      );
      return () => unsub();
    } else {
      const { promise, cancel } = makeCancellablePromise<DocumentSnapshot<T, D>>(
        (() => {
          switch (options?.src) {
            case FirestoreSource.cacheOrServer:
              return getDocFromCache<T, D>(docRef).catch(() =>
                getDocFromServer<T, D>(docRef)
              );
            case FirestoreSource.cacheOnly:
              return getDocFromCache<T, D>(docRef);
            case FirestoreSource.serverOnly:
              return getDocFromServer<T, D>(docRef);
            case FirestoreSource.serverOrCache:
            default:
              return getDoc<T, D>(docRef);
          }
        })()
      );
      promise
        .then(setSnapshot)
        .catch(setError)
        .finally(() => setLoading(false));
      return () => cancel;
    }
  }, [docRef, path, options?.listen, options?.src]);

  return {
    snapshot,
    get data() {
      return snapshot?.data();
    },
    isLoading,
    error,
  };
}
