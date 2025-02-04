import { renderHook, waitFor } from '@testing-library/react';
import { orderByChild, ref } from 'firebase/database';
import { act } from 'react';
import { useDataChild } from '../../src/database/useOnChild';
import { useQueryRef } from '../../src/database/useQueryRef';
import { admin, database } from './helpers';

describe('useDataChild', () => {
  const testPath = 'test/useDataChild';
  const testRef = ref(database, testPath);
  const adminRef = admin.ref(testPath);

  beforeEach(() => adminRef.set({}));
  afterEach(() => adminRef.set(testPath, null));
  afterAll(() => adminRef.remove());

  it('should handle child added', async () => {
    const key = 'childAdd';
    const onAdd = vi.fn();
    const onError = vi.fn();
    renderHook(() => useDataChild(testRef, { onAdd, onError }));

    await act(() => adminRef.child(key).set(key));

    await waitFor(() => {
      expect(onAdd).toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
    });
  });

  it('should handle child changed', async () => {
    const key = 'childChange';
    adminRef.child(key).set(key);
    const onChange = vi.fn();
    const onError = vi.fn();
    renderHook(() => useDataChild(testRef, { onChange, onError }));

    await act(() => adminRef.child(key).set('updated'));

    await waitFor(() => {
      expect(onChange).toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
    });
  });

  it('should handle child removed', async () => {
    const key = 'childRemove';
    adminRef.child(key).set(key);
    const onRemove = vi.fn();
    const onError = vi.fn();
    renderHook(() => useDataChild(testRef, { onRemove, onError }));

    await act(() => adminRef.child(key).remove());

    await waitFor(() => {
      expect(onRemove).toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
    });
  });

  it('should handle child moved', async () => {
    const key1 = 'childMove1',
      key2 = 'childMove2';
    adminRef.child(key1).set({ value: key1, priority: 1 });
    adminRef.child(key2).set({ value: key2, priority: 2 });

    const onMove = vi.fn();
    const onError = vi.fn();
    renderHook(() =>
      useDataChild(useQueryRef(testRef, orderByChild('priority')), { onMove, onError })
    );

    await act(() => adminRef.child(key1).set({ value: key1, priority: 3 }));

    await waitFor(() => {
      expect(onMove).toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
    });
  });
});
