import { coreFetch } from './coreFetch';
import { isApiError } from '@/shared/utils/errorGuards';

const BASE_URL = '/api';

let refreshPromise: Promise<void> | null = null;

const refreshTokenInternal = async (): Promise<void> => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      await coreFetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

/**
 * Next.js BFF(/api/*) 호출용 fetch 래퍼.
 *
 * - HttpOnly 쿠키를 항상 포함 (credentials: 'include')
 * - 401 발생 시 /api/auth/refresh로 토큰 갱신 후 재시도
 * - 갱신 실패 시 루트(/)로 이동
 */
export const bffFetch = async <T>(
  endpoint: string,
  options: RequestInit,
  timeoutMs?: number,
): Promise<T> => {
  const url = BASE_URL + endpoint;
  const requestOptions: RequestInit = { ...options, credentials: 'include' };

  try {
    return await coreFetch<T>(url, requestOptions, timeoutMs);
  } catch (err) {
    if (!isApiError(err) || err.status !== 401) throw err;
    if (endpoint.startsWith('/auth')) throw err;

    try {
      await refreshTokenInternal();
      return await coreFetch<T>(url, requestOptions, timeoutMs);
    } catch (refreshError) {
      if (isApiError(refreshError) && refreshError.status === 401) {
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      }
      throw err;
    }
  }
};
