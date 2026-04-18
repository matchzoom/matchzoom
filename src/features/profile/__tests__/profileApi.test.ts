import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/shared/api/bffFetch', () => ({ bffFetch: vi.fn() }));

import { bffFetch } from '@/shared/api/bffFetch';
import { getProfile } from '../api/profileApi';

const mockBffFetch = vi.mocked(bffFetch);

describe('getProfile', () => {
  beforeEach(() => vi.clearAllMocks());

  it('GET /profiles를 호출한다', async () => {
    const profile = { id: 1, user_id: 1, name: '홍길동' };
    mockBffFetch.mockResolvedValue(profile);

    const result = await getProfile();

    expect(mockBffFetch).toHaveBeenCalledWith('/profiles', { method: 'GET' });
    expect(result).toEqual(profile);
  });

  it('에러를 그대로 전파한다', async () => {
    mockBffFetch.mockRejectedValue(new Error('네트워크 오류'));

    await expect(getProfile()).rejects.toThrow('네트워크 오류');
  });
});
