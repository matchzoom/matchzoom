import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GET } from '@/app/api/job-postings/route';

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

const JOB_XML_ONE_ITEM = `<?xml version="1.0" encoding="UTF-8"?>
<response>
  <body>
    <totalCount>1</totalCount>
    <numOfRows>100</numOfRows>
    <pageNo>1</pageNo>
    <items>
      <item>
        <rno>1</rno>
        <busplaName>테스트 회사</busplaName>
        <jobNm>사무보조원</jobNm>
        <compAddr>경기도 수원시 팔달구</compAddr>
        <empType>정규직</empType>
        <salary>2,000,000</salary>
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

const JOB_XML_MIXED_REGIONS = `<?xml version="1.0" encoding="UTF-8"?>
<response>
  <body>
    <totalCount>2</totalCount>
    <numOfRows>100</numOfRows>
    <pageNo>1</pageNo>
    <items>
      <item>
        <rno>1</rno>
        <busplaName>경기 회사</busplaName>
        <jobNm>사무보조원</jobNm>
        <compAddr>경기도 수원시 팔달구</compAddr>
        <empType>정규직</empType>
        <salary>2,000,000</salary>
        <salaryType>월급</salaryType>
        <termDate>20260101~20260531</termDate>
        <reqCareer>신입</reqCareer>
        <reqEduc>고졸</reqEduc>
        <regagnName>한국장애인고용공단 경기지사</regagnName>
      </item>
      <item>
        <rno>2</rno>
        <busplaName>서울 회사</busplaName>
        <jobNm>사무보조원</jobNm>
        <compAddr>서울특별시 강남구</compAddr>
        <empType>정규직</empType>
        <salary>2,000,000</salary>
        <salaryType>월급</salaryType>
        <termDate>20260101~20260531</termDate>
        <reqCareer>신입</reqCareer>
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

const makeRequest = (search = '') =>
  new Request(`http://localhost/api/job-postings${search}`, { method: 'GET' });

const mockFetchWith = (xml: string) =>
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({ ok: true, text: () => Promise.resolve(xml) }),
  );

describe('GET /api/job-postings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('JOB_API_BASE_URL', 'https://api.example.com/jobs');
    vi.stubEnv('JOB_API_KEY', 'test-key');
    mockFetchWith(JOB_XML_ONE_ITEM);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('페이지네이션 응답 형태로 공고를 반환한다', async () => {
    mockAuth('1');
    mockSupabaseFetch
      .mockResolvedValueOnce([mockProfileRow])
      .mockResolvedValueOnce([]);

    const res = await GET(makeRequest());
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data).toHaveProperty('items');
    expect(data).toHaveProperty('hasMore');
    expect(data).toHaveProperty('offset');
    expect(data).toHaveProperty('filterOptions');
    expect(Array.isArray(data.items)).toBe(true);
    expect(data.items[0]).toMatchObject({
      companyName: '테스트 회사',
      title: '사무보조원',
      salary: '2,000,000원 (월급)',
    });
    expect(data.offset).toBe(0);
  });

  it('filterOptions에 시군구·적합도 목록이 포함된다', async () => {
    mockAuth('1');
    mockSupabaseFetch
      .mockResolvedValueOnce([mockProfileRow])
      .mockResolvedValueOnce([]);

    const res = await GET(makeRequest());
    const data = await res.json();
    expect(data.filterOptions.sigunguList).toContain('수원시');
    expect(Array.isArray(data.filterOptions.fitLevelList)).toBe(true);
  });

  it('sigunguList는 유저 프로필의 province로 시작하는 공고만 포함한다', async () => {
    mockFetchWith(JOB_XML_MIXED_REGIONS);
    mockAuth('1');
    mockSupabaseFetch
      .mockResolvedValueOnce([mockProfileRow])
      .mockResolvedValueOnce([]);

    const res = await GET(makeRequest());
    const data = await res.json();
    expect(data.filterOptions.sigunguList).toContain('수원시');
    expect(data.filterOptions.sigunguList).not.toContain('강남구');
  });

  it('limit 파라미터를 적용한다', async () => {
    mockAuth('1');
    mockSupabaseFetch
      .mockResolvedValueOnce([mockProfileRow])
      .mockResolvedValueOnce([]);

    const res = await GET(makeRequest('?offset=0&limit=12'));
    const data = await res.json();
    expect(data.items.length).toBeLessThanOrEqual(12);
  });

  it('sigungu 필터를 적용한다', async () => {
    mockAuth('1');
    mockSupabaseFetch
      .mockResolvedValueOnce([mockProfileRow])
      .mockResolvedValueOnce([]);

    const res = await GET(makeRequest('?sigungu=다른시'));
    const data = await res.json();
    expect(data.items).toEqual([]);
  });

  it('프로필 없으면 필터링 없이 목록을 반환한다', async () => {
    mockAuth('1');
    mockSupabaseFetch.mockResolvedValueOnce([]).mockResolvedValueOnce([]);

    const res = await GET(makeRequest());
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(Array.isArray(data.items)).toBe(true);
  });

  it('북마크된 공고는 bookmarked: true로 반환한다', async () => {
    const detailUrl = `https://www.work24.go.kr/wk/a/b/1700/themeEmpInfoSrchList.do?thmaHrplCd=F00036&resultCnt=10&searchMode=Y&currentPageNo=1&pageIndex=1&sortField=DATE&sortOrderBy=DESC&srcKeyword=${encodeURIComponent('테스트 회사')}#s27xov`;

    mockAuth('1');
    mockSupabaseFetch
      .mockResolvedValueOnce([mockProfileRow])
      .mockResolvedValueOnce([{ posting_url: detailUrl }]);

    const res = await GET(makeRequest());
    expect(res.status).toBe(200);

    const data = await res.json();
    const bookmarked = data.items.find(
      (p: { bookmarked: boolean }) => p.bookmarked,
    );
    expect(bookmarked).toBeDefined();
  });

  it('공고가 없으면 items가 빈 배열이다', async () => {
    mockFetchWith(JOB_XML_EMPTY);
    mockAuth('1');
    mockSupabaseFetch
      .mockResolvedValueOnce([mockProfileRow])
      .mockResolvedValueOnce([]);

    const res = await GET(makeRequest());
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.items).toEqual([]);
    expect(data.hasMore).toBe(false);
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
