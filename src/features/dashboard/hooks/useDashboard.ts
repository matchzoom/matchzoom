'use client';

import { useQuery } from '@tanstack/react-query';
import { getProfile } from '@/features/profile/api/profileApi';
import { useMatchResult } from '@/features/match/hooks/useMatchResult';
import {
  toPersonalityAxes,
  toMatchedJobs,
} from '@/features/match/utils/convert';

export function useDashboard() {
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  const { data: matchResult, isLoading: isMatchLoading } = useMatchResult({
    enabled: !!profile,
  });

  const profileProvinces = profile?.region_primary
    ? [profile.region_primary.trim().split(/\s+/)[0]]
    : [];

  return {
    userName: profile?.name ?? '',
    isLoading: isProfileLoading || isMatchLoading,
    personalityAxes: matchResult
      ? toPersonalityAxes(matchResult.radar_chart)
      : [],
    personalitySummary: matchResult?.summary_text ?? '',
    matchedJobs: matchResult ? toMatchedJobs(matchResult.top3_jobs) : [],
    profileProvinces,
  };
}
