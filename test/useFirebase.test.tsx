import * as React from 'react';
import { renderHook } from '@testing-library/react';
import { FirebaseApp } from '@firebase/app-compat';
import { describe, expect, it } from 'vitest';
import { FirebaseAppContext, useFirebase } from '../src/useFirebase';
import { deleteApp, getApps, initializeApp } from 'firebase/app';

describe('useFirebase', () => {
  afterEach(async () => {
    for (const app of getApps()) {
      await deleteApp(app);
    }
  });

  it('should return the Firebase app instance from context', () => {
    const mockApp = { name: 'mockApp' } as FirebaseApp;
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FirebaseAppContext.Provider value={{ app: mockApp }}>{children}</FirebaseAppContext.Provider>
    );

    const { result } = renderHook(() => useFirebase(), { wrapper });
    expect(result.current).toBe(mockApp);
  });

  it('should throw error if no default firebase app', () => {
    expect(() => renderHook(() => useFirebase())).toThrowError();
  });

  it('should return default firebase app', () => {
    const app = initializeApp({ apiKey: 'mock', projectId: 'mock' });
    const { result } = renderHook(() => useFirebase());
    expect(result.current).toBe(app);
  });
});
