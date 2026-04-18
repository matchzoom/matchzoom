export const DISABILITY_TYPE_OPTIONS = [
  { value: '시각장애', label: '시각장애' },
  { value: '청각장애', label: '청각장애' },
  { value: '지체장애', label: '지체장애' },
  { value: '언어장애', label: '언어장애' },
  { value: '안면장애', label: '안면장애' },
  { value: '지적장애', label: '지적장애' },
  { value: '자폐성장애', label: '자폐성장애' },
  { value: '기타', label: '기타' },
];

export const DISABILITY_LEVEL_OPTIONS = [
  { value: '장애의 정도가 심함', label: '장애의 정도가 심함' },
  { value: '장애의 정도가 심하지 않음', label: '장애의 정도가 심하지 않음' },
  { value: '모르겠어요', label: '모르겠어요' },
];

export const MOBILITY_OPTIONS = [
  { value: '자유로움', label: '자유로움' },
  { value: '보조기구 사용', label: '보조기구 사용' },
  { value: '휠체어 사용', label: '휠체어 사용' },
];

export const HAND_USAGE_OPTIONS = [
  { value: '세밀한 작업 가능', label: '세밀한 작업 가능' },
  { value: '큰 동작만 가능', label: '큰 동작만 가능' },
  { value: '어려움', label: '어려움' },
];

export const STAMINA_OPTIONS = [
  { value: '4시간 이상 활동 가능', label: '4시간 이상' },
  { value: '2~4시간', label: '2~4시간' },
  { value: '2시간 미만', label: '2시간 미만' },
];

export const COMMUNICATION_OPTIONS = [
  { value: '일상 대화 가능', label: '일상 대화 가능' },
  { value: '짧은 문장 가능', label: '짧은 문장 가능' },
  { value: '단어 수준', label: '단어 수준' },
  { value: '비언어적 소통', label: '비언어적 소통' },
];

export const INSTRUCTION_LEVEL_OPTIONS = [
  { value: '복잡한 지시 이해', label: '복잡한 지시 이해' },
  { value: '2단계 지시 이해', label: '2단계 지시 이해' },
  { value: '단순 지시만 가능', label: '단순 지시만 가능' },
  { value: '시범 보여주면 가능', label: '시범 보여주면 가능' },
];

export const HOPE_ACTIVITIES_OPTIONS = [
  { value: '같은 일 반복하기', label: '같은 일 반복하기' },
  { value: '손으로 만들기', label: '손으로 만들기' },
  { value: '물건 정리·분류', label: '물건 정리·분류' },
  { value: '몸 움직이기', label: '몸 움직이기' },
  { value: '컴퓨터·기기 다루기', label: '컴퓨터·기기 다루기' },
  { value: '동식물 돌보기', label: '동식물 돌보기' },
  { value: '청소·세탁 등 환경 관리', label: '청소·세탁 등 환경 관리' },
  { value: '기타', label: '기타' },
];

export const DISABILITY_TYPE_VALUES = new Set(
  DISABILITY_TYPE_OPTIONS.map((o) => o.value),
);
export const HOPE_ACTIVITIES_VALUES = new Set(
  HOPE_ACTIVITIES_OPTIONS.map((o) => o.value),
);
