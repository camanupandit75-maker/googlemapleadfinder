const DEFAULT_RETRY_DELAY_MS = 2000;

/**
 * Run an auth function with retries. Auth function should return { data, error }.
 * @param {() => Promise<{ data?: any; error?: Error }>} authFn
 * @param {{ maxRetries?: number; retryDelayMs?: number; onRetry?: (attempt: number) => void }} options
 * @returns {Promise<{ data: any }>}
 */
export async function authWithRetry(authFn, options = {}) {
  const { maxRetries = 3, retryDelayMs = DEFAULT_RETRY_DELAY_MS, onRetry } = options;
  let lastError;
  for (let i = 0; i <= maxRetries; i++) {
    try {
      const result = await authFn();
      if (result.error) throw result.error;
      return result;
    } catch (err) {
      lastError = err;
      if (i === maxRetries) throw err;
      onRetry?.(i + 1);
      await new Promise((r) => setTimeout(r, retryDelayMs));
    }
  }
  throw lastError;
}

export function isNetworkError(err) {
  const msg = (err?.message || String(err)).toLowerCase();
  return (
    msg.includes("fetch") ||
    msg.includes("network") ||
    msg.includes("failed to fetch") ||
    err?.name === "TypeError"
  );
}
