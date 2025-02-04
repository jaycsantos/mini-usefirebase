import { Prettify, WithFirebaseApp } from '@/common/types';
import { Database, ListenOptions } from 'firebase/database';

/**
 * @internal
 * @inline
 **/
export type WithDatabase = Prettify<
  WithFirebaseApp & {
    /** firebase database instance to use or database url */
    database?: Database | string;
  }
>;

/**
 * @internal
 * @inline
 **/
export type DatabaseOptions = Prettify<WithDatabase & {}>;

/**
 * Options for related Realtime Database hooks.
 * @interface DataOptions<T>
 *
 * @see
 * - {@link useData}
 *
 * @group Database
 * @category Interfaces
 */
export type DataOptions = Prettify<DatabaseOptions & ListenOptions>;
