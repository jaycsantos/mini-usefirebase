import type { FirebaseApp } from 'firebase/app';
import { type ReactNode } from 'react';
import { FirebaseAppContext } from '../hooks/useFirebase';

interface FirebaseProviderProps {
  children: ReactNode;
  app: FirebaseApp;
}

export const FirebaseProvider = ({ children, app }: FirebaseProviderProps) => {
  return <FirebaseAppContext.Provider value={{ app }}>{children}</FirebaseAppContext.Provider>;
};
