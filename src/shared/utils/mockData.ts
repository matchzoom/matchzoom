import type {
  MatchedJob,
  JobPosting,
  PersonalityAxis,
} from '@/shared/types/job';
import type { UserProfile } from '@/shared/types/userProfile';

export const MOCK_USER_PROFILE: UserProfile = {
  name: '민준',
  age: 17,
  gender: '남성',
  education: '특수학교 고등부 졸업',
  region1: { city: '서울', district: '강남구' },
  region2: { city: '서울', district: '마포구' },
  barrierFree: true,
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

export const MOCK_JOB_POSTINGS: JobPosting[] = [
  {
    id: 1,
    companyName: '(주)서울사무직',
    title: '사무 보조 직원 모집 (장애인 우대)',
    workType: '오프라인',
    location: '서울 강남구',
    salary: '월 220만 원',
    deadline: '2026.05.01',
    views: 324,
    fitLevel: '잘 맞아요',
    matchPoints: '조용한 사무 환경 · 반복 업무 중심',
    bookmarked: false,
  },
  {
    id: 2,
    companyName: '행복나눔재단',
    title: '장애인 고용 우대 — 포장·분류 작업 보조',
    workType: '오프라인',
    location: '서울 마포구',
    salary: '시급 10,030원',
    deadline: '2026.04.30',
    views: 210,
    fitLevel: '잘 맞아요',
    matchPoints: '반복 작업 · 조용한 작업 공간',
    bookmarked: true,
  },
  {
    id: 3,
    companyName: '디지털도서관',
    title: '도서 분류·정리 파트타임 스태프',
    workType: '오프라인',
    location: '서울 서초구',
    salary: '시급 11,000원',
    deadline: '2026.05.15',
    views: 156,
    fitLevel: '도전해볼 수 있어요',
    matchPoints: '정리·분류 업무 · 실내 환경',
    bookmarked: false,
  },
  {
    id: 4,
    companyName: '이마트24 물류센터',
    title: '상품 검수·입고 작업자 채용',
    workType: '오프라인',
    location: '경기 성남시',
    salary: '월 230만 원',
    deadline: '2026.04.25',
    views: 445,
    fitLevel: '도전해볼 수 있어요',
    matchPoints: '체계적 업무 프로세스 · 팀 작업',
    bookmarked: false,
  },
  {
    id: 5,
    companyName: '한국발달장애인훈련센터',
    title: '바리스타 보조 훈련 연계 채용',
    workType: '오프라인',
    location: '서울 노원구',
    salary: '월 200만 원',
    deadline: '2026.05.20',
    views: 289,
    fitLevel: '잘 맞아요',
    matchPoints: '손작업 중심 · 반복 루틴 업무',
    bookmarked: false,
  },
  {
    id: 6,
    companyName: '스마트팩토리㈜',
    title: '단순 조립 및 포장 작업원 상시 채용',
    workType: '오프라인',
    location: '경기 안산시',
    salary: '시급 12,000원',
    deadline: '2026.05.31',
    views: 512,
    fitLevel: '잘 맞아요',
    matchPoints: '반복 작업 · 소규모 팀 환경',
    bookmarked: false,
  },
];
