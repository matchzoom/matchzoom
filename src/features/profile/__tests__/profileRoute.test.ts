import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/profiles/route';

vi.mock('next/headers', () => ({ cookies: vi.fn() }));
vi.mock('@/shared/api/supabaseFetch', () => ({ supabaseFetch: vi.fn() }));
vi.mock('@/shared/utils/authCookies', () => ({ getAuthCookie: vi.fn() }));
vi.mock('@/shared/utils/session', () => ({ verifySession: vi.fn() }));

import { supabaseFetch } from '@/shared/api/supabaseFetch';
import { getAuthCookie } from '@/shared/utils/authCookies';
import { verifySession } from '@/shared/utils/session';

const mockSupabaseFetch = vi.mocked(supabaseFetch);
const mockGetAuthCookie = vi.mocked(getAuthCookie);
const mockVerifySession = vi.mocked(verifySession);

const mockAuth = (userId: string | null) => {
  if (userId) {
    mockGetAuthCookie.mockResolvedValue('token');
    mockVerifySession.mockResolvedValue({ userId });
  } else {
    mockGetAuthCookie.mockResolvedValue(undefined);
    mockVerifySession.mockResolvedValue(null);
  }
};

const makeRequest = () =>
  new Request('http://localhost/api/profiles', { method: 'GET' });

describe('GET /api/profiles', () => {
  beforeEach(() => vi.clearAllMocks());

  it('프로필을 조회한다', async () => {
    mockAuth('1');
    const profile = { id: 1, user_id: 1, name: '홍길동' };
    mockSupabaseFetch.mockResolvedValue([profile]);

    const res = await GET(makeRequest());
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.name).toBe('홍길동');
  });

  it('프로필이 없으면 null을 반환한다', async () => {
    mockAuth('1');
    mockSupabaseFetch.mockResolvedValue([]);

    const res = await GET(makeRequest());
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data).toBeNull();
  });

  it('쿠키 없으면 401을 반환한다', async () => {
    mockAuth(null);

    const res = await GET(makeRequest());
    expect(res.status).toBe(401);
  });

  it('Supabase 오류 시 500을 반환한다', async () => {
    mockAuth('1');
    mockSupabaseFetch.mockRejectedValue(new Error('DB 오류'));

    const res = await GET(makeRequest());
    expect(res.status).toBe(500);
  });
});
