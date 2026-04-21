import type { MatchedJob, PersonalityAxis } from '@/shared/types/job';
import type { UserProfile } from '@/shared/types/userProfile';

export const MOCK_USER_PROFILE: UserProfile = {
  name: '민준',
  age: 17,
  gender: '남성',
  education: '특수학교 고등부 졸업',
  region: '서울특별시',
  disabilityType: ['지적장애'],
  disabilityGrade: '중등도',
  mobility: '자유로움',
  handUse: '세밀한 작업 가능',
  stamina: '4시간 이상 활동 가능',
  speaking: '일상 대화 가능',
  instructionUnderstanding: '2단계 지시 이해',
  preferredActivities: ['같은 일 반복하기', '손으로 만들기', '물건 정리·분류'],
};

export const MOCK_PERSONALITY_SUMMARY =
  '반복적이고 조용한 환경에서 손작업에 집중할 때 가장 편안해요';

export const MOCK_PERSONALITY_AXES: PersonalityAxis[] = [
  { subject: '반복 작업', value: 85, fullMark: 100 },
  { subject: '대인관계', value: 40, fullMark: 100 },
  { subject: '신체 활동', value: 60, fullMark: 100 },
  { subject: '세밀한 손작업', value: 90, fullMark: 100 },
  { subject: '환경 민감도', value: 70, fullMark: 100 },
];

export const MOCK_MATCHED_JOBS: MatchedJob[] = [
  { id: 1, name: '데이터 입력 사무원', matchRate: 92, fitLevel: '잘 맞아요' },
  { id: 2, name: '조립·포장 작업원', matchRate: 78, fitLevel: '잘 맞아요' },
  {
    id: 3,
    name: '도서관 사서보조',
    matchRate: 65,
    fitLevel: '도전해볼 수 있어요',
  },
];
