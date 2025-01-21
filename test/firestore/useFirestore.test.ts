import { renderHook } from '@testing-library/react';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { useFirestore } from '../../src/firestore/useFirestore';

describe('useFirestore', () => {
  beforeAll(() => {
    vi.mock('../../src/useFirebase', () => {
      return {
        useFirebase: vi.fn(() => () => initializeApp({ apiKey: 'mock', projectId: 'mock' })),
      };
    });
    vi.mock('firebase/firestore', () => ({
      getFirestore: vi.fn(),
    }));
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return the default firestore instance when no options are provided', () => {
    const { result } = renderHook(() => useFirestore()());
    expect(getFirestore).toHaveBeenCalled();
    expect(result.current).toBe(getFirestore());
  });

  it('should return the firestore instance for the provided app', () => {
    const customApp = initializeApp({ apiKey: 'another', projectId: 'another' }, 'another');
    const { result } = renderHook(() => useFirestore({ app: customApp })());
    expect(getFirestore).toHaveBeenCalledWith(customApp);
    expect(result.current).toBe(getFirestore(customApp));
  });
});
