export default function cancellable<T>(promise: Promise<T>) {
  let isCancelled = false;

  const wrap: typeof promise = new Promise((resolve, reject) => {
    promise
      .then((value) => !isCancelled && resolve(value))
      .catch((error) => !isCancelled && reject(error));
  });

  return {
    promise: wrap,
    cancel() {
      isCancelled = true;
    },
  } as const;
}
