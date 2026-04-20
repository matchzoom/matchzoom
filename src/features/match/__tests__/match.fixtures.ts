export const mockMatchResult = {
  id: 1,
  user_id: 1,
  radar_chart: {
    repetition: 80,
    interpersonal: 60,
    physical: 40,
    hand_detail: 70,
    env_sensitivity: 50,
  },
  summary_text: '사무직에 적합합니다.',
  top3_jobs: [
    {
      rank: 1,
      job_name: '데이터 입력원',
      match_pct: 90,
      fit_level: '잘 맞아요' as const,
    },
    {
      rank: 2,
      job_name: '전화상담원',
      match_pct: 75,
      fit_level: '도전해볼 수 있어요' as const,
    },
    {
      rank: 3,
      job_name: '포장원',
      match_pct: 55,
      fit_level: '힘들 수 있어요' as const,
    },
  ],
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const mockProfile = {
  id: 1,
  user_id: 1,
  name: '홍길동',
  gender: '남성',
  education: '고등학교 졸업',
  region_primary: '서울특별시 강남구',
  region_secondary: null,
  is_barrier_free: false,
  disability_type: ['지체'],
  disability_level: '3급',
  mobility: '자유로움',
  hand_usage: '양손 가능',
  stamina: '보통',
  communication: '원활',
  instruction_level: '독립 수행',
  hope_activities: ['사무'],
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const validAiResponse = JSON.stringify({
  radar_chart: mockMatchResult.radar_chart,
  summary_text: mockMatchResult.summary_text,
  top3_jobs: mockMatchResult.top3_jobs,
});
