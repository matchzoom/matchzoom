import { isRecord } from '@/shared/utils/errorGuards';

type ApiError = Error & {
  status: number;
  code?: string;
};

type AbortError = { name: 'AbortError' };

const isAbortError = (error: unknown): error is AbortError => {
  if (!isRecord(error)) return false;
  return error.name === 'AbortError';
};

export const coreFetch = async <T>(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = 10_000,
): Promise<T> => {
  const isFormData =
    typeof FormData !== 'undefined' && options.body instanceof FormData;

  const controller = new AbortController();
  const headers = new Headers(options.headers);
  let abortedByTimeout = false;

  if (isFormData) {
    headers.delete('Content-Type');
  } else if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  let abortHandler: (() => void) | undefined;

  if (options.signal) {
    abortHandler = () => controller.abort();
    if (options.signal.aborted) {
      controller.abort();
    } else {
      options.signal.addEventListener('abort', abortHandler);
    }
  }

  const timeoutId = setTimeout(() => {
    abortedByTimeout = true;
    controller.abort();
  }, timeoutMs);

  let response: Response;

  try {
    response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers,
    });
  } catch (error) {
    if (isAbortError(error)) {
      if (abortedByTimeout)
        throw new Error('요청 시간이 초과되었습니다. 다시 시도해주세요.', {
          cause: error,
        });
      throw new Error('요청이 취소되었습니다.', { cause: error });
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
    if (options.signal && abortHandler) {
      options.signal.removeEventListener('abort', abortHandler);
    }
  }

  if (!response.ok) {
    const errorData: { message?: string; code?: string } = await response
      .json()
      .catch(() => ({}));
    const error = new Error(
      errorData.message ?? 'API 요청 중 오류가 발생했습니다.',
    ) as ApiError;
    error.status = response.status;
    error.code = errorData.code;
    throw error;
  }

  return response.status === 204 ? (undefined as T) : response.json();
};
