import { describe, expect, it, vi } from 'vitest';
import { useFunctions } from '@/functions/useFunctions';
import { renderHook } from '@testing-library/react';
import { Functions, getFunctions } from 'firebase/functions';
import { deleteApp, initializeApp } from 'firebase/app';

vi.mock('firebase/functions', () => ({
  getFunctions: vi.fn(),
}));

describe('useFunctions', () => {
  const app = initializeApp({ apiKey: 'mock', projectId: 'mock' });

  afterEach(() => vi.resetAllMocks());
  afterAll(() => {
    deleteApp(app);
    vi.restoreAllMocks();
  });

  it('should return default functions instance', () => {
    const { result } = renderHook(() => useFunctions());
    expect(getFunctions).toHaveBeenCalled();
    expect(result.current).toBe(getFunctions());
  });

  it('should use provided functions instance', () => {
    const functions = { app } as Functions;
    const { result } = renderHook(() => useFunctions({ functions }));
    expect(result.current).toBe(functions);
    expect(getFunctions).not.toHaveBeenCalled();
  });
});
