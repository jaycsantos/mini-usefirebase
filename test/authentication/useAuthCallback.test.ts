import { useAuthCallback } from '@/authentication/useAuthCallback';
import { act, renderHook, waitFor } from '@testing-library/react';
import { Auth } from 'firebase/auth';
import { delay } from 'helper';

describe('useAuthCallback', () => {
  const mockCallback = vi.fn(async (auth: Auth, ...args: Array<string>) => {
    await delay(1);
    return args.join('_');
  });

  beforeAll(() => {
    vi.mock('@/authentication/useAuth', () => ({
      useAuth: vi.fn(() => ({
        authStateReady: vi.fn(async () => true),
      })),
    }));
  });
  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('should invoke callback and set result', async () => {
    const onResult = vi.fn();
    const { result } = renderHook(() => useAuthCallback(mockCallback, { onResult }));

    await act(async () => {
      result.current.invoke('a', 'b');
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
      expect(mockCallback).toHaveBeenCalledOnce();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.result).toBe('a_b');
      expect(result.current.error).toBeNull();
      expect(onResult).toHaveBeenCalledWith('a_b');
    });
  });

  it('should handle errors', async () => {
    const error = new Error('Test error');
    mockCallback.mockRejectedValueOnce(error);

    const onResult = vi.fn();
    const { result } = renderHook(() => useAuthCallback(mockCallback, { onResult }));

    await act(async () => {
      result.current.invoke('arg1', 'arg2');
    });

    await waitFor(() => {
      expect(result.current.error).toBe(error);
      expect(result.current.result).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(onResult).toHaveBeenCalledWith(undefined, error);
    });
  });
});
