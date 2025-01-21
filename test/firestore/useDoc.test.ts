import { act, renderHook, waitFor } from '@testing-library/react';
import { afterAll, describe, expect, it } from 'vitest';
import { RefCache } from '../../src/firestore/types';
import { useDoc } from '../../src/firestore/useDoc';
import { admin, db } from './helpers';

describe('useDoc', () => {
  const collName = 'useDoc';

  afterAll(async () => admin.deleteCollection(collName));

  it('should return snapshot, data, isLoading and error', async () => {
    const path = `${collName}/get`;
    const payload = { name: 'get' };

    await admin.db.doc(path).set(payload);

    const { result } = renderHook(() => useDoc(path, { db, cache: RefCache.one }));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.snapshot).toBeTruthy();
      expect(result.current.data).toEqual(payload);
    });
  });

  it('should listen to real-time updates as default', async () => {
    const path = `${collName}/realtime`;
    const payload = { count: 1 };
    await admin.db.doc(path).set(payload);

    const { result } = renderHook(() => useDoc(path, { db }));

    await waitFor(() => {
      expect(result.current.data).toEqual(payload);
    });

    await act(() => admin.db.doc(path).update('count', admin.FieldValue.increment(1)));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    await waitFor(() => {
      expect(result.current.data).toEqual({ count: 2 });
    });
  });

  it('should get non-existing doc', async () => {
    const { result } = renderHook(() => useDoc(`${collName}/no-exist`, { db }));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.snapshot).toBeTruthy();
      expect(result.current.data).toBeUndefined();
    });
  });

  it('should handle no permission', async () => {
    for (const cache of [RefCache.liveServer, RefCache.one]) {
      const { result } = renderHook(() => useDoc('invalid/no-permission', { db, cache }));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeTruthy();
        expect(result.current.data).toBeUndefined();
      });
    }
  });

  it('should only get local cache', async () => {
    const path = `${collName}/cache-only`;
    const payload = { cached: 'old' };
    await admin.db.doc(path).set(payload);

    // set local cache
    const { result } = renderHook(() => useDoc(path, { db, cache: RefCache.oneCacheOrServer }));
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual(payload);
    });

    await act(() => admin.db.doc(path).set({ cached: 'new' }));

    const { result: offline } = renderHook(() => useDoc(path, { db, cache: RefCache.oneCache }));
    await waitFor(() => {
      expect(offline.current.isLoading).toBe(false);
      expect(offline.current.error).toBeNull();
      expect(offline.current.data).toEqual(payload);
      expect(offline.current.snapshot?.metadata.fromCache).toBe(true);
    });
  });

  it('should handle unavailable cache-only', async () => {
    const { result } = renderHook(() =>
      useDoc(`${collName}/no-cache`, { db, cache: RefCache.oneCache })
    );
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeTruthy();
      expect(result.current.data).toBeUndefined();
    });
  });

  it('should get local cache and can skip server', async () => {
    const path = `${collName}/cache-or-server`;
    const payload = { cached: 'old' };
    const options = { db, cache: RefCache.oneCacheOrServer };
    await admin.db.doc(path).set(payload);

    const { result: server } = renderHook(() => useDoc(path, options));

    await waitFor(() => {
      expect(server.current.isLoading).toBe(false);
      expect(server.current.error).toBeNull();
      expect(server.current.data).toEqual(payload);
      expect(server.current.snapshot?.metadata.fromCache).toBe(false);
    });

    // set live data to be different
    await act(() => admin.db.doc(path).update('cached', 'new'));

    const { result } = renderHook(() => useDoc(path, options));

    // should still return cached data
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.data).toEqual(payload);
      expect(result.current.snapshot?.metadata.fromCache).toBe(true);
    });
  });

  it('should refetch when retried', async () => {
    const path = `${collName}/retry`;
    const payload = { count: 0 };

    await admin.db.doc(path).set(payload);

    const { result } = renderHook(() => useDoc(path, { db, cache: RefCache.one }));
    await waitFor(() => {
      expect(result.current.data).toEqual(payload);
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await admin.db.doc(path).update('count', admin.FieldValue.increment(1));
      result.current.retry();
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual({ count: 1 });
    });
  });
});
