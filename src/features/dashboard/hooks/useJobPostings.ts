'use client';

import { useQuery } from '@tanstack/react-query';
import { getJobPostings } from '../api/jobPostingsApi';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';

export function useJobPostings() {
  return useQuery({
    queryKey: QUERY_KEYS.jobPostings,
    queryFn: ({ signal }) => getJobPostings(signal),
    staleTime: 5 * 60 * 1000,
  });
}
