import {
  MOCK_CHILD_PROFILE,
  MOCK_USER_PROFILE,
  MOCK_PERSONALITY_AXES,
  MOCK_PERSONALITY_SUMMARY,
  MOCK_MATCHED_JOBS,
} from '@/shared/utils/mockData';

export function useProfile() {
  return {
    childProfile: MOCK_CHILD_PROFILE,
    lastSurveyDate: MOCK_USER_PROFILE.lastSurveyDate,
    personalityAxes: MOCK_PERSONALITY_AXES,
    personalitySummary: MOCK_PERSONALITY_SUMMARY,
    matchedJobs: MOCK_MATCHED_JOBS,
  };
}
