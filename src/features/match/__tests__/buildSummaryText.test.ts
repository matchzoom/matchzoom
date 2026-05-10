import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildSummaryText } from '../utils/buildSummaryText';
import type { JobNcsData } from '@/shared/types/worknet';
import type { RadarChart, Top3Job } from '@/shared/types/match';

vi.mock('@/shared/api/openAiFetch', () => ({ openAiFetch: vi.fn() }));
vi.mock('@/shared/api/coreFetch', () => ({ coreFetch: vi.fn() }));

import { openAiFetch } from '@/shared/api/openAiFetch';

const mockOpenAiFetch = vi.mocked(openAiFetch);

const top3Jobs: Top3Job[] = [
  { rank: 1, job_name: '세탁물 관리', match_pct: 85, fit_level: '잘 맞아요' },
  {
    rank: 2,
    job_name: '환경정리',
    match_pct: 78,
    fit_level: '도전해볼 수 있어요',
  },
  {
    rank: 3,
    job_name: '우편물 분류',
    match_pct: 65,
    fit_level: '도전해볼 수 있어요',
  },
];

const radarChart: RadarChart = {
  repetition: 80,
  interpersonal: 30,
  physical: 50,
  hand_detail: 60,
  env_sensitivity: 70,
};

const worknetData: JobNcsData[] = [
  {
    jobName: '세탁물 관리',
    units: [
      {
        job_sdvn: '세탁',
        ablt_def: '세탁물을 종류별로 분류하고 세탁하는 능력이다.',
        job_scfn: '섬유',
        job_lcfn: '섬유·의복',
        job_mcn: '의류',
        knwg_tchn_attd: [
          { knwg_tchn_attd: 'url1', knwg_tchn_attd_label: '세탁물 분류 능력' },
          { knwg_tchn_attd: 'url2', knwg_tchn_attd_label: '위생관리 지식' },
        ],
      },
    ],
  },
  {
    jobName: '환경정리',
    units: [
      {
        job_sdvn: '청소',
        ablt_def: '실내외 환경을 청결하게 유지하는 능력이다.',
        job_scfn: '청소',
        job_lcfn: '환경·에너지',
        job_mcn: '환경',
        knwg_tchn_attd: [
          { knwg_tchn_attd: 'url3', knwg_tchn_attd_label: '위생관리 지식' },
        ],
      },
    ],
  },
];

describe('buildSummaryText', () => {
  beforeEach(() => vi.clearAllMocks());

  it('NCS 데이터가 있으면 OpenAI를 호출하여 summary를 생성한다', async () => {
    mockOpenAiFetch.mockResolvedValue(
      JSON.stringify({
        summary_text: '빨래를 종류별로 가려내는 꼼꼼함이 편안해요',
      }),
    );

    const result = await buildSummaryText(top3Jobs, worknetData, radarChart);

    expect(result).toBe('빨래를 종류별로 가려내는 꼼꼼함이 편안해요');
    expect(mockOpenAiFetch).toHaveBeenCalledTimes(1);

    // NCS 키워드가 프롬프트에 포함되었는지 확인
    const callArgs = mockOpenAiFetch.mock.calls[0][0];
    const userMessage = callArgs[1].content;
    expect(userMessage).toContain('세탁물 분류 능력');
    expect(userMessage).toContain('세탁물 관리');
  });

  it('NCS 데이터가 없으면 radar 기반 폴백 summary를 반환한다', async () => {
    const result = await buildSummaryText(top3Jobs, [], radarChart);

    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(10);
    expect(mockOpenAiFetch).not.toHaveBeenCalled();
  });

  it('top3 직종에 매칭되는 NCS가 없으면 전체 NCS 상위 3개로 OpenAI를 호출한다', async () => {
    mockOpenAiFetch.mockResolvedValue(
      JSON.stringify({
        summary_text: '정돈된 환경에서 차분히 일할 때 편안해요',
      }),
    );

    const unmatchedJobs: Top3Job[] = [
      {
        rank: 1,
        job_name: '반려동물돌봄',
        match_pct: 80,
        fit_level: '잘 맞아요',
      },
      {
        rank: 2,
        job_name: '실버케어',
        match_pct: 70,
        fit_level: '도전해볼 수 있어요',
      },
      {
        rank: 3,
        job_name: '급식지원',
        match_pct: 60,
        fit_level: '도전해볼 수 있어요',
      },
    ];

    const result = await buildSummaryText(
      unmatchedJobs,
      worknetData,
      radarChart,
    );

    expect(mockOpenAiFetch).toHaveBeenCalledTimes(1);
    expect(result).toBe('정돈된 환경에서 차분히 일할 때 편안해요');
  });

  it('OpenAI 응답 파싱 실패 시 폴백한다', async () => {
    mockOpenAiFetch.mockResolvedValue('invalid json');

    const result = await buildSummaryText(top3Jobs, worknetData, radarChart);

    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('radar에서 가장 높은 축을 프롬프트에 포함한다', async () => {
    mockOpenAiFetch.mockResolvedValue(
      JSON.stringify({ summary_text: '테스트 문장이에요' }),
    );

    await buildSummaryText(top3Jobs, worknetData, radarChart);

    const callArgs = mockOpenAiFetch.mock.calls[0][0];
    const userMessage = callArgs[1].content;
    // repetition(80)과 env_sensitivity(70)이 상위 2개
    expect(userMessage).toContain('반복 작업 적합도');
    expect(userMessage).toContain('조용한 환경 선호도');
  });
});
