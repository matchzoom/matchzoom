import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/shared/api/bffFetch', () => ({ bffFetch: vi.fn() }));

import { bffFetch } from '@/shared/api/bffFetch';
import { getBookmarks, removeBookmark } from '../api/bookmarksApi';
import type { Bookmark } from '@/shared/types/bookmark';

const mockBffFetch = vi.mocked(bffFetch);

const mockBookmark: Bookmark = {
  id: 1,
  postingTitle: '사무보조원 채용',
  postingUrl: 'https://example.com/job/1',
  companyName: '예시 회사',
  deadline: '2026-05-01',
  fitLevel: '잘 맞아요',
  createdAt: '2026-04-01T00:00:00.000Z',
};

describe('getBookmarks', () => {
  beforeEach(() => vi.clearAllMocks());

  it('GET /bookmarks를 호출하고 목록을 반환한다', async () => {
    mockBffFetch.mockResolvedValue([mockBookmark]);

    const result = await getBookmarks();

    expect(mockBffFetch).toHaveBeenCalledWith('/bookmarks', { method: 'GET' });
    expect(result).toEqual([mockBookmark]);
  });

  it('에러를 그대로 전파한다', async () => {
    mockBffFetch.mockRejectedValue(new Error('네트워크 오류'));

    await expect(getBookmarks()).rejects.toThrow('네트워크 오류');
  });
});

describe('removeBookmark', () => {
  beforeEach(() => vi.clearAllMocks());

  it('DELETE /bookmarks?postingUrl=...를 호출한다', async () => {
    mockBffFetch.mockResolvedValue(undefined);

    await removeBookmark('https://example.com/job/1');

    expect(mockBffFetch).toHaveBeenCalledWith(
      `/bookmarks?postingUrl=${encodeURIComponent('https://example.com/job/1')}`,
      { method: 'DELETE' },
    );
  });

  it('에러를 그대로 전파한다', async () => {
    mockBffFetch.mockRejectedValue(new Error('네트워크 오류'));

    await expect(removeBookmark('https://example.com/job/1')).rejects.toThrow(
      '네트워크 오류',
    );
  });
});
