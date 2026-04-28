import type { MatchedJob, PersonalityAxis } from '@/shared/types/job';
import type { RadarChart, Top3Job } from '@/shared/types/match';

export const RADAR_AXIS_LABELS: Record<keyof RadarChart, string> = {
  repetition: '반복 작업',
  interpersonal: '대인관계',
  physical: '신체 활동',
  hand_detail: '세밀한 손작업',
  env_sensitivity: '환경 민감도',
};

export function toPersonalityAxes(radar: RadarChart): PersonalityAxis[] {
  return (Object.keys(RADAR_AXIS_LABELS) as (keyof RadarChart)[]).map(
    (key) => ({
      subject: RADAR_AXIS_LABELS[key],
      value: radar[key],
      fullMark: 100,
    }),
  );
}

export function toMatchedJobs(top3: Top3Job[]): MatchedJob[] {
  return top3.map((job) => ({
    id: job.rank,
    name: job.job_name,
    matchRate: job.match_pct,
    fitLevel: job.fit_level,
  }));
}
