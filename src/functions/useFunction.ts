import useAsyncState from '@/common/useAsyncState';
import { noop } from '@/utils/noop';
import { httpsCallable, httpsCallableFromURL } from 'firebase/functions';
import { useEffect, useState } from 'react';
import { FunctionOptions } from './types';
import { useFunctions } from './useFunctions';

/**
 * A React hook that provides an interface to call Firebase Cloud Functions.
 *
 * @template RequestData - The type of data sent to the function
 * @template ResponseData - The type of data received from the function
 * @template StreamData - The type of data received in stream mode
 *
 * @param nameOrUrl - The name of the Cloud Function or its complete URL. If null, the operation is stopped
 * @param options - Configuration options for the function call
 * @param options.timeout - Maximum time to wait for the function to complete
 * @param options.limitedUseAppCheckTokens - Whether to use limited-use App Check tokens
 * @param options.onStream - Callback function to handle streamed data
 *
 * @returns An object containing:
 * - result: The response data from the function
 * - isLoading: Boolean indicating if the function is currently executing
 * - error: Any error that occurred during execution
 * - invoke: Function to call the Cloud Function normally
 * - stream: Function to call the Cloud Function in stream mode
 *
 * @example
 * ```typescript
 * const { result, isLoading, error, invoke } = useFunction<RequestType, ResponseType>('functionName');
 * // ...
 *
 * return <Button disabled={isLoading} onClick={()=>invoke({ data: 'example' })}>Call Function</Button>
 * ```
 *
 * @group CloudFunctions
 * @category Hooks
 */
export function useFunction<RequestData = unknown, ResponseData = unknown, StreamData = unknown>(
  nameOrUrl: string | null,
  options?: FunctionOptions<StreamData>
) {
  const functions = useFunctions(options);
  const { timeout, limitedUseAppCheckTokens, onStream } = options ?? {};
  const { value: result, isLoading, error, startAsync, stopAsync } = useAsyncState<ResponseData>();

  const [invokers, setInvokers] = useState<{
    invoke: (data?: RequestData | null) => void;
    stream: (data?: RequestData | null) => void;
  }>({ invoke: noop, stream: noop });

  useEffect(() => {
    if (!nameOrUrl) {
      stopAsync();
      return;
    }

    const fn = /^https?:\/\//.test(nameOrUrl) ? httpsCallableFromURL : httpsCallable;
    const options = { timeout, limitedUseAppCheckTokens };
    const callable = fn<RequestData, ResponseData, StreamData>(functions, nameOrUrl, options);

    const ctrl = new AbortController();
    const signal = ctrl.signal;

    setInvokers({
      invoke: (data?: RequestData | null) =>
        startAsync(async (setValue) => {
          const res = await callable(data);
          setValue(res.data);
        }),
      stream: (data?: RequestData | null) =>
        startAsync(async (setValue) => {
          const res = await callable.stream(data, { limitedUseAppCheckTokens, signal });
          setValue(await res.data);
          if (onStream) {
            for await (const data of res.stream) {
              onStream(data);
            }
          } else {
            ctrl.abort();
          }
        }),
    });

    return () => ctrl.abort();
  }, [
    functions,
    nameOrUrl,
    timeout,
    limitedUseAppCheckTokens,
    onStream,
    setInvokers,
    startAsync,
    stopAsync,
  ]);

  return { result, isLoading, error, ...invokers } as const;
}
