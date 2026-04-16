import {
  MOCK_USER_PROFILE,
  MOCK_PERSONALITY_AXES,
  MOCK_PERSONALITY_SUMMARY,
  MOCK_MATCHED_JOBS,
} from '@/shared/utils/mockData';

export function useDashboard() {
  return {
    childName: MOCK_USER_PROFILE.name,
    lastSurveyDate: MOCK_USER_PROFILE.lastSurveyDate,
    personalityAxes: MOCK_PERSONALITY_AXES,
    personalitySummary: MOCK_PERSONALITY_SUMMARY,
    matchedJobs: MOCK_MATCHED_JOBS,
  };
}
