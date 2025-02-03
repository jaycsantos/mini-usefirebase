import { Prettify, WithFirebaseApp } from '@/common/types';
import { useFirebase } from '@/useFirebase';
import { Database, getDatabase } from 'firebase/database';

export type WithDatabase = Prettify<
  WithFirebaseApp & {
    /** firebase database instance to use or database url */
    database?: Database | string;
  }
>;

export function useDatabase(options?: WithDatabase) {
  const app = useFirebase(options);
  const db = options?.database;
  return db instanceof Database ? db : getDatabase(app, typeof db == 'string' ? db : undefined);
}
