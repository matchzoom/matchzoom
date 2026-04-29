import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/shared/api/bffFetch', () => ({ bffFetch: vi.fn() }));

import { bffFetch } from '@/shared/api/bffFetch';
import {
  getJobPostingsFilterOptions,
  getJobPostingsPage,
} from '../api/jobPostingsApi';

const mockBffFetch = vi.mocked(bffFetch);

const mockPosting = {
  id: 1,
  companyName: '테스트 회사',
  title: '사무보조원',
  location: '경기도 수원시',
  salary: '2,000,000원 (월급)',
  deadline: '2026-05-31',
  empType: '정규직',
  reqCareer: '신입',
  reqEduc: '고졸',
  envConditions: [],
  fitLevel: '잘 맞아요',
  detailUrl: 'https://www.work24.go.kr/...',
  bookmarked: false,
};

describe('getJobPostingsPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('cursor/limit 파라미터로 GET 요청을 보내고 페이지를 반환한다', async () => {
    mockBffFetch.mockResolvedValue({ items: [mockPosting], nextCursor: 12 });

    const result = await getJobPostingsPage({
      cursor: 0,
      limit: 12,
      sigungu: null,
      fitLevel: null,
    });

    expect(mockBffFetch).toHaveBeenCalledWith(
      '/job-postings?cursor=0&limit=12',
      {
        method: 'GET',
        signal: undefined,
      },
    );
    expect(result.items).toHaveLength(1);
    expect(result.nextCursor).toBe(12);
  });

  it('sigungu / fitLevel을 query string에 포함한다', async () => {
    mockBffFetch.mockResolvedValue({ items: [], nextCursor: null });

    await getJobPostingsPage({
      cursor: 12,
      limit: 3,
      sigungu: '수원시',
      fitLevel: '잘 맞아요',
    });

    // URLSearchParams encodes spaces as '+'
    expect(mockBffFetch).toHaveBeenCalledWith(
      '/job-postings?cursor=12&limit=3&sigungu=%EC%88%98%EC%9B%90%EC%8B%9C&fitLevel=%EC%9E%98+%EB%A7%9E%EC%95%84%EC%9A%94',
      { method: 'GET', signal: undefined },
    );
  });

  it('AbortSignal을 전달한다', async () => {
    mockBffFetch.mockResolvedValue({ items: [], nextCursor: null });
    const controller = new AbortController();

    await getJobPostingsPage(
      { cursor: 0, limit: 12, sigungu: null, fitLevel: null },
      controller.signal,
    );

    expect(mockBffFetch).toHaveBeenCalledWith(expect.any(String), {
      method: 'GET',
      signal: controller.signal,
    });
  });

  it('에러를 그대로 전파한다', async () => {
    mockBffFetch.mockRejectedValue(new Error('네트워크 오류'));

    await expect(
      getJobPostingsPage({
        cursor: 0,
        limit: 12,
        sigungu: null,
        fitLevel: null,
      }),
    ).rejects.toThrow('네트워크 오류');
  });
});

describe('getJobPostingsFilterOptions', () => {
  beforeEach(() => vi.clearAllMocks());

  it('GET /job-postings/filter-options를 호출한다', async () => {
    mockBffFetch.mockResolvedValue({
      sigunguList: ['수원시'],
      fitLevels: ['잘 맞아요'],
    });

    const result = await getJobPostingsFilterOptions();

    expect(mockBffFetch).toHaveBeenCalledWith('/job-postings/filter-options', {
      method: 'GET',
      signal: undefined,
    });
    expect(result.sigunguList).toEqual(['수원시']);
    expect(result.fitLevels).toEqual(['잘 맞아요']);
  });

  it('AbortSignal을 전달한다', async () => {
    mockBffFetch.mockResolvedValue({ sigunguList: [], fitLevels: [] });
    const controller = new AbortController();

    await getJobPostingsFilterOptions(controller.signal);

    expect(mockBffFetch).toHaveBeenCalledWith('/job-postings/filter-options', {
      method: 'GET',
      signal: controller.signal,
    });
  });

  it('에러를 그대로 전파한다', async () => {
    mockBffFetch.mockRejectedValue(new Error('네트워크 오류'));

    await expect(getJobPostingsFilterOptions()).rejects.toThrow(
      '네트워크 오류',
    );
  });
});
