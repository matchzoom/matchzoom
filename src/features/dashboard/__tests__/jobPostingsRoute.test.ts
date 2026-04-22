import { describe, it, expect, vi, beforeEach } from 'vitest';
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

// fast-xml-parser가 숫자 필드를 number로 파싱하므로 XML은 하드코딩 문자열로 고정
const JOB_XML_ONE_ITEM = `<?xml version="1.0" encoding="UTF-8"?>
<response>
  <body>
    <items>
      <item>
        <rno>1</rno>
        <busplaName>테스트 회사</busplaName>
        <jobNm>사무보조원</jobNm>
        <compAddr>경기도 수원시 팔달구</compAddr>
        <empType>정규직</empType>
        <salary>월 2,000,000원</salary>
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
<response><body><items></items></body></response>`;

const mockProfileRow = {
  mobility: '도보 이동 가능',
  hand_usage: '세밀한 작업 가능',
  stamina: '4시간 이상 활동 가능',
  communication: '일상 대화 가능',
  region_primary: '경기도 수원시',
};

const makeRequest = () =>
  new Request('http://localhost/api/job-postings', { method: 'GET' });

const mockFetchWith = (xml: string) =>
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({ text: () => Promise.resolve(xml) }),
  );

describe('GET /api/job-postings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JOB_API_BASE_URL = 'https://api.example.com/jobs';
    process.env.JOB_API_KEY = 'test-key';
    mockFetchWith(JOB_XML_ONE_ITEM);
  });

  it('공고 목록을 반환한다', async () => {
    mockAuth('1');
    mockSupabaseFetch
      .mockResolvedValueOnce([mockProfileRow])
      .mockResolvedValueOnce([]);

    const res = await GET(makeRequest());
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data[0]).toMatchObject({
      companyName: '테스트 회사',
      title: '사무보조원',
    });
  });

  it('프로필 없으면 필터링 없이 목록을 반환한다', async () => {
    mockAuth('1');
    mockSupabaseFetch.mockResolvedValueOnce([]).mockResolvedValueOnce([]);

    const res = await GET(makeRequest());
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });

  it('북마크된 공고는 bookmarked: true로 반환한다', async () => {
    const detailUrl = `https://www.work24.go.kr/wk/a/b/1700/themeEmpInfoSrchList.do?thmaHrplCd=F00036&resultCnt=10&searchMode=Y&currentPageNo=1&pageIndex=1&sortField=DATE&sortOrderBy=DESC&srcKeyword=${encodeURIComponent('테스트 회사')}`;

    mockAuth('1');
    mockSupabaseFetch
      .mockResolvedValueOnce([mockProfileRow])
      .mockResolvedValueOnce([{ posting_url: detailUrl }]);

    const res = await GET(makeRequest());
    expect(res.status).toBe(200);

    const data = await res.json();
    const bookmarked = data.find((p: { bookmarked: boolean }) => p.bookmarked);
    expect(bookmarked).toBeDefined();
  });

  it('공고가 없으면 빈 배열을 반환한다', async () => {
    mockFetchWith(JOB_XML_EMPTY);
    mockAuth('1');
    mockSupabaseFetch
      .mockResolvedValueOnce([mockProfileRow])
      .mockResolvedValueOnce([]);

    const res = await GET(makeRequest());
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data).toEqual([]);
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
    delete process.env.JOB_API_BASE_URL;
    delete process.env.JOB_API_KEY;

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
