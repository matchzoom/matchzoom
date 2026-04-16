export type ChildProfile = {
  name: string;
  age: number;
  gender: '남성' | '여성';
  education: string;
  region1: { city: string; district: string };
  region2?: { city: string; district: string };
  barrierFree: boolean;
  disabilityType: '지적장애' | '자폐성장애' | '기타 발달장애';
  disabilityGrade: '경도' | '중등도' | '중도' | '모르겠어요';
  mobility: '자유로움' | '보조기구 사용' | '휠체어 사용';
  handUse: '세밀한 작업 가능' | '큰 동작만 가능' | '어려움';
  stamina: '4시간 이상 활동 가능' | '2~4시간' | '2시간 미만';
  speaking: '일상 대화 가능' | '짧은 문장 가능' | '단어 수준' | '비언어적 소통';
  instructionUnderstanding:
    | '복잡한 지시 이해'
    | '2단계 지시 이해'
    | '단순 지시만 가능'
    | '시범 보여주면 가능';
  preferredActivities: string[];
};
