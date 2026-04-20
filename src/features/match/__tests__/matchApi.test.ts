import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/shared/api/bffFetch', () => ({ bffFetch: vi.fn() }));

import { bffFetch } from '@/shared/api/bffFetch';
import { generateMatch, getMatchResult } from '../api/matchApi';
import { mockMatchResult } from './match.fixtures';

const mockBffFetch = vi.mocked(bffFetch);

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
