'use client';

import { useQuery } from '@tanstack/react-query';
import { getProfile } from '../api/profileApi';
import { getMatchResult } from '@/features/match/api/matchApi';
import type { Profile } from '@/shared/types/profile';
import type { UserProfile } from '@/shared/types/userProfile';
import type { MatchedJob, PersonalityAxis } from '@/shared/types/job';
import type { RadarChart } from '@/shared/types/match';

function parseRegion(region: string): { city: string; district: string } {
  const parts = region.split(' ');
  return { city: parts[0] ?? '', district: parts.slice(1).join(' ') };
}

function toUserProfile(p: Profile): UserProfile {
  return {
    name: p.name,
    age: 0,
    gender: p.gender as UserProfile['gender'],
    education: p.education,
    region1: parseRegion(p.region_primary),
    region2: p.region_secondary ? parseRegion(p.region_secondary) : undefined,
    barrierFree: p.is_barrier_free,
    disabilityType: p.disability_type,
    disabilityGrade: p.disability_level as UserProfile['disabilityGrade'],
    mobility: p.mobility as UserProfile['mobility'],
    handUse: p.hand_usage as UserProfile['handUse'],
    stamina: p.stamina as UserProfile['stamina'],
    speaking: p.communication as UserProfile['speaking'],
    instructionUnderstanding:
      p.instruction_level as UserProfile['instructionUnderstanding'],
    preferredActivities: p.hope_activities,
  };
}

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

export function useProfile() {
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  const { data: matchResult, isLoading: isMatchLoading } = useQuery({
    queryKey: ['match-result'],
    queryFn: getMatchResult,
    enabled: !!profile,
  });

  const userProfile = profile ? toUserProfile(profile) : null;
  const personalityAxes = matchResult
    ? toPersonalityAxes(matchResult.radar_chart)
    : [];
  const personalitySummary = matchResult?.summary_text ?? '';
  const matchedJobs = matchResult ? toMatchedJobs(matchResult.top3_jobs) : [];

  return {
    profile,
    userProfile,
    isLoading: isProfileLoading || isMatchLoading,
    lastSurveyDate: profile
      ? new Date(profile.updated_at).toLocaleDateString('ko-KR')
      : '',
    personalityAxes,
    personalitySummary,
    matchedJobs,
  };
}
