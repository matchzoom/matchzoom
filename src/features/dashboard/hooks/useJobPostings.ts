'use client';

import { useQuery } from '@tanstack/react-query';
import { getJobPostings } from '../api/jobPostingsApi';

export const JOB_POSTINGS_QUERY_KEY = ['job-postings'] as const;

export function useJobPostings() {
  return useQuery({
    queryKey: JOB_POSTINGS_QUERY_KEY,
    queryFn: ({ signal }) => getJobPostings(signal),
    staleTime: 5 * 60 * 1000,
  });
}
