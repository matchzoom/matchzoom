'use client';

import { useQuery } from '@tanstack/react-query';
import { getProfile } from '@/shared/api/profileApi';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
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

export function useProfile() {
  const { data: profile, isLoading } = useQuery({
    queryKey: QUERY_KEYS.profile,
    queryFn: getProfile,
  });

  return {
    profile,
    userProfile: profile ? toUserProfile(profile) : null,
    isLoading,
    lastSurveyDate: profile
      ? new Date(profile.updated_at).toLocaleDateString('ko-KR')
      : '',
  };
}
