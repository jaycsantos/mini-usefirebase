import { FirebaseApp as FirebaseAppCompat } from '@firebase/app-compat';

// export type PartialIf<T, P, U> = T extends P ? Partial<U> : Required<U>;

// export type Optional<T, Keys extends keyof T> = T & Partial<Pick<T, Keys>>;

/**
 * Anything that has reference to a Firebase app instance.
 * @interface WithFirebaseApp
 * @internal
 * @inline
 */
export type WithFirebaseApp = {
  /** The Firebase application instance */
  app: FirebaseAppCompat;
};

/**
 * Anything that has can do asnychronous operations.
 * @interface WithAsyncState
 * @param {boolean} isLoading - Whether the operation is currently loading.
 * @param {Error | null} error - Any error that occurred during the operation.
 * @param {() => void} retry - Forces the operation to retry. Clears any previous error and sets isLoading to true.
 *
 * @inline
 * @ignore
 */
export type WithAsyncState = {
  /** Whether the operation is currently loading. */
  isLoading: boolean;
  /** Any error that occurred during the operation. */
  error: Error | null;
  /** Forces the operation to retry. Clears any previous error and sets isLoading to true. */
  retry: () => void;
};
