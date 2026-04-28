import type { CurrentUser } from '@/shared/types/user';
import type { Profile } from '@/shared/types/profile';
import type { MatchResult } from '@/shared/types/match';

// Supabase bigint ID는 1부터 시작하므로 "0"은 실제 유저와 충돌하지 않는다.
export const TEST_USER_ID = '0';

export const TEST_USER: CurrentUser = {
  id: 0,
  nickname: '테스트 계정',
  created_at: '2026-01-01T00:00:00.000Z',
  isTestUser: true,
};

export const TEST_PROFILE: Profile = {
  id: 0,
  user_id: 0,
  name: '테스트 사용자',
  gender: '남성',
  education: '고졸',
  region_primary: '경기도',
  disability_type: ['지체장애'],
  disability_level: '경증',
  mobility: '대중교통 이용 가능',
  hand_usage: '양손 사용 가능',
  stamina: '보통',
  communication: '원활',
  instruction_level: '문서 이해 가능',
  hope_activities: ['사무보조', '데이터 입력'],
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
};

export const TEST_MATCH: MatchResult = {
  id: 0,
  user_id: 0,
  radar_chart: {
    repetition: 75,
    interpersonal: 60,
    physical: 40,
    hand_detail: 80,
    env_sensitivity: 55,
  },
  summary_text:
    '꼼꼼하고 반복 작업에 강한 유형이에요. 정밀한 손 작업이나 데이터 처리 업무에서 능력을 발휘할 수 있어요.',
  top3_jobs: [
    {
      rank: 1,
      job_name: '사무보조원',
      match_pct: 88,
      fit_level: '잘 맞아요',
    },
    {
      rank: 2,
      job_name: '데이터 입력 사무원',
      match_pct: 82,
      fit_level: '잘 맞아요',
    },
    {
      rank: 3,
      job_name: '물품 포장원',
      match_pct: 65,
      fit_level: '도전해볼 수 있어요',
    },
  ],
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
};
