'use client';

import { useProfile } from '@/shared/hooks/useProfile';
import { useMatchResult } from '@/shared/hooks/useMatchResult';
import { toPersonalityAxes, toMatchedJobs } from '@/shared/utils/matchConvert';

export function useDashboard() {
  const { profile, isLoading: isProfileLoading } = useProfile();
  const { data: matchResult, isLoading: isMatchLoading } = useMatchResult({
    enabled: !!profile,
  });

  const profileProvinces = profile?.region_primary
    ? [profile.region_primary.trim().split(/\s+/)[0]]
    : [];

  return {
    isPending: isProfileLoading || isMatchLoading,
    userName: profile?.name ?? '',
    personalityAxes: matchResult
      ? toPersonalityAxes(matchResult.radar_chart)
      : [],
    personalitySummary: matchResult?.summary_text ?? '',
    matchedJobs: matchResult ? toMatchedJobs(matchResult.top3_jobs) : [],
    profileProvinces,
  };
}
