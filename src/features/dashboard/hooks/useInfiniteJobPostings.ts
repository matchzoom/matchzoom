'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { getJobPostingsPaginated } from '../api/jobPostingsApi';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';

const INITIAL_LIMIT = 12;
const SUBSEQUENT_LIMIT = 3;

export function useInfiniteJobPostings() {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.jobPostingsInfinite,
    queryFn: ({ pageParam, signal }) => {
      const limit =
        (pageParam as number) === 0 ? INITIAL_LIMIT : SUBSEQUENT_LIMIT;
      return getJobPostingsPaginated(pageParam as number, limit, signal);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasMore) return undefined;
      return lastPage.offset + lastPage.items.length;
    },
    staleTime: 5 * 60 * 1000,
  });
}
