import { Prettify, WithAsyncState, WithFirebaseApp } from '@/common/types';
import { Auth, User } from 'firebase/auth';

/**
 * @inline
 * @ignore
 */
export type AuthOptions = Prettify<
  WithFirebaseApp & {
    /** Auth instance */
    auth?: Auth;
  }
>;

/**
 * @inline
 * @ignore
 */
export type AsyncUser = Prettify<
  Readonly<
    WithAsyncState & {
      /** Auth user instance */
      user: User | null;
    }
  >
>;
