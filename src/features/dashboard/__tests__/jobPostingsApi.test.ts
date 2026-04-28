import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/shared/api/bffFetch', () => ({ bffFetch: vi.fn() }));

import { bffFetch } from '@/shared/api/bffFetch';
import { getJobPostingsPaginated } from '../api/jobPostingsApi';

const mockBffFetch = vi.mocked(bffFetch);

const mockPaginatedResponse = {
  items: [
    {
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
    },
  ],
  hasMore: false,
  offset: 0,
  filterOptions: { sigunguList: ['수원시'], fitLevelList: ['잘 맞아요'] },
};

describe('getJobPostingsPaginated', () => {
  beforeEach(() => vi.clearAllMocks());

  it('offset/limit 쿼리 파라미터로 호출한다', async () => {
    mockBffFetch.mockResolvedValue(mockPaginatedResponse);

    const result = await getJobPostingsPaginated({ offset: 0, limit: 12 });

    expect(mockBffFetch).toHaveBeenCalledWith(
      '/job-postings?offset=0&limit=12',
      {
        method: 'GET',
        signal: undefined,
      },
    );
    expect(result).toEqual(mockPaginatedResponse);
  });

  it('sigungu/fitLevel 필터를 쿼리에 포함한다', async () => {
    mockBffFetch.mockResolvedValue(mockPaginatedResponse);

    await getJobPostingsPaginated({
      offset: 12,
      limit: 3,
      sigungu: '수원시',
      fitLevel: '잘 맞아요',
    });

    expect(mockBffFetch).toHaveBeenCalledWith(
      '/job-postings?offset=12&limit=3&sigungu=%EC%88%98%EC%9B%90%EC%8B%9C&fitLevel=%EC%9E%98+%EB%A7%9E%EC%95%84%EC%9A%94',
      { method: 'GET', signal: undefined },
    );
  });

  it('AbortSignal을 전달한다', async () => {
    mockBffFetch.mockResolvedValue(mockPaginatedResponse);
    const controller = new AbortController();

    await getJobPostingsPaginated({ offset: 0, limit: 12 }, controller.signal);

    expect(mockBffFetch).toHaveBeenCalledWith(
      '/job-postings?offset=0&limit=12',
      {
        method: 'GET',
        signal: controller.signal,
      },
    );
  });

  it('에러를 그대로 전파한다', async () => {
    mockBffFetch.mockRejectedValue(new Error('네트워크 오류'));

    await expect(
      getJobPostingsPaginated({ offset: 0, limit: 12 }),
    ).rejects.toThrow('네트워크 오류');
  });
});
