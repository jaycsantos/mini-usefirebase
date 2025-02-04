import { useFirebase } from '@/useFirebase';
import { getDatabase } from 'firebase/database';
import { WithDatabase } from './types';

/**
 * Hook to get Firebase Realtime Database instance
 *
 * @param options
 * @param options.app - Firebase app instance
 * @param options.database - Existing database instance or Database URL
 * @returns Firebase Realtime Database instance
 *
 * @example
 *
 * ```typescript
 * const db = useDatabase();
 * ```
 *
 * With a custom database URL
 * ```typescript
 * const db = useDatabase({ database: 'https://your-db.firebaseio.com' });
 * ```
 *
 * @group Database
 * @category Hooks
 */
export function useDatabase(options?: WithDatabase) {
  const app = useFirebase(options);
  const db = options?.database;
  return typeof db == 'string' || !db ? getDatabase(app, db) : db;
}
