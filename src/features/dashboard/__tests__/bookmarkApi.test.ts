import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/shared/api/bffFetch', () => ({ bffFetch: vi.fn() }));

import { bffFetch } from '@/shared/api/bffFetch';
import { addBookmark, removeBookmark } from '../api/bookmarkApi';

const mockBffFetch = vi.mocked(bffFetch);

describe('addBookmark', () => {
  beforeEach(() => vi.clearAllMocks());

  it('POST /bookmarks를 호출한다', async () => {
    mockBffFetch.mockResolvedValue(undefined);

    await addBookmark(
      '사무보조원 채용',
      'https://example.com/job/1',
      '예시 회사',
      '2026-05-01',
      '잘 맞아요',
    );

    expect(mockBffFetch).toHaveBeenCalledWith('/bookmarks', {
      method: 'POST',
      body: JSON.stringify({
        postingTitle: '사무보조원 채용',
        postingUrl: 'https://example.com/job/1',
        companyName: '예시 회사',
        deadline: '2026-05-01',
        fitLevel: '잘 맞아요',
      }),
    });
  });

  it('에러를 그대로 전파한다', async () => {
    mockBffFetch.mockRejectedValue(new Error('네트워크 오류'));

    await expect(
      addBookmark('제목', 'https://example.com', '회사', '2026-05-01', ''),
    ).rejects.toThrow('네트워크 오류');
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
