import useAsyncState from '@/common/useAsyncState';
import { noop } from '@/utils/noop';
import { httpsCallable, httpsCallableFromURL } from 'firebase/functions';
import { useEffect, useState } from 'react';
import { FunctionOptions } from './types';
import { useFunctions } from './useFunctions';

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
