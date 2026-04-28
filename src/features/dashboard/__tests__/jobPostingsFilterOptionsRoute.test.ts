import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('next/cache', () => ({
  unstable_cache: <T extends (...args: unknown[]) => unknown>(fn: T) => fn,
}));
vi.mock('next/headers', () => ({ cookies: vi.fn() }));
vi.mock('@/shared/api/supabaseFetch', () => ({ supabaseFetch: vi.fn() }));
vi.mock('@/shared/utils/authCookies', () => ({ getAuthCookie: vi.fn() }));
vi.mock('@/shared/utils/session', () => ({ verifySession: vi.fn() }));

import { GET } from '@/app/api/job-postings/filter-options/route';
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

const JOB_XML_MULTI = `<?xml version="1.0" encoding="UTF-8"?>
<response>
  <body>
    <totalCount>3</totalCount>
    <items>
      <item>
        <rno>1</rno>
        <busplaName>회사A</busplaName>
        <jobNm>사무보조원</jobNm>
        <compAddr>경기도 수원시 팔달구</compAddr>
        <empType>정규직</empType>
        <salary>2,000,000</salary>
        <salaryType>월급</salaryType>
        <termDate>20260101~20260531</termDate>
        <reqCareer>신입</reqCareer>
        <reqEduc>고졸</reqEduc>
        <regagnName>한국장애인고용공단 경기지사</regagnName>
        <envStndWalk>장시간 서서 일하기 어려움</envStndWalk>
        <envLstnTalk>의사소통 어려움</envLstnTalk>
      </item>
      <item>
        <rno>2</rno>
        <busplaName>회사B</busplaName>
        <jobNm>경비원</jobNm>
        <compAddr>경기도 성남시 분당구</compAddr>
        <empType>계약직</empType>
        <salary>1,800,000</salary>
        <salaryType>월급</salaryType>
        <termDate>20260101~20260630</termDate>
        <reqCareer>경력</reqCareer>
        <reqEduc>고졸</reqEduc>
        <regagnName>한국장애인고용공단 경기지사</regagnName>
      </item>
    </items>
  </body>
</response>`;

const mockProfileRow = {
  mobility: '도보 이동 가능',
  hand_usage: '세밀한 작업 가능',
  stamina: '4시간 이상 활동 가능',
  communication: '일상 대화 가능',
  region_primary: '경기도 수원시',
};

const makeRequest = () =>
  new Request('http://localhost/api/job-postings/filter-options', {
    method: 'GET',
  });

describe('GET /api/job-postings/filter-options', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('JOB_API_BASE_URL', 'https://api.example.com/jobs');
    vi.stubEnv('JOB_API_KEY', 'test-key');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(JOB_XML_MULTI),
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('전체 풀에서 sigunguList와 fitLevels를 반환한다', async () => {
    mockAuth('1');
    mockSupabaseFetch
      .mockResolvedValueOnce([mockProfileRow])
      .mockResolvedValueOnce([]);

    const res = await GET(makeRequest());
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.sigunguList).toEqual(['성남시', '수원시']);
    // 적합도는 정의된 순서로 반환: '잘 맞아요' → '도전해볼 수 있어요'
    expect(data.fitLevels).toEqual(['잘 맞아요', '도전해볼 수 있어요']);
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
