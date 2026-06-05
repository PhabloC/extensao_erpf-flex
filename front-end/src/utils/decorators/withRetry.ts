interface RetryOptions {
  retries?: number;
  delayMs?: number;
  shouldRetry?: (error: unknown, attempt: number) => boolean;
}

type AsyncCallback<TArgs extends unknown[], TResult> = (...args: TArgs) => Promise<TResult>;

const wait = async (delayMs: number) => {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, delayMs);
  });
};

export function withRetry<TArgs extends unknown[], TResult>(
  callback: AsyncCallback<TArgs, TResult>,
  options: RetryOptions = {},
): AsyncCallback<TArgs, TResult> {
  const { retries = 1, delayMs = 0, shouldRetry = () => true } = options;

  return async (...args: TArgs) => {
    let lastError: unknown;

    for (let attempt = 0; attempt <= retries; attempt += 1) {
      try {
        return await callback(...args);
      } catch (error) {
        lastError = error;

        if (attempt === retries || !shouldRetry(error, attempt + 1)) {
          break;
        }

        if (delayMs > 0) {
          await wait(delayMs);
        }
      }
    }

    if (lastError instanceof Error) {
      throw lastError;
    }

    throw new Error('Retry execution failed.');
  };
}
