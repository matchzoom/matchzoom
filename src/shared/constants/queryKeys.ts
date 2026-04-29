import type { FitLevel } from '@/shared/types/job';

export type JobPostingsListFilters = {
  sigungu: string | null;
  fitLevel: FitLevel | null;
};

export const QUERY_KEYS = {
  currentUser: ['currentUser'] as const,
  profile: ['profile'] as const,
  matchResult: ['match-result'] as const,
  jobPostings: {
    all: ['job-postings'] as const,
    list: (filters: JobPostingsListFilters) =>
      ['job-postings', filters] as const,
    filterOptions: ['job-postings-filter-options'] as const,
  },
  bookmarks: ['bookmarks'] as const,
};
