import { coreFetch } from './coreFetch';

/**
 * Supabase REST API 호출용 fetch 래퍼.
 * BFF Route Handler(src/app/api/) 안에서만 사용한다.
 *
 * - Secret key를 apikey + Authorization 헤더에 주입
 * - RLS 없음 → Secret key로 전체 접근 (서버에서 user_id 필터링으로 제어)
 */
export const supabaseFetch = async <T>(
  endpoint: string, // e.g. '/rest/v1/users?id=eq.1'
  options: RequestInit = {},
  timeoutMs?: number,
): Promise<T> => {
  const BASE_URL = process.env.SUPABASE_URL;
  const SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

  if (!BASE_URL || !SECRET_KEY) {
    throw new Error(
      'Supabase 환경 변수 누락 (SUPABASE_URL, SUPABASE_SECRET_KEY)',
    );
  }

  const headers = new Headers(options.headers);
  headers.set('apikey', SECRET_KEY);
  headers.set('Authorization', `Bearer ${SECRET_KEY}`);

  return coreFetch<T>(BASE_URL + endpoint, { ...options, headers }, timeoutMs);
};
