import { act, renderHook, waitFor } from '@testing-library/react';
import { useAuthState } from '@/authentication/useAuthState';
import { signInWithCustomToken, User, UserCredential } from 'firebase/auth';
import { auth, admin } from './helpers';

describe('useAuthUser', () => {
  let userCred: UserCredential;
  let token: string;

  beforeAll(async () => {
    const record = await admin.createUser({
      email: 'test@example.com',
      // phoneNumber: '+11234567890',
      emailVerified: true,
      password: 'newPassword',
      displayName: 'Juan dela Cruz',
    });
    token = await admin.createCustomToken(record.uid);

    userCred = await signInWithCustomToken(auth, token);
  });
  afterAll(async () => {
    if (userCred) await admin.deleteUser(userCred.user.uid);
  });
  afterEach(async () => {
    if (auth.currentUser) await act(() => auth.signOut());
  });

  describe('authenticated', () => {
    beforeEach(async () => {
      await signInWithCustomToken(auth, token);
    });

    it('should handle sign out', async () => {
      const onChange = vi.fn();
      const { result } = renderHook(() => useAuthState({ onChange }));

      await waitFor(() => {
        expect(result.current.user).toBeTruthy();
        expect(result.current.error).toBeNull();
        expect(onChange).toHaveBeenCalledWith(result.current.user);
      });

      await act(() => auth.signOut());

      await waitFor(() => {
        expect(result.current.user).toBeNull();
        expect(result.current.error).toBeNull();
        expect(onChange).toHaveBeenCalledWith(null);
      });
    });
  });

  describe('unauthenticated', () => {
    beforeEach(async () => {
      if (auth.currentUser) await act(() => auth.signOut());
    });

    it('should handle sign in', async () => {
      const onChange = vi.fn();
      const { result } = renderHook(() => useAuthState({ onChange }));

      await waitFor(() => {
        expect(result.current.user).toBeNull();
        expect(result.current.error).toBeNull();
        expect(onChange).toHaveBeenCalledWith(null);
      });

      await act(() => signInWithCustomToken(auth, token));

      await waitFor(() => {
        expect(result.current.user).toBeTruthy();
        expect(result.current.error).toBeNull();
        expect(onChange).toHaveBeenCalledWith(result.current.user);
      });
    });
  });

  // it('should return the current user', async () => {
  //   const { result } = renderHook(() => useAuthState());

  //   await waitFor(() => {
  //     expect(result.current.user).toEqual(userCred.user);
  //     expect(result.current.isLoading).toBe(false);
  //     expect(result.current.error).toBeNull();
  //   });
  // });

  // it('should handle auth state changes', async () => {
  //   const mockOnChange = vi.fn((user: User) => {
  //     console.log('user', user);
  //   });
  //   const { result } = renderHook(() => useAuthState({ onChange: mockOnChange }));

  //   await waitFor(() => {
  //     expect(result.current.user).toEqual(userCred.user);
  //     expect(result.current.isLoading).toBe(false);
  //     expect(result.current.error).toBeNull();
  //   });

  //   await act(async () => {
  //     await admin.updateUser(userCred.user.uid, { displayName: 'Maria Makiling' });
  //     await delay(1000);
  //   });

  //   await waitFor(() => {
  //     expect(mockOnChange).toHaveBeenCalledOnce();
  //     expect(result.current.user.displayName).toEqual('Maria Makiling');
  //   });
  // });

  // it('should handle auth state changes', async () => {
  //   const mockOnChange = vi.fn();
  //   const { result } = renderHook(() => useAuthUser({ onChange: mockOnChange }));
  //   const newUser = { uid: '456', email: 'new@example.com' };

  //   act(() => {
  //     const nextOrObserve = (
  //       onAuthStateChanged as unknown as MockInstance<typeof onAuthStateChanged>
  //     ).mock.calls[0][1];
  //     if ('next' in nextOrObserve) {
  //       nextOrObserve.next(newUser as User);
  //     } else {
  //       nextOrObserve(newUser as User);
  //     }
  //   });

  //   await waitFor(() => {
  //     expect(mockOnChange).toHaveBeenCalledWith(newUser);
  //     expect(result.current.user).toEqual(newUser);
  //   });
  // });

  // it('should handle errors', async () => {
  //   const err = new Error('Test error');
  //   const { result } = renderHook(() => useAuthUser());

  //   act(() => {
  //     const args = (onAuthStateChanged as unknown as MockInstance<typeof onAuthStateChanged>).mock
  //       .calls[0];
  //     const nextOrObserve = args[1];
  //     if ('error' in nextOrObserve) {
  //       nextOrObserve.error(err);
  //     } else if (args[2]) {
  //       args[2](err);
  //     }
  //   });

  //   await waitFor(async () => {
  //     expect(result.current.error).toEqual(err);
  //     expect(result.current.isLoading).toBe(false);
  //   });
  // });
});
