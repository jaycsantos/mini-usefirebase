/**
 * Imports necessary Firestore functions and types from Firebase and React.
 */
import {
  type DocumentData,
  getDocs,
  getDocsFromCache,
  getDocsFromServer,
  onSnapshot,
  Query,
  QuerySnapshot,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import makeCancellablePromise from 'make-cancellable-promise';
import { DocOptions } from './useDoc';
import { FirestoreSource } from '../../types';

/**
 * The return type for the `useDocs` hook.
 *
 * @template T - The type of document data if converter is used.
 */
export interface DocResults<T = DocumentData> {
  /**
   * The query snapshot containing all matched documents.
   */
  querySnapshot: QuerySnapshot<T> | null;
  /**
   * Array of document data for all matched documents.
   */
  data?: Array<T | null>;
  /**
   * Whether the query is currently loading.
   */
  isLoading: boolean;
  /**
   * Any error that occurred while fetching the documents.
   */
  error: Error | null;
}

/**
 * A custom hook to fetch and listen to multiple Firestore documents using a query.
 *
 * @template T - The type of document data if converter is used.
 * @template D - The type of the document data with default value.
 * @param query - The Firestore query to execute.
 * @param options - Configuration options for the query:
 *   - listen: Whether to listen for real-time updates
 *   - listenMetadata: Whether to include metadata changes in the listener
 *   - cache: Caching strategy to use for fetching documents
 * @returns An object containing the query snapshot, data array, loading state, and any error.
 */
export function useDocs<T = DocumentData, D extends DocumentData = DocumentData>(
  query: Query<T>,
  options?: DocOptions<T, D>
): DocResults<T> {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [querySnapshot, setQuerySnapshot] = useState<QuerySnapshot<T> | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (options?.listen || options?.src == FirestoreSource.cacheAndServer) {
      const unsub = onSnapshot(
        query,
        {
          includeMetadataChanges: options.listen == 'metadata',
          source: options?.src === FirestoreSource.cacheOnly ? 'cache' : 'default',
        },
        (snapshot) => {
          setQuerySnapshot(snapshot);
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
      const { promise, cancel } = makeCancellablePromise<QuerySnapshot<T>>(
        (() => {
          switch (options?.src) {
            case FirestoreSource.cacheOrServer:
              return getDocsFromCache(query).catch(() => getDocsFromServer(query));
            case FirestoreSource.cacheOnly:
              return getDocsFromCache(query);
            case FirestoreSource.serverOnly:
              return getDocsFromServer(query);
            case FirestoreSource.serverOrCache:
            default:
              return getDocs(query);
          }
        })()
      );
      promise.then(setQuerySnapshot, setError).finally(() => setLoading(false));
      return () => cancel;
    }
  }, [query, options?.listen, options?.src]);

  return {
    querySnapshot,
    get data() {
      return querySnapshot?.docs.map((snapshot) => snapshot.data());
    },
    isLoading,
    error,
  };
}
