import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  Query,
  QuerySnapshot,
} from 'firebase/firestore';
import { useEffect } from 'react';
import useAsyncState from '../common/useAsyncState';
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
  ref: Ref | null;
  options: RefOptions<T>;
}): RefResult<T, Snap> {
  const {
    value: snapshot,
    setValue: setSnapshot,
    error,
    setError,
    isLoading,
    retries,
    retry,
  } = useAsyncState<Snap | null>();

  useEffect(() => {
    if (!ref) {
      setError(new Error('No reference provided'));
      return;
    }
    if (
      options.cache?.startsWith(RefCache.liveServer) ||
      options.cache == RefCache.oneCacheAndServer
    ) {
      const unsub = from.onSnapshot(
        ref,
        {
          includeMetadataChanges: options.cache == RefCache.liveServerMetadata,
        },
        (snapshot) => {
          setSnapshot(snapshot);

          if (options.cache == RefCache.oneCacheAndServer && !snapshot.metadata.fromCache) {
            unsub();
          }
        },
        (e) => setError(e)
      );
      return () => unsub();
    } else {
      const { promise, cancel } = cancellable<Snap>(
        (() => {
          switch (options.cache) {
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
      promise.then(setSnapshot).catch(setError);
      return () => cancel;
    }
  }, [ref, from, options.cache, retries, setError, setSnapshot]);

  return {
    snapshot,
    error,
    isLoading,
    retry,
  };
}
