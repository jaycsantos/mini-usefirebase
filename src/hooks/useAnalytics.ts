import { FirebaseApp } from 'firebase/app';
import { useFirebase } from './useFirebase';
import { useMemo } from 'react';
import { getAnalytics } from 'firebase/analytics';

export interface AnalyticsOptions {
  app: FirebaseApp;
}

export function useAnalytics(options?: AnalyticsOptions) {
  const app = options?.app ?? useFirebase();
  const db = useMemo(() => getAnalytics(app), [app]);
  return db;
}
