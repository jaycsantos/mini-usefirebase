import { Prettify, WithFirebaseApp } from '@/common/types';
import { Functions, HttpsCallableOptions } from 'firebase/functions';

/**
 * @ignore
 * @inline
 */
export type WithFunctions = Prettify<
  WithFirebaseApp & {
    /** Cloud Functions instance */
    functions?: Functions;
    /** @see https://firebase.google.com/docs/reference/js/functions.md#getfunctions_60f2095 */
    regionOrCustomDomain?: string;
  }
>;

/**
 * @ignore
 * @inline
 */
export type FunctionOptions<StreamData = unknown> = Prettify<
  WithFunctions &
    HttpsCallableOptions & {
      /** Callback when streaming a function */
      onStream?: ((data: Awaited<StreamData>) => void) | null;
    }
>;
