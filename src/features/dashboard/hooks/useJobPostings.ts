'use client';

import { useQuery } from '@tanstack/react-query';
import { getJobPostings } from '../api/jobPostingsApi';

export function useJobPostings() {
  return useQuery({
    queryKey: ['job-postings'],
    queryFn: ({ signal }) => getJobPostings(signal),
    staleTime: 5 * 60 * 1000,
  });
}
