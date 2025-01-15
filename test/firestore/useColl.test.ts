import { RefCache } from '@/firestore/types';
import { act, renderHook, waitFor } from '@testing-library/react';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { useColl } from '@/firestore/useColl';
import { admin, db } from './firestoreHelper';

describe('useColl', () => {
  const collName = 'useColl';
  const data: Array<{ value: number }> = [];

  beforeAll(async () => {
    const collRef = admin.db.collection(collName);
    const batch = admin.db.batch();
    for (let i = 0; i < 10; i++) {
      const payload = { value: i };
      data.push(payload);
      batch.create(collRef.doc(i.toString()), payload);
    }
    await batch.commit();
  });

  afterAll(async () => admin.deleteCollection(collName));

  it('should return snapshot, data, isLoading, and error', async () => {
    const { result } = renderHook(() => useColl(collName, [], { db, cache: RefCache.one }));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.snapshot).toBeTruthy();
      expect(Array.isArray(result.current.data)).toBe(true);
    });
  });

  it('should listen to real-time updates as default', async () => {
    const { result } = renderHook(() => useColl(collName, [], { db }));

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

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.data).toContainEqual(payload);
      expect(result.current.snapshot?.size).toEqual(data.length);
    });
  });
});
