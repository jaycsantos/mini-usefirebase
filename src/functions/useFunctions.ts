import { useFirebase } from '@/useFirebase';
import { WithFunctions } from './types';
import { getFunctions } from 'firebase/functions';

export function useFunctions(options?: WithFunctions) {
  const app = useFirebase(Object.assign({ app: options?.functions?.app }, options ?? {}));
  return options?.functions ?? getFunctions(app, options?.regionOrCustomDomain);
}
