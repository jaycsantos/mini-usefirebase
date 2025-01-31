import { act, renderHook, waitFor } from '@testing-library/react';
import { RefCache } from '@/firestore/types';
import { useColl } from '@/firestore/useColl';
import { admin, db } from './helpers';

describe('useColl', () => {
  const collName = 'useColl';
  const data: Array<{ value: number }> = [];

  beforeAll(async () => {
    const collRef = admin.db.collection(collName);
    const batch = admin.db.batch();
    for (let i = 0; i < 2; i++) {
      const payload = { value: i };
      data.push(payload);
      batch.create(collRef.doc(i.toString()), payload);
    }
    await batch.commit();
  });

  afterAll(async () => await admin.deleteCollection(collName));

  it('should return snapshot, data, isLoading, and error', async () => {
    const { result } = renderHook(() =>
      useColl(collName, [], { firestore: db, cache: RefCache.one })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual(data);
      expect(result.current.error).toBeNull();
      expect(result.current.snapshot).toBeTruthy();
    });
  });

  it('should listen to real-time updates as default', async () => {
    const { result } = renderHook(() => useColl(collName, [], { firestore: db }));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.snapshot?.size).toEqual(data.length);
    });

    const id = `${data.length}`;
    const payload = { value: data.length };

    await act(async () => {
      await admin.db.doc(`${collName}/${id}`).create(payload);
      data.push(payload);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    await waitFor(() => {
      expect(result.current.snapshot?.size).toEqual(data.length);
    });
  });

  it('should be retriable', async () => {
    const { result } = renderHook(() =>
      useColl(collName, [], { firestore: db, cache: RefCache.one })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual(data);
      expect(result.current.error).toBeNull();
      expect(result.current.snapshot).toBeTruthy();
    });

    act(() => {
      result.current.retry();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });
});
