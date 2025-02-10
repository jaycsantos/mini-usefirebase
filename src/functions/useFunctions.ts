import { useFirebase } from '@/useFirebase';
import { WithFunctions } from './types';
import { getFunctions } from 'firebase/functions';

/**
 * Hook to get Firebase Functions instance
 * @param options - Optional configuration for Firebase Functions
 * @param options.functions - Existing Functions instance to use instead of creating a new one
 * @param options.app - Firebase app instance associated with the Functions instance
 * @param options.regionOrCustomDomain - Optional region or custom domain for Functions
 * @returns Firebase Functions instance
 *
 * @example
 *
 * ```typescript
 * const functions = useFunctions();
 * ```
 *
 * With a custom region
 * ```typescript
 * const functions = useFunctions({ regionOrCustomDomain: 'us-central1' });
 * ```
 *
 * @group CloudFunctions
 * @category Hooks
 */
export function useFunctions(options?: WithFunctions) {
  const app = useFirebase(Object.assign({ app: options?.functions?.app }, options ?? {}));
  return options?.functions ?? getFunctions(app, options?.regionOrCustomDomain);
}
