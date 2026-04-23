'use client';

import { useQuery } from '@tanstack/react-query';
import { getProfile } from '../api/profileApi';
import { useMatchResult } from '@/features/match/hooks/useMatchResult';
import {
  toPersonalityAxes,
  toMatchedJobs,
} from '@/features/match/utils/convert';
import type { Profile } from '@/shared/types/profile';
import type { UserProfile } from '@/shared/types/userProfile';

function toUserProfile(p: Profile): UserProfile {
  return {
    name: p.name,
    age: 0,
    gender: p.gender as UserProfile['gender'],
    education: p.education,
    region: p.region_primary,
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

export const PROFILE_QUERY_KEY = ['profile'] as const;

export function useProfile() {
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: getProfile,
  });

  const { data: matchResult, isLoading: isMatchLoading } = useMatchResult({
    enabled: !!profile,
  });

  return {
    profile,
    userProfile: profile ? toUserProfile(profile) : null,
    isLoading: isProfileLoading || isMatchLoading,
    lastSurveyDate: profile
      ? new Date(profile.updated_at).toLocaleDateString('ko-KR')
      : '',
    personalityAxes: matchResult
      ? toPersonalityAxes(matchResult.radar_chart)
      : [],
    personalitySummary: matchResult?.summary_text ?? '',
    matchedJobs: matchResult ? toMatchedJobs(matchResult.top3_jobs) : [],
  };
}
