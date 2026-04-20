'use client';

import { useQuery } from '@tanstack/react-query';
import { getProfile } from '@/features/profile/api/profileApi';
import { getMatchResult } from '@/features/match/api/matchApi';
import type { MatchedJob, PersonalityAxis } from '@/shared/types/job';
import type { RadarChart } from '@/shared/types/match';

const RADAR_AXIS_LABELS: Record<keyof RadarChart, string> = {
  repetition: '반복 작업',
  interpersonal: '대인관계',
  physical: '신체 활동',
  hand_detail: '세밀한 손작업',
  env_sensitivity: '환경 민감도',
};

function toPersonalityAxes(radar: RadarChart): PersonalityAxis[] {
  return (Object.keys(RADAR_AXIS_LABELS) as (keyof RadarChart)[]).map(
    (key) => ({
      subject: RADAR_AXIS_LABELS[key],
      value: radar[key],
      fullMark: 100,
    }),
  );
}

function toMatchedJobs(
  top3: {
    rank: number;
    job_name: string;
    match_pct: number;
    fit_level: string;
  }[],
): MatchedJob[] {
  return top3.map((job) => ({
    id: job.rank,
    name: job.job_name,
    matchRate: job.match_pct,
    fitLevel: job.fit_level as MatchedJob['fitLevel'],
  }));
}

export function useDashboard() {
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  const { data: matchResult } = useQuery({
    queryKey: ['match-result'],
    queryFn: getMatchResult,
    enabled: !!profile,
  });

  return {
    userName: profile?.name ?? '',
    personalityAxes: matchResult
      ? toPersonalityAxes(matchResult.radar_chart)
      : [],
    personalitySummary: matchResult?.summary_text ?? '',
    matchedJobs: matchResult ? toMatchedJobs(matchResult.top3_jobs) : [],
  };
}
