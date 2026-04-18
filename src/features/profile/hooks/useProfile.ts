'use client';

import { useQuery } from '@tanstack/react-query';
import { getProfile } from '../api/profileApi';
import type { Profile } from '@/shared/types/profile';
import type { ChildProfile } from '@/shared/types/childProfile';
import {
  MOCK_PERSONALITY_AXES,
  MOCK_PERSONALITY_SUMMARY,
  MOCK_MATCHED_JOBS,
} from '@/shared/utils/mockData';

function parseRegion(region: string): { city: string; district: string } {
  const parts = region.split(' ');
  return { city: parts[0] ?? '', district: parts.slice(1).join(' ') };
}

function toChildProfile(p: Profile): ChildProfile {
  return {
    name: p.name,
    age: 0,
    gender: p.gender as ChildProfile['gender'],
    education: p.education,
    region1: parseRegion(p.region_primary),
    region2: p.region_secondary ? parseRegion(p.region_secondary) : undefined,
    barrierFree: p.is_barrier_free,
    disabilityType: p.disability_type as ChildProfile['disabilityType'],
    disabilityGrade: p.disability_level as ChildProfile['disabilityGrade'],
    mobility: p.mobility as ChildProfile['mobility'],
    handUse: p.hand_usage as ChildProfile['handUse'],
    stamina: p.stamina as ChildProfile['stamina'],
    speaking: p.communication as ChildProfile['speaking'],
    instructionUnderstanding:
      p.instruction_level as ChildProfile['instructionUnderstanding'],
    preferredActivities: p.hope_activities,
  };
}

export function useProfile() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  const childProfile = profile ? toChildProfile(profile) : null;

  return {
    profile,
    childProfile,
    isLoading,
    lastSurveyDate: profile
      ? new Date(profile.updated_at).toLocaleDateString('ko-KR')
      : '',
    personalityAxes: MOCK_PERSONALITY_AXES,
    personalitySummary: MOCK_PERSONALITY_SUMMARY,
    matchedJobs: MOCK_MATCHED_JOBS,
  };
}
