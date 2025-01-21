import { Prettify, WithAsyncState, WithFirebaseApp } from '@/common/types';
import { Auth, User } from 'firebase/auth';

export type WithAuth = {
  auth: Auth;
};

export type AuthOptions = Prettify<Partial<WithAuth & WithFirebaseApp>>;

export type AsyncUser = Prettify<
  WithAsyncState & {
    user: User | null;
  }
>;
