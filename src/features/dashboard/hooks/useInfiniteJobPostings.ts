'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { getJobPostingsPaginated } from '../api/jobPostingsApi';
import { QUERY_KEYS } from '@/shared/utils/queryKeys';
import type { FitLevel } from '@/shared/types/job';

const INITIAL_LIMIT = 12;
const SUBSEQUENT_LIMIT = 3;

export function useInfiniteJobPostings(
  sigungu: string | null,
  fitLevel: FitLevel | null,
) {
  return useInfiniteQuery({
    queryKey: [...QUERY_KEYS.jobPostingsInfinite, { sigungu, fitLevel }],
    queryFn: ({ pageParam, signal }) => {
      const offset = pageParam as number;
      const limit = offset === 0 ? INITIAL_LIMIT : SUBSEQUENT_LIMIT;
      return getJobPostingsPaginated(
        { offset, limit, sigungu, fitLevel },
        signal,
      );
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasMore) return undefined;
      return lastPage.offset + lastPage.items.length;
    },
    staleTime: 5 * 60 * 1000,
  });
}
