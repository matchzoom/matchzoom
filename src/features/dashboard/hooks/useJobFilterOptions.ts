'use client';

import { useQuery } from '@tanstack/react-query';

import { getJobPostingsFilterOptions } from '../api/jobPostingsApi';
import { QUERY_KEYS } from '@/shared/utils/queryKeys';

export function useJobFilterOptions() {
  return useQuery({
    queryKey: QUERY_KEYS.jobPostings.filterOptions,
    queryFn: ({ signal }) => getJobPostingsFilterOptions(signal),
    staleTime: 5 * 60 * 1000,
  });
}
