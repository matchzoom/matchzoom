'use client';

import { useQuery } from '@tanstack/react-query';
import { getProfile } from '@/features/profile/api/profileApi';
import { getMatchResult } from '@/features/match/api/matchApi';
import { QUERY_KEYS } from '@/shared/utils/queryKeys';
import {
  toPersonalityAxes,
  toMatchedJobs,
} from '@/features/match/utils/convert';

export function useDashboard() {
  const { data: profile, isPending: isProfilePending } = useQuery({
    queryKey: QUERY_KEYS.profile,
    queryFn: getProfile,
  });

  const { data: matchResult, isPending: isMatchPending } = useQuery({
    queryKey: QUERY_KEYS.matchResult,
    queryFn: getMatchResult,
  });

  return {
    isPending: isProfilePending || isMatchPending,
    userName: profile?.name ?? '',
    personalityAxes: matchResult
      ? toPersonalityAxes(matchResult.radar_chart)
      : [],
    personalitySummary: matchResult?.summary_text ?? '',
    matchedJobs: matchResult ? toMatchedJobs(matchResult.top3_jobs) : [],
  };
}
