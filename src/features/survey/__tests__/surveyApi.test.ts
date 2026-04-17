import { describe, it, expect, vi, beforeEach } from 'vitest';
import { submitSurvey } from '../api/surveyApi';

vi.mock('@/shared/api/bffFetch', () => ({ bffFetch: vi.fn() }));

import { bffFetch } from '@/shared/api/bffFetch';
const mockBffFetch = vi.mocked(bffFetch);

const body = {
  name: '홍길동',
  gender: '남성',
  education: '고등학교 졸업',
  region_primary: '서울특별시 강남구',
  is_barrier_free: false,
  disability_type: '지체',
  disability_level: '3급',
  mobility: '자유로움',
  hand_usage: '양손 가능',
  stamina: '보통',
  communication: '원활',
  instruction_level: '독립 수행',
  hope_activities: ['사무'],
};

describe('surveyApi', () => {
  beforeEach(() => vi.clearAllMocks());

  it('POST /profiles를 올바른 body로 호출한다', async () => {
    mockBffFetch.mockResolvedValue({ id: 1, user_id: 1, ...body });

    await submitSurvey(body);

    expect(mockBffFetch).toHaveBeenCalledWith('/profiles', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  });

  it('bffFetch 오류를 그대로 throw한다', async () => {
    mockBffFetch.mockRejectedValue(new Error('네트워크 오류'));
    await expect(submitSurvey(body)).rejects.toThrow('네트워크 오류');
  });
});
