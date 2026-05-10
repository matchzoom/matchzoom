import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '@/app/api/match/route';
import {
  mockMatchResult,
  mockProfile,
  validAiResponse,
} from './match.fixtures';

vi.mock('next/headers', () => ({ cookies: vi.fn() }));
vi.mock('@/shared/api/supabaseFetch', () => ({ supabaseFetch: vi.fn() }));
vi.mock('@/shared/api/openAiFetch', () => ({ openAiFetch: vi.fn() }));
vi.mock('@/shared/utils/authCookies', () => ({ getAuthCookie: vi.fn() }));
vi.mock('@/shared/utils/session', () => ({ verifySession: vi.fn() }));
vi.mock('@/features/match/api/worknetApi', () => ({
  getCachedWorknetData: vi.fn().mockResolvedValue([]),
}));
vi.mock('@/features/match/utils/buildSummaryText', () => ({
  buildSummaryText: vi.fn().mockResolvedValue('사무직에 적합합니다.'),
}));
vi.mock('next/cache', () => ({
  unstable_cache: (fn: Function) => fn,
}));

import { supabaseFetch } from '@/shared/api/supabaseFetch';
import { openAiFetch } from '@/shared/api/openAiFetch';
import { getAuthCookie } from '@/shared/utils/authCookies';
import { verifySession } from '@/shared/utils/session';

const mockSupabaseFetch = vi.mocked(supabaseFetch);
const mockOpenAiFetch = vi.mocked(openAiFetch);
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

const makeRequest = (method: string) =>
  new Request('http://localhost/api/match', { method });

describe('GET /api/match', () => {
  beforeEach(() => vi.clearAllMocks());

  it('매칭 결과를 조회한다', async () => {
    mockAuth('1');
    mockSupabaseFetch.mockResolvedValue([mockMatchResult]);

    const res = await GET(makeRequest('GET'));
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.summary_text).toBe('사무직에 적합합니다.');
  });

  it('결과 없으면 null을 반환한다', async () => {
    mockAuth('1');
    mockSupabaseFetch.mockResolvedValue([]);

    const res = await GET(makeRequest('GET'));
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data).toBeNull();
  });

  it('쿠키 없으면 401을 반환한다', async () => {
    mockAuth(null);

    const res = await GET(makeRequest('GET'));
    expect(res.status).toBe(401);
  });

  it('Supabase 오류 시 500을 반환한다', async () => {
    mockAuth('1');
    mockSupabaseFetch.mockRejectedValue(new Error('DB 오류'));

    const res = await GET(makeRequest('GET'));
    expect(res.status).toBe(500);
  });
});

describe('POST /api/match', () => {
  beforeEach(() => vi.clearAllMocks());

  it('프로필 조회 → OpenAI 호출 → upsert 후 결과를 반환한다', async () => {
    mockAuth('1');
    mockSupabaseFetch
      .mockResolvedValueOnce([mockProfile])
      .mockResolvedValueOnce([mockMatchResult]);
    mockOpenAiFetch.mockResolvedValue(validAiResponse);

    const res = await POST(makeRequest('POST'));
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.summary_text).toBe('사무직에 적합합니다.');

    expect(mockOpenAiFetch).toHaveBeenCalled();
    expect(mockSupabaseFetch).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('/rest/v1/match_results'),
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('"user_id":1'),
      }),
    );
  });

  it('프로필 없으면 404를 반환한다', async () => {
    mockAuth('1');
    mockSupabaseFetch.mockResolvedValueOnce([]);

    const res = await POST(makeRequest('POST'));
    expect(res.status).toBe(404);
  });

  it('쿠키 없으면 401을 반환한다', async () => {
    mockAuth(null);

    const res = await POST(makeRequest('POST'));
    expect(res.status).toBe(401);
  });

  it('OpenAI 오류 시 500을 반환한다', async () => {
    mockAuth('1');
    mockSupabaseFetch.mockResolvedValueOnce([mockProfile]);
    mockOpenAiFetch.mockRejectedValue(new Error('OpenAI 오류'));

    const res = await POST(makeRequest('POST'));
    expect(res.status).toBe(500);
  });

  it('Supabase upsert 오류 시 500을 반환한다', async () => {
    mockAuth('1');
    mockSupabaseFetch
      .mockResolvedValueOnce([mockProfile])
      .mockRejectedValueOnce(new Error('DB 오류'));
    mockOpenAiFetch.mockResolvedValue(validAiResponse);

    const res = await POST(makeRequest('POST'));
    expect(res.status).toBe(500);
  });
});
