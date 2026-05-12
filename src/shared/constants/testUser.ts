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
  education: '일반학교 졸업',
  region_primary: '경기도',
  disability_type: ['지체장애'],
  disability_level: '장애의 정도가 심하지 않음',
  mobility: '자유로움',
  hand_usage: '세밀한 작업 가능',
  stamina: '4시간 이상 활동 가능',
  communication: '일상 대화 가능',
  instruction_level: '복잡한 지시 이해',
  hope_activities: ['같은 일 반복하기', '컴퓨터·기기 다루기'],
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
};

export const TEST_MATCH: MatchResult = {
  id: 0,
  user_id: 0,
  radar_chart: {
    repetition: 90,
    interpersonal: 70,
    physical: 80,
    hand_detail: 85,
    env_sensitivity: 60,
  },
  summary_text: '정교한 손작업과 반복적인 절차에 강점이 있어요.',
  top3_jobs: [
    {
      rank: 1,
      job_name: '반려동물돌봄',
      match_pct: 85,
      fit_level: '잘 맞아요',
    },
    {
      rank: 2,
      job_name: '부품 조립',
      match_pct: 80,
      fit_level: '잘 맞아요',
    },
    {
      rank: 3,
      job_name: '제품 검수 보조',
      match_pct: 78,
      fit_level: '도전해볼 수 있어요',
    },
  ],
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
};
