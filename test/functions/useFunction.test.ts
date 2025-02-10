import { useFunction } from '@/functions/useFunction';
import { act, renderHook, waitFor } from '@testing-library/react';
import { functions, host, port } from './helpers';

describe('useFunction', () => {
  describe('with a named function', () => {
    it('should call successfully', { timeout: 10000 }, async () => {
      const value = { test: 'test' };
      const { result } = renderHook(() => useFunction('sdkCallable', { functions }));

      expect(result.current.isLoading).toBe(false);

      act(() => result.current.invoke(value));

      expect(result.current.isLoading).toBe(true);

      await waitFor(
        () => {
          expect(result.current.isLoading).toBe(false);
          expect(result.current.error).toBeNull();
          expect(result.current.result).toEqual(value);
        },
        { timeout: 9000 }
      );
    });

    it('should handle error', { timeout: 10000 }, async () => {
      const { result } = renderHook(() => useFunction('sdkCallable', { functions }));

      act(() => result.current.invoke('error'));

      await waitFor(
        () => {
          expect(result.current.isLoading).toBe(false);
          expect(result.current.error).toBeTruthy();
        },
        { timeout: 9000 }
      );
    });

    it('should handle non-existing function', { timeout: 10000 }, async () => {
      const { result } = renderHook(() => useFunction('non-existing', { functions }));

      act(() => result.current.invoke('error'));

      await waitFor(
        () => {
          expect(result.current.isLoading).toBe(false);
          expect(result.current.error).toBeTruthy();
        },
        { timeout: 9000 }
      );
    });
  });

  describe('with a URL', () => {
    const url = `http://${host}:${port}/${functions.app.options.projectId}/us-central1/httpCallable`;

    it('should call successfully', { timeout: 10000 }, async () => {
      const value = { test: 'test' };
      const { result } = renderHook(() => useFunction(url, { functions }));

      expect(result.current.isLoading).toBe(false);

      act(() => result.current.invoke(value));

      expect(result.current.isLoading).toBe(true);

      await waitFor(
        () => {
          expect(result.current.isLoading).toBe(false);
          expect(result.current.error).toBeNull();
          expect(result.current.result).toEqual(value);
        },
        { timeout: 9000 }
      );
    });

    it('should handle error', { timeout: 10000 }, async () => {
      const { result } = renderHook(() => useFunction(url, { functions }));

      act(() => result.current.invoke('error'));

      await waitFor(
        () => {
          expect(result.current.isLoading).toBe(false);
          expect(result.current.error).toBeTruthy();
        },
        { timeout: 9000 }
      );
    });

    it('should handle invalid url', { timeout: 10000 }, async () => {
      const { result } = renderHook(() => useFunction('https://example.com/test', { functions }));

      act(() => result.current.invoke('error'));

      await waitFor(
        () => {
          expect(result.current.isLoading).toBe(false);
          expect(result.current.error).toBeTruthy();
        },
        { timeout: 9000 }
      );
    });
  });
});
