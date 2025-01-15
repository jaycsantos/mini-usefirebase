import { FirebaseApp } from 'firebase/app';
import { useMemo } from 'react';
import { getAnalytics } from 'firebase/analytics';
import { useFirebase } from './useFirebase';

export interface AnalyticsOptions {
  app: FirebaseApp;
}

export function useAnalytics(options?: AnalyticsOptions) {
  const firebase = useFirebase();
  const app = options?.app ?? firebase();
  const analytics = useMemo(() => getAnalytics(app), [app]);
  return analytics;
}
