import { useDataRef } from '@/database/useDataRef';
import { renderHook } from '@testing-library/react';
import { DatabaseReference, Query, ref } from 'firebase/database';
import { database } from './helpers';

describe('useDataRef', () => {
  it('should memoize ref from path', () => {
    const { result, rerender } = renderHook(() => useDataRef('test/1', { database }));

    const ref = result.current;
    rerender();
    expect(result.current).toBe(ref);
  });

  it('should update ref when path changes', async () => {
    const { result, rerender } = renderHook<
      DatabaseReference | Query,
      Parameters<typeof useDataRef>
    >((props) => useDataRef(...props), { initialProps: ['test/1', { database }] });

    const docRef = result.current;
    rerender(['test/2', { database }]);
    expect(result.current).not.toBe(docRef);
  });

  it('should memoize docRef from another DocumentReference', async () => {
    const { result, rerender } = renderHook(() => useDataRef(ref(database, 'test/1')));

    const docRef = result.current;
    rerender();
    expect(result.current).toBe(docRef);
  });

  it('should update docRef when props DocumentReference changes', async () => {
    const { result, rerender } = renderHook<DatabaseReference | Query, DatabaseReference | Query>(
      (props) => useDataRef(props),
      { initialProps: ref(database, 'test/1') }
    );

    const docRef = result.current;
    rerender(ref(database, 'test/2'));
    expect(result.current).not.toBe(docRef);
  });

  it('should return null if path is empty', async () => {
    const { result } = renderHook(() => useDataRef(''));
    expect(result.current).toBeNull();
  });
});
