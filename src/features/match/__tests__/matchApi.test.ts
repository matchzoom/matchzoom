import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/shared/api/bffFetch', () => ({ bffFetch: vi.fn() }));

import { bffFetch } from '@/shared/api/bffFetch';
import { generateMatch, getMatchResult } from '../api/matchApi';

const mockBffFetch = vi.mocked(bffFetch);

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

describe('generateMatch', () => {
  beforeEach(() => vi.clearAllMocks());

  it('POST /match를 호출한다', async () => {
    mockBffFetch.mockResolvedValue(mockMatchResult);

    const result = await generateMatch();

    expect(mockBffFetch).toHaveBeenCalledWith('/match', { method: 'POST' });
    expect(result).toEqual(mockMatchResult);
  });

  it('에러를 그대로 전파한다', async () => {
    mockBffFetch.mockRejectedValue(new Error('네트워크 오류'));

    await expect(generateMatch()).rejects.toThrow('네트워크 오류');
  });
});

describe('getMatchResult', () => {
  beforeEach(() => vi.clearAllMocks());

  it('GET /match를 호출한다', async () => {
    mockBffFetch.mockResolvedValue(mockMatchResult);

    const result = await getMatchResult();

    expect(mockBffFetch).toHaveBeenCalledWith('/match', { method: 'GET' });
    expect(result).toEqual(mockMatchResult);
  });

  it('결과 없으면 null을 반환한다', async () => {
    mockBffFetch.mockResolvedValue(null);

    const result = await getMatchResult();

    expect(result).toBeNull();
  });

  it('에러를 그대로 전파한다', async () => {
    mockBffFetch.mockRejectedValue(new Error('네트워크 오류'));

    await expect(getMatchResult()).rejects.toThrow('네트워크 오류');
  });
});
