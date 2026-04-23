'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { getProfile } from '@/features/profile/api/profileApi';
import { getMatchResult } from '@/features/match/api/matchApi';
import {
  toPersonalityAxes,
  toMatchedJobs,
} from '@/features/match/utils/convert';

export function useDashboard() {
  const { data: profile } = useSuspenseQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  const { data: matchResult } = useSuspenseQuery({
    queryKey: ['match-result'],
    queryFn: getMatchResult,
  });

  const profileProvinces = profile?.region_primary
    ? [profile.region_primary.trim().split(/\s+/)[0]]
    : [];

  return {
    userName: profile?.name ?? '',
    personalityAxes: matchResult
      ? toPersonalityAxes(matchResult.radar_chart)
      : [],
    personalitySummary: matchResult?.summary_text ?? '',
    matchedJobs: matchResult ? toMatchedJobs(matchResult.top3_jobs) : [],
    profileProvinces,
  };
}
