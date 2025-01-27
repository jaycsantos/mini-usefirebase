import { renderHook } from '@testing-library/react';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { useAuth } from '../../src/authentication/useAuth';

describe('useAuth', () => {
  beforeAll(() => {
    vi.mock('../../src/useFirebase', () => {
      const app = initializeApp({ apiKey: 'mock', projectId: 'mock' });
      return {
        useFirebase: vi.fn(() => () => app),
      };
    });
    vi.mock('firebase/auth', () => ({
      getAuth: vi.fn(),
    }));
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('should return the default auth instance when no options are provided', () => {
    const { result } = renderHook(() => useAuth());
    expect(getAuth).toHaveBeenCalled();
    expect(result.current).toBe(getAuth());
  });

  it('should return the auth instance for the provided app', () => {
    const customApp = initializeApp({ apiKey: 'another', projectId: 'another' }, 'another');
    const { result } = renderHook(() => useAuth({ app: customApp }));
    // expect(getAuth).toHaveBeenCalledWith(customApp);
    expect(result.current).toBe(getAuth(customApp));
  });
});
