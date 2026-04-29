'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import { getJobPostingsPage } from '../api/jobPostingsApi';
import {
  QUERY_KEYS,
  type JobPostingsListFilters,
} from '@/shared/constants/queryKeys';
import { JOB_POSTINGS_PAGE_SIZE } from '../constants/jobPostingsConfig';

export function useJobPostings(filters: JobPostingsListFilters) {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.jobPostings.list(filters),
    queryFn: ({ pageParam, signal }) =>
      getJobPostingsPage(
        {
          cursor: pageParam,
          limit: JOB_POSTINGS_PAGE_SIZE,
          sigungu: filters.sigungu,
          fitLevel: filters.fitLevel,
        },
        signal,
      ),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 5 * 60 * 1000,
  });
}
