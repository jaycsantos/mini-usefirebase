import { FirebaseApp } from 'firebase/app';

export type PartialIf<T, P, U> = T extends P ? Partial<U> : Required<U>;

// export type Optional<T, Keys extends keyof T> = T & Partial<Pick<T, Keys>>;

/**
 * Anything that has reference to a Firebase app instance.
 * @interface WithFirebaseApp
 *
 * @inline
 * @ignore
 */
export type WithFirebaseApp = {
  /** Firebase App instance or app name */
  app?: FirebaseApp | string;
};

/**
 * Anything that has can do asnychronous operations.
 * @interface WithAsyncState
 * @param {boolean} isLoading - Whether the operation is currently loading.
 * @param {Error | null} error - Any error that occurred during the operation.
 *
 * @inline
 * @ignore
 */
export type WithAsyncState = {
  /** Whether the operation is currently loading. */
  isLoading: boolean;
  /** Any error that occurred during the operation. */
  error: Error | null;
};

/**
 * The same with {@link WithAsyncState} but with a retriable.
 * @interface WithRetryAsyncState
 * @param {() => void} retry - Forces the operation to retry. Clears any previous error and sets isLoading to true.
 *
 * @inline
 * @ignore
 */
export type WithRetryAsyncState = WithAsyncState & {
  /** Forces the operation to retry. Clears any previous error and sets isLoading to true. */
  retry: () => void;
};

/**
 * VSCode expand type alias
 *
 * Credits to https://twitter.com/mattpocockuk/status/1653403198885904387
 *
 * @interface Prettify
 * @inline
 * @ignore
 */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
