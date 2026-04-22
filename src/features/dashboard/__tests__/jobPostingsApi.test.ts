import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/shared/api/bffFetch', () => ({ bffFetch: vi.fn() }));

import { bffFetch } from '@/shared/api/bffFetch';
import { getJobPostings } from '../api/jobPostingsApi';

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

describe('getJobPostings', () => {
  beforeEach(() => vi.clearAllMocks());

  it('GET /job-postings를 호출하고 목록을 반환한다', async () => {
    mockBffFetch.mockResolvedValue([mockPosting]);

    const result = await getJobPostings();

    expect(mockBffFetch).toHaveBeenCalledWith('/job-postings', {
      method: 'GET',
      signal: undefined,
    });
    expect(result).toEqual([mockPosting]);
  });

  it('AbortSignal을 전달한다', async () => {
    mockBffFetch.mockResolvedValue([]);
    const controller = new AbortController();

    await getJobPostings(controller.signal);

    expect(mockBffFetch).toHaveBeenCalledWith('/job-postings', {
      method: 'GET',
      signal: controller.signal,
    });
  });

  it('에러를 그대로 전파한다', async () => {
    mockBffFetch.mockRejectedValue(new Error('네트워크 오류'));

    await expect(getJobPostings()).rejects.toThrow('네트워크 오류');
  });
});
