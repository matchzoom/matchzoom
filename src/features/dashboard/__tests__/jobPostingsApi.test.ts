import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/shared/api/bffFetch', () => ({ bffFetch: vi.fn() }));

import { bffFetch } from '@/shared/api/bffFetch';
import { getPaginatedJobPostings } from '../api/jobPostingsApi';

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

const mockPaginated = {
  items: [mockPosting],
  nextOffset: null,
  total: 1,
};

describe('getPaginatedJobPostings', () => {
  beforeEach(() => vi.clearAllMocks());

  it('GET /job-postings?offset=0&limit=12를 호출하고 페이지 데이터를 반환한다', async () => {
    mockBffFetch.mockResolvedValue(mockPaginated);

    const result = await getPaginatedJobPostings(0, 12);

    expect(mockBffFetch).toHaveBeenCalledWith(
      '/job-postings?offset=0&limit=12',
      {
        method: 'GET',
        signal: undefined,
      },
    );
    expect(result).toEqual(mockPaginated);
  });

  it('offset과 limit을 URL에 반영한다', async () => {
    mockBffFetch.mockResolvedValue({ items: [], nextOffset: null, total: 0 });

    await getPaginatedJobPostings(12, 3);

    expect(mockBffFetch).toHaveBeenCalledWith(
      '/job-postings?offset=12&limit=3',
      {
        method: 'GET',
        signal: undefined,
      },
    );
  });

  it('AbortSignal을 전달한다', async () => {
    mockBffFetch.mockResolvedValue(mockPaginated);
    const controller = new AbortController();

    await getPaginatedJobPostings(0, 12, controller.signal);

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

    await expect(getPaginatedJobPostings(0, 12)).rejects.toThrow(
      '네트워크 오류',
    );
  });
});
