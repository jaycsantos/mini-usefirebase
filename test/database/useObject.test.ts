import { act, renderHook, waitFor } from '@testing-library/react';
import { afterAll, describe, expect, it } from 'vitest';
import { useObject } from '../../src/database/useObject';
import { admin, database } from './helpers';

describe('useObject', () => {
  const baseObj = 'test';

  beforeAll(async () => admin.ref(baseObj).set({}));
  afterAll(async () => admin.ref(baseObj).remove());

  it('should return snapshot, data, isLoading and error', async () => {
    const path = `${baseObj}/get`;
    const payload = { name: 'get' };

    await admin.ref(path).set(payload);

    const { result } = renderHook(() => useObject(path, { database }));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.snapshot).toBeTruthy();
      expect(result.current.snapshot.val()).toEqual(payload);
    });
  });

  it('should return stopped state if null path', async () => {
    const { result } = renderHook(() => useObject(null));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.snapshot).toBeNull();
    });
  });

  it('should listen to real-time updates as default', async () => {
    const path = `${baseObj}/realtime`;
    const payload = { count: 1 };
    await admin.ref(path).set(payload);

    const { result } = renderHook(() => useObject(path, { database }));

    await waitFor(() => {
      expect(result.current.snapshot.val()).toEqual(payload);
    });

    await act(() => admin.ref(path).update({ count: 2 }));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    await waitFor(() => {
      expect(result.current.snapshot.val()).toEqual({ count: 2 });
    });
  });

  it('should get non-existing object', async () => {
    const { result } = renderHook(() => useObject(`${baseObj}/no-exist`, { database }));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.snapshot).toBeTruthy();
      expect(result.current.snapshot.val()).toBeNull();
    });
  });

  it('should refetch when retried', async () => {
    const path = `${baseObj}/retry`;
    const payload = { count: 0 };

    await admin.ref(path).set(payload);

    const { result } = renderHook(() => useObject(path, { database }));
    await waitFor(() => {
      expect(result.current.snapshot.val()).toEqual(payload);
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await admin.ref(path).update({ count: 1 });
      result.current.retry();
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.snapshot.val()).toEqual({ count: 1 });
    });
  });
});
