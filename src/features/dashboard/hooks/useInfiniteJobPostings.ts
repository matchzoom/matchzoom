'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/utils/queryKeys';
import { getPaginatedJobPostings } from '../api/jobPostingsApi';

const INITIAL_LIMIT = 12;
const PAGE_SIZE = 3;

export function useInfiniteJobPostings() {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.jobPostings,
    queryFn: ({ pageParam, signal }) =>
      getPaginatedJobPostings(
        pageParam,
        pageParam === 0 ? INITIAL_LIMIT : PAGE_SIZE,
        signal,
      ),
    initialPageParam: 0,
    getNextPageParam: (last) => last.nextOffset,
    staleTime: 5 * 60 * 1000,
  });
}
