import { FirebaseApp } from 'firebase/app';
import { useFirebase } from './useFirebase';
import { useMemo } from 'react';
import { getAuth } from 'firebase/auth';

export interface AuthenticationOptions {
  app: FirebaseApp;
}

export function useAuthentication(options?: AuthenticationOptions) {
  const app = options?.app ?? useFirebase();
  const auth = useMemo(() => getAuth(app), [app]);
  return auth;
}
