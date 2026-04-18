'use client';

import { useQuery } from '@tanstack/react-query';
import { getProfile } from '../api/profileApi';
import type { Profile } from '@/shared/types/profile';
import type { UserProfile } from '@/shared/types/userProfile';
import {
  MOCK_PERSONALITY_AXES,
  MOCK_PERSONALITY_SUMMARY,
  MOCK_MATCHED_JOBS,
} from '@/shared/utils/mockData';

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
    disabilityType: p.disability_type as UserProfile['disabilityType'],
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
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  const userProfile = profile ? toUserProfile(profile) : null;

  return {
    profile,
    userProfile,
    isLoading,
    lastSurveyDate: profile
      ? new Date(profile.updated_at).toLocaleDateString('ko-KR')
      : '',
    personalityAxes: MOCK_PERSONALITY_AXES,
    personalitySummary: MOCK_PERSONALITY_SUMMARY,
    matchedJobs: MOCK_MATCHED_JOBS,
  };
}
