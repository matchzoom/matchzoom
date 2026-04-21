import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/profiles/route';

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

const validBody = {
  name: '홍길동',
  gender: '남성',
  education: '고등학교 졸업',
  region_primary: '서울특별시',
  disability_type: '지체',
  disability_level: '3급',
  mobility: '자유로움',
  hand_usage: '양손 가능',
  stamina: '보통',
  communication: '원활',
  instruction_level: '독립 수행',
  hope_activities: ['사무'],
};

const makeRequest = (body: unknown) =>
  new Request('http://localhost/api/profiles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

describe('POST /api/profiles', () => {
  beforeEach(() => vi.clearAllMocks());

  it('유효한 body로 프로필을 생성한다', async () => {
    mockAuth('1');
    mockSupabaseFetch.mockResolvedValue([{ id: 1, user_id: 1, ...validBody }]);

    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(200);
  });

  it('쿠키 없으면 401을 반환한다', async () => {
    mockAuth(null);

    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(401);
  });

  it('필수 필드 누락 시 400을 반환한다', async () => {
    mockAuth('1');

    const res = await POST(makeRequest({ name: '' }));
    expect(res.status).toBe(400);
  });

  it('Supabase 오류 시 500을 반환한다', async () => {
    mockAuth('1');
    mockSupabaseFetch.mockRejectedValue(new Error('DB 오류'));

    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(500);
  });
});
