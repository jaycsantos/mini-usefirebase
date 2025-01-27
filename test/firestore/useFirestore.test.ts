import { renderHook } from '@testing-library/react';
import { deleteApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { useFirestore } from '../../src/firestore/useFirestore';

describe('useFirestore', () => {
  beforeAll(() => {
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

  afterEach(async () => {
    for (const app of getApps()) {
      await deleteApp(app);
    }
  });

  it('should return the default firestore instance when no options are provided', () => {
    initializeApp({ apiKey: 'mock', projectId: 'mock' });
    const { result } = renderHook(() => useFirestore());
    expect(getFirestore).toHaveBeenCalled();
    expect(result.current).toBe(getFirestore());
  });

  it('should return the firestore instance for the provided app', () => {
    const app = initializeApp({ apiKey: 'another', projectId: 'another' }, 'another');
    const { result } = renderHook(() => useFirestore({ app }));

    expect(getFirestore).toHaveBeenCalledWith(app);
    expect(result.current).toBe(getFirestore(app));
  });

  it('should return the firestore instance for the provided app name', () => {
    const name = 'namedApp';
    const app = initializeApp({ apiKey: name, projectId: name }, name);
    const { result } = renderHook(() => useFirestore({ app: name }));

    expect(getFirestore).toHaveBeenCalledWith(app);
    expect(result.current).toBe(getFirestore(app));
  });
});
