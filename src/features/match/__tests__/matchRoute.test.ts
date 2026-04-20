import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '@/app/api/match/route';

vi.mock('next/headers', () => ({ cookies: vi.fn() }));
vi.mock('@/shared/api/supabaseFetch', () => ({ supabaseFetch: vi.fn() }));
vi.mock('@/shared/api/openAiFetch', () => ({ openAiFetch: vi.fn() }));
vi.mock('@/shared/utils/authCookies', () => ({ getAuthCookie: vi.fn() }));
vi.mock('@/shared/utils/session', () => ({ verifySession: vi.fn() }));

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

const mockMatchResult = {
  id: 1,
  user_id: 1,
  radar_chart: {
    repetition: 80,
    interpersonal: 60,
    physical: 40,
    hand_detail: 70,
    env_sensitivity: 50,
  },
  summary_text: '사무직에 적합합니다.',
  top3_jobs: [
    {
      rank: 1,
      job_name: '데이터 입력원',
      match_pct: 90,
      fit_level: '잘 맞아요',
    },
    {
      rank: 2,
      job_name: '전화상담원',
      match_pct: 75,
      fit_level: '도전해볼 수 있어요',
    },
    { rank: 3, job_name: '포장원', match_pct: 55, fit_level: '힘들 수 있어요' },
  ],
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const mockProfile = {
  id: 1,
  user_id: 1,
  name: '홍길동',
  gender: '남성',
  education: '고등학교 졸업',
  region_primary: '서울특별시 강남구',
  region_secondary: null,
  is_barrier_free: false,
  disability_type: ['지체'],
  disability_level: '3급',
  mobility: '자유로움',
  hand_usage: '양손 가능',
  stamina: '보통',
  communication: '원활',
  instruction_level: '독립 수행',
  hope_activities: ['사무'],
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const validAiResponse = JSON.stringify({
  radar_chart: {
    repetition: 80,
    interpersonal: 60,
    physical: 40,
    hand_detail: 70,
    env_sensitivity: 50,
  },
  summary_text: '사무직에 적합합니다.',
  top3_jobs: [
    {
      rank: 1,
      job_name: '데이터 입력원',
      match_pct: 90,
      fit_level: '잘 맞아요',
    },
    {
      rank: 2,
      job_name: '전화상담원',
      match_pct: 75,
      fit_level: '도전해볼 수 있어요',
    },
    { rank: 3, job_name: '포장원', match_pct: 55, fit_level: '힘들 수 있어요' },
  ],
});

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
