import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  Query,
  QuerySnapshot,
} from 'firebase/firestore';
import { useEffect } from 'react';
import useRetriableAsyncState from '../common/useRetriableAsyncState';
import cancellable from '../utils/cancellable';
import { RefCache, RefOptions, RefResult } from './types';

type Reference<T = DocumentData> = DocumentReference<T> | CollectionReference<T> | Query<T>;
type Snapshot<T = DocumentData> = DocumentSnapshot<T> | QuerySnapshot<T>;

/** @internal */
export interface FirestoreGetters<
  T = DocumentData,
  Ref extends Reference<T> = Reference<T>,
  Snap extends Snapshot<T> = Snapshot<T>,
> {
  getDefault: (src: Ref) => Promise<Snap>;
  getCache: (src: Ref) => Promise<Snap>;
  getServer: (src: Ref) => Promise<Snap>;
  onSnapshot: (
    src: Ref,
    options: { includeMetadataChanges?: boolean; source?: 'default' | 'cache' },
    onNext: (snapshot: Snap) => void,
    onError: (error: Error) => void
  ) => () => void;
}

/** @internal */
export function useFirestoreGetter<
  T = DocumentData,
  Ref extends Reference<T> = Reference<T>,
  Snap extends Snapshot<T> = Snapshot<T>,
>({
  from,
  ref,
  options,
}: {
  from: FirestoreGetters<T, Ref, Snap>;
  ref: Ref;
  options: RefOptions<T>;
}): RefResult<T, Snap> {
  const {
    value: snapshot,
    error,
    isLoading,
    setError,
    startAsync,
    retries,
    retry,
  } = useRetriableAsyncState<Snap | null>();
  const cache = options.cache ?? RefCache.one;

  useEffect(() => {
    if (cache.startsWith(RefCache.liveServer) || cache == RefCache.oneCacheAndServer) {
      let unsub: () => void;
      startAsync((setSnapshot) => {
        unsub = from.onSnapshot(
          ref,
          {
            includeMetadataChanges: cache == RefCache.liveServerMetadata,
          },
          (snapshot) => {
            setSnapshot(snapshot);

            if (cache == RefCache.oneCacheAndServer && !snapshot.metadata.fromCache) {
              unsub();
            }
          },
          (e) => setError(e)
        );
      });
      return () => unsub();
    } else {
      const { promise, cancel } = cancellable<Snap>(
        (() => {
          switch (cache) {
            case RefCache.oneCacheOrServer:
              return from.getCache(ref).catch(() => from.getServer(ref));
            case RefCache.oneCache:
              return from.getCache(ref);
            case RefCache.oneServer:
              return from.getServer(ref);
            case RefCache.one:
            default:
              return from.getDefault(ref);
          }
        })()
      );
      startAsync(() => promise);
      return () => cancel;
    }
  }, [ref, from, cache, retries, setError, startAsync]);

  return {
    snapshot,
    error,
    isLoading,
    retry,
  };
}
