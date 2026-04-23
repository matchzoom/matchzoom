'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { getJobPostings } from '../api/jobPostingsApi';

export function useJobPostings() {
  return useSuspenseQuery({
    queryKey: ['job-postings'],
    queryFn: ({ signal }) => getJobPostings(signal),
    staleTime: 5 * 60 * 1000,
  });
}
