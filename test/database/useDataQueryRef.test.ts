import { useDataQueryRef } from '@/database/useDataQueryRef';
import { renderHook } from '@testing-library/react';
import { equalTo, orderByChild, query, QueryConstraint, ref } from 'firebase/database';
import { database } from './helpers';

describe('useQuery', () => {
  it('should memoize query reference with a single constraint', () => {
    const path = 'users';
    const constraint: QueryConstraint = orderByChild('age');

    const { result, rerender } = renderHook(() => useDataQueryRef(path, constraint, { database }));

    const queryRef = result.current;
    rerender();
    expect(result.current).toBe(queryRef);
  });

  it('should memoize query reference with multiple constraints', () => {
    const path = 'users';
    const constraints: QueryConstraint[] = [orderByChild('age'), equalTo(true, 'active')];

    const { result, rerender } = renderHook(() => useDataQueryRef(path, constraints, { database }));

    const queryRef = result.current;
    rerender();
    expect(result.current).toBe(queryRef);
  });

  it('should memoize query reference from an existing reference', () => {
    const baseQuery = query(ref(database, 'users'), orderByChild('age'));
    const constraint: QueryConstraint = equalTo(true, 'active');

    const { result, rerender } = renderHook(() => useDataQueryRef(baseQuery, constraint));

    const queryRef = result.current;
    rerender();
    expect(result.current).toBe(queryRef);
  });

  it('should update the query reference when constraints change', () => {
    const path = 'users';
    const constraint1: QueryConstraint = orderByChild('age');
    const constraint2: QueryConstraint = orderByChild('name');

    const { result, rerender } = renderHook(
      ({ constraints }) => useDataQueryRef(path, constraints, { database }),
      {
        initialProps: { constraints: constraint1 },
      }
    );

    const queryRef = result.current;
    rerender({ constraints: constraint2 });
    expect(result.current).not.toBe(queryRef);
  });

  it('should return null if path is empty', async () => {
    const { result } = renderHook(() => useDataQueryRef('', []));
    expect(result.current).toBeNull();
  });
});
