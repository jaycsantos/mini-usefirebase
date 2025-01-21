import { renderHook } from '@testing-library/react';
import { doc, DocumentData, DocumentReference } from 'firebase/firestore';
import { describe, expect, it } from 'vitest';
import { useDocRef } from '../../src/firestore/useDocRef';
import { db } from './helpers';

describe('useDocRef', () => {
  it('should memoize docRef from path', async () => {
    const { result, rerender } = renderHook(() => useDocRef('test/1', { db }));

    const docRef = result.current;
    rerender();
    expect(result.current).toBe(docRef);
  });

  it('should update docRef when path changes', async () => {
    const { result, rerender } = renderHook<
      DocumentReference,
      Parameters<typeof useDocRef<DocumentData>>
    >((props) => useDocRef(...props), { initialProps: ['test/1', { db }] });

    const docRef = result.current;
    rerender(['test/2', { db }]);
    expect(result.current).not.toBe(docRef);
  });

  it('should memoize docRef from another DocumentReference', async () => {
    const { result, rerender } = renderHook(() => useDocRef(doc(db, 'test/1')));

    const docRef = result.current;
    rerender();
    expect(result.current).toBe(docRef);
  });

  it('should update docRef when props DocumentReference changes', async () => {
    const { result, rerender } = renderHook<DocumentReference, DocumentReference>(
      (props) => useDocRef(props),
      { initialProps: doc(db, 'test/1') }
    );

    const docRef = result.current;
    rerender(doc(db, 'test/2'));
    expect(result.current).not.toBe(docRef);
  });
});
