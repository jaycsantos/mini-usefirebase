import * as React from 'react';
import { renderHook } from '@testing-library/react';
import { FirebaseApp } from '@firebase/app-compat';
import { describe, expect, it } from 'vitest';
import { FirebaseAppContext, useFirebase } from '../src/useFirebase';

describe('useFirebase', () => {
  it('should return the Firebase app instance from context', () => {
    const mockApp = { name: 'mockApp' } as FirebaseApp;
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FirebaseAppContext.Provider value={{ app: mockApp }}>{children}</FirebaseAppContext.Provider>
    );

    const { result } = renderHook(() => useFirebase(), { wrapper });
    expect(result.current()).toBe(mockApp);
  });

  it('should return undefined if used outside of FirebaseAppContext', () => {
    const { result } = renderHook(() => useFirebase());
    expect(result.current()).toBeUndefined();
  });
});
