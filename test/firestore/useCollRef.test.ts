import { renderHook } from '@testing-library/react';
import { collection, Query, QueryConstraint, where } from 'firebase/firestore';
import { describe, expect, it, vi } from 'vitest';
import { useCollRef } from '../../src/firestore/useCollRef';
import { db } from './helpers';

vi.mock('@/useFirestore');

describe('useCollRef', () => {
  it('should create a collection reference with a single constraint', () => {
    const collName = 'users';
    const constraint: QueryConstraint = where('age', '>', 18);

    const { result } = renderHook(() => useCollRef(collName, constraint, { firestore: db }));

    expect(result.current).toBeInstanceOf(Query);
  });

  it('should create a collection reference with multiple constraints', () => {
    const collName = 'users';
    const constraints: QueryConstraint[] = [where('age', '>', 18), where('active', '==', true)];

    const { result } = renderHook(() => useCollRef(collName, constraints, { firestore: db }));

    expect(result.current).toBeInstanceOf(Query);
  });

  it('should create a collection reference from an existing reference', () => {
    const baseColl = collection(db, 'users');
    const constraint: QueryConstraint = where('active', '==', true);

    const { result } = renderHook(() => useCollRef(baseColl, constraint));

    expect(result.current).toBeInstanceOf(Query);
  });

  it('should memoize the query reference', () => {
    const collName = 'users';
    const constraint: QueryConstraint = where('age', '>', 18);

    const { result, rerender } = renderHook(() =>
      useCollRef(collName, constraint, { firestore: db })
    );

    const queryRef = result.current;
    rerender();
    expect(result.current).toBe(queryRef);
  });

  it('should update the query reference when constraints change', () => {
    const collName = 'users';
    const constraint1: QueryConstraint = where('age', '>', 18);
    const constraint2: QueryConstraint = where('age', '<', 30);

    const { result, rerender } = renderHook(
      ({ constraints }) => useCollRef(collName, constraints, { firestore: db }),
      {
        initialProps: { constraints: constraint1 },
      }
    );

    const queryRef = result.current;
    rerender({ constraints: constraint2 });
    expect(result.current).not.toBe(queryRef);
  });
});
