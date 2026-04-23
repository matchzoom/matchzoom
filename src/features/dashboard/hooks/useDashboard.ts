'use client';

import { useQuery } from '@tanstack/react-query';
import { getProfile } from '@/features/profile/api/profileApi';
import { PROFILE_QUERY_KEY } from '@/features/profile/hooks/useProfile';
import { getMatchResult } from '@/features/match/api/matchApi';
import { MATCH_RESULT_QUERY_KEY } from '@/features/match/hooks/useMatchResult';
import {
  toPersonalityAxes,
  toMatchedJobs,
} from '@/features/match/utils/convert';

export function useDashboard() {
  const { data: profile, isPending: isProfilePending } = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: getProfile,
  });

  const { data: matchResult, isPending: isMatchPending } = useQuery({
    queryKey: MATCH_RESULT_QUERY_KEY,
    queryFn: getMatchResult,
  });

  const profileProvinces = profile?.region_primary
    ? [profile.region_primary.trim().split(/\s+/)[0]]
    : [];

  return {
    isPending: isProfilePending || isMatchPending,
    userName: profile?.name ?? '',
    personalityAxes: matchResult
      ? toPersonalityAxes(matchResult.radar_chart)
      : [],
    personalitySummary: matchResult?.summary_text ?? '',
    matchedJobs: matchResult ? toMatchedJobs(matchResult.top3_jobs) : [],
    profileProvinces,
  };
}
