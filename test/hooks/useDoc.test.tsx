import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useDoc } from '../../src/hooks/firestore/useDoc';
import { FirebaseProvider } from '../../src/components/FirebaseProvider';
import { readFileSync } from 'fs';
import {
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import React from 'react';
import { FirebaseFirestore } from '@firebase/firestore-types';
import { FirebaseApp } from '@firebase/app-compat';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { FirestoreSource } from '../../src/types';

describe('useDoc', () => {
  let testEnv: RulesTestEnvironment;
  let db: FirebaseFirestore;
  let wrapper: React.FC<{ children: React.ReactNode }>;
  let app: FirebaseApp;

  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'usefirebase-dbe87',
      firestore: {
        host: 'localhost',
        port: 8080,
        rules: readFileSync('firestore.rules', 'utf8'),
      },
    });

    db = testEnv.unauthenticatedContext().firestore();
    app = testEnv.authenticatedContext('vitest').firestore().app;
    connectFirestoreEmulator(
      getFirestore(app),
      testEnv.emulators.firestore!.host,
      testEnv.emulators.firestore!.port
    );
    wrapper = ({ children }) => <FirebaseProvider app={app}>{children}</FirebaseProvider>;
  });

  afterEach(async () => {
    vi.clearAllMocks();
  });

  afterAll(async () => {
    await testEnv.clearFirestore();
    await testEnv.cleanup();
  });

  it('should get document data', async () => {
    const path = 'test/getDoc';
    const testData = { name: 'basic getDoc' };

    await assertSucceeds(db.doc(path).set(testData));

    const { result } = renderHook(() => useDoc(path), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.snapshot?.data()).toEqual(testData);
    });
  });

  it('should listen to real-time updates', async () => {
    const path = 'test/real-time';
    const { result } = renderHook(() => useDoc(path, { listen: true }), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      await assertSucceeds(db.doc(path).set({ count: 1 }));
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.data).toEqual({ count: 1 });
    });

    await act(async () => {
      await assertSucceeds(db.doc(path).set({ count: 2 }));
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.data).toEqual({ count: 2 });
    });

    await act(async () => {
      await assertSucceeds(db.doc(path).delete());
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.data).toBeUndefined();
    });
  });

  it('should get non-existing doc', async () => {
    const { result } = renderHook(() => useDoc('test/non-existing'), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.data).toBeUndefined();
    });
  });

  it('should handle no permission', async () => {
    const { result } = renderHook(() => useDoc('invalid/no-permission'), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeTruthy();
      expect(result.current.data).toBeUndefined();
    });
  });

  it('should only get local cache', async () => {
    const path = 'test/cache';
    await assertSucceeds(db.doc(path).set({ cached: true }));

    const { result: live } = renderHook(() => useDoc(path), { wrapper });
    await waitFor(() => {
      expect(live.current.isLoading).toBe(false);
    });

    await act(async () => {
      // set live data to be different
      await assertSucceeds(db.doc(path).set({ cached: false }));
    });

    const { result } = renderHook(
      () => useDoc(path, { src: FirestoreSource.cacheOnly }),
      {
        wrapper,
      }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.data).toEqual({ cached: true });
      expect(result.current.snapshot?.metadata.fromCache).toBe(true);
    });
  });

  it('should handle unavailable cache-only', async () => {
    const { result } = renderHook(
      () => useDoc('test/not', { src: FirestoreSource.cacheOnly }),
      {
        wrapper,
      }
    );
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeTruthy();
      expect(result.current.data).toBeUndefined();
    });
  });

  it('should get local cache and can skip server', async () => {
    const path = 'test/cache-or-server';
    await assertSucceeds(db.doc(path).set({ cached: true }));

    const { result: server } = renderHook(
      () => useDoc(path, { src: FirestoreSource.cacheOrServer }),
      {
        wrapper,
      }
    );

    await waitFor(() => {
      expect(server.current.isLoading).toBe(false);
      expect(server.current.error).toBeNull();
      expect(server.current.data).toEqual({ cached: true });
      expect(server.current.snapshot?.metadata.fromCache).toBe(false);
    });

    await act(async () => {
      // set live data to be different
      await assertSucceeds(db.doc(path).set({ cached: false }));
    });

    const { result } = renderHook(
      () => useDoc(path, { src: FirestoreSource.cacheOrServer }),
      {
        wrapper,
      }
    );

    // should still return cached data
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.data).toEqual({ cached: true });
      expect(result.current.snapshot?.metadata.fromCache).toBe(true);
    });
  });

  it('should take custom app', async () => {
    const path = 'test/customApp';
    const testData = { path };
    const app = testEnv.authenticatedContext('vitest').firestore().app;
    // need to connect to emulator
    connectFirestoreEmulator(
      getFirestore(app),
      testEnv.emulators.firestore!.host,
      testEnv.emulators.firestore!.port
    );

    await assertSucceeds(db.doc(path).set(testData));

    const { result } = renderHook(() => useDoc(path, { app }), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.snapshot?.data()).toEqual(testData);
    });
  });

  it('should take custom db', async () => {
    const path = 'test/customDb';
    const testData = { path };
    const app = testEnv.authenticatedContext('vitest').firestore().app;
    // need to connect to emulator
    connectFirestoreEmulator(
      getFirestore(app),
      testEnv.emulators.firestore!.host,
      testEnv.emulators.firestore!.port
    );

    await assertSucceeds(db.doc(path).set(testData));

    const { result } = renderHook(() => useDoc(path, { db: getFirestore(app) }), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.snapshot?.data()).toEqual(testData);
    });
  });
});
