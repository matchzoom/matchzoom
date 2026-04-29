import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('next/cache', () => ({
  unstable_cache: <T extends (...args: unknown[]) => unknown>(fn: T) => fn,
}));
vi.mock('next/headers', () => ({ cookies: vi.fn() }));
vi.mock('@/shared/api/supabaseFetch', () => ({ supabaseFetch: vi.fn() }));
vi.mock('@/shared/utils/authCookies', () => ({ getAuthCookie: vi.fn() }));
vi.mock('@/shared/utils/session', () => ({ verifySession: vi.fn() }));

import { GET } from '@/app/api/job-postings/route';
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

// 회사A: score 3 (잘 맞아요), 수원시
// 회사B: score 2 (도전해볼 수 있어요), 성남시
// 회사C: score 0 (도전해볼 수 있어요), 수원시
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
        <envStndWalk>장시간 서서 일하기 어려움</envStndWalk>
      </item>
      <item>
        <rno>3</rno>
        <busplaName>회사C</busplaName>
        <jobNm>청소원</jobNm>
        <compAddr>경기도 수원시 영통구</compAddr>
        <empType>정규직</empType>
        <salary>2,200,000</salary>
        <salaryType>월급</salaryType>
        <termDate>20260101~20260531</termDate>
        <reqCareer>신입</reqCareer>
        <reqEduc>고졸</reqEduc>
        <regagnName>한국장애인고용공단 경기지사</regagnName>
      </item>
    </items>
  </body>
</response>`;

const JOB_XML_EMPTY = `<?xml version="1.0" encoding="UTF-8"?>
<response><body><totalCount>0</totalCount><items></items></body></response>`;

const mockProfileRow = {
  mobility: '도보 이동 가능',
  hand_usage: '세밀한 작업 가능',
  stamina: '4시간 이상 활동 가능',
  communication: '일상 대화 가능',
  region_primary: '경기도 수원시',
};

const makeRequest = (qs = '') =>
  new Request(`http://localhost/api/job-postings${qs}`, { method: 'GET' });

const mockFetchWith = (xml: string) =>
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(xml),
    }),
  );

describe('GET /api/job-postings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('JOB_API_BASE_URL', 'https://api.example.com/jobs');
    vi.stubEnv('JOB_API_KEY', 'test-key');
    mockFetchWith(JOB_XML_MULTI);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('기본 파라미터로 페이지(items + nextCursor)를 반환한다', async () => {
    mockAuth('1');
    mockSupabaseFetch
      .mockResolvedValueOnce([mockProfileRow])
      .mockResolvedValueOnce([]);

    const res = await GET(makeRequest());
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data).toHaveProperty('items');
    expect(data).toHaveProperty('nextCursor');
    expect(Array.isArray(data.items)).toBe(true);
    // 3개 모두 limit=12 안에 들어가므로 마지막 페이지
    expect(data.items).toHaveLength(3);
    expect(data.nextCursor).toBeNull();
    // 점수 정렬: A → B → C
    expect(data.items[0].companyName).toBe('회사A');
    expect(data.items[0].fitLevel).toBe('잘 맞아요');
  });

  it('cursor + limit으로 슬라이스하고 nextCursor를 반환한다', async () => {
    mockAuth('1');
    mockSupabaseFetch
      .mockResolvedValueOnce([mockProfileRow])
      .mockResolvedValueOnce([]);

    const res = await GET(makeRequest('?cursor=0&limit=2'));
    const data = await res.json();
    expect(data.items).toHaveLength(2);
    expect(data.items[0].companyName).toBe('회사A');
    expect(data.items[1].companyName).toBe('회사B');
    expect(data.nextCursor).toBe(2);
  });

  it('마지막 페이지에서 nextCursor는 null이다', async () => {
    mockAuth('1');
    mockSupabaseFetch
      .mockResolvedValueOnce([mockProfileRow])
      .mockResolvedValueOnce([]);

    const res = await GET(makeRequest('?cursor=2&limit=2'));
    const data = await res.json();
    expect(data.items).toHaveLength(1);
    expect(data.items[0].companyName).toBe('회사C');
    expect(data.nextCursor).toBeNull();
  });

  it('sigungu 필터: 시군구 일치 항목만 반환한다', async () => {
    mockAuth('1');
    mockSupabaseFetch
      .mockResolvedValueOnce([mockProfileRow])
      .mockResolvedValueOnce([]);

    const res = await GET(makeRequest('?sigungu=수원시'));
    const data = await res.json();
    expect(data.items).toHaveLength(2);
    expect(
      data.items.map((p: { companyName: string }) => p.companyName),
    ).toEqual(['회사A', '회사C']);
  });

  it('fitLevel 필터: 적합도 일치 항목만 반환한다', async () => {
    mockAuth('1');
    mockSupabaseFetch
      .mockResolvedValueOnce([mockProfileRow])
      .mockResolvedValueOnce([]);

    const res = await GET(
      makeRequest('?fitLevel=' + encodeURIComponent('잘 맞아요')),
    );
    const data = await res.json();
    expect(data.items).toHaveLength(1);
    expect(data.items[0].companyName).toBe('회사A');
  });

  it('정의되지 않은 fitLevel 값은 무시한다', async () => {
    mockAuth('1');
    mockSupabaseFetch
      .mockResolvedValueOnce([mockProfileRow])
      .mockResolvedValueOnce([]);

    const res = await GET(makeRequest('?fitLevel=invalid'));
    const data = await res.json();
    expect(data.items).toHaveLength(3);
  });

  it('프로필 없으면 지역 필터링 없이 모든 항목을 반환한다', async () => {
    mockAuth('1');
    mockSupabaseFetch.mockResolvedValueOnce([]).mockResolvedValueOnce([]);

    const res = await GET(makeRequest());
    const data = await res.json();
    expect(data.items).toHaveLength(3);
  });

  it('북마크된 공고는 bookmarked: true로 반환한다', async () => {
    // 첫 호출에서 회사A의 detailUrl을 받아 두 번째 호출에서 북마크 처리
    mockAuth('1');
    mockSupabaseFetch
      .mockResolvedValueOnce([mockProfileRow])
      .mockResolvedValueOnce([]);
    const firstRes = await GET(makeRequest());
    const firstData = await firstRes.json();
    const targetUrl = firstData.items.find(
      (p: { companyName: string }) => p.companyName === '회사A',
    ).detailUrl;

    mockAuth('1');
    mockSupabaseFetch
      .mockResolvedValueOnce([mockProfileRow])
      .mockResolvedValueOnce([{ posting_url: targetUrl }]);

    const res = await GET(makeRequest());
    const data = await res.json();
    const bookmarked = data.items.find(
      (p: { bookmarked: boolean; companyName: string }) => p.bookmarked,
    );
    expect(bookmarked?.companyName).toBe('회사A');
  });

  it('공고가 없으면 빈 페이지를 반환한다', async () => {
    mockFetchWith(JOB_XML_EMPTY);
    mockAuth('1');
    mockSupabaseFetch
      .mockResolvedValueOnce([mockProfileRow])
      .mockResolvedValueOnce([]);

    const res = await GET(makeRequest());
    const data = await res.json();
    expect(data.items).toEqual([]);
    expect(data.nextCursor).toBeNull();
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

  it('환경변수 없으면 500을 반환한다', async () => {
    mockAuth('1');
    vi.unstubAllEnvs();

    const res = await GET(makeRequest());
    expect(res.status).toBe(500);
  });

  it('외부 API 오류 시 500을 반환한다', async () => {
    mockAuth('1');
    mockSupabaseFetch
      .mockResolvedValueOnce([mockProfileRow])
      .mockResolvedValueOnce([]);
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('외부 API 오류')),
    );

    const res = await GET(makeRequest());
    expect(res.status).toBe(500);
  });
});
