import { FirebaseApp as FirebaseAppCompat } from '@firebase/app-compat';

// export type PartialIf<T, P, U> = T extends P ? Partial<U> : Required<U>;

// export type Optional<T, Keys extends keyof T> = T & Partial<Pick<T, Keys>>;

/**
 * Anything that has reference to a Firebase app instance.
 * @interface WithFirebaseApp
 * @internal
 */
export type WithFirebaseApp = {
  /** The Firebase application instance */
  app: FirebaseAppCompat;
};

/**
 * Anything that has can do asnychronous operations.
 * @interface WithAsyncState
 * @internal
 */
export type WithAsyncState = {
  /// Whether the operation is currently loading.
  isLoading: boolean;
  /// Any error that occurred during the operation.
  error: Error | null;
  /// Forces the operation to retry. Clears any previous error and sets isLoading to true.
  retry: () => void;
};
