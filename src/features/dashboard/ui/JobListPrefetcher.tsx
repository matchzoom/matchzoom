import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';

import {
  getJobPostingsFilterOptions,
  getJobPostingsPage,
} from '../api/jobPostingsServerApi';
import { JOB_POSTINGS_PAGE_SIZE_FIRST } from '../hooks/useJobPostings';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { JobListClient } from '../JobListClient';
import type { FitLevel } from '@/shared/types/job';

type Props = {
  userId: string;
  userName: string;
  sigungu?: string | null;
  fitLevel?: FitLevel | null;
};

export async function JobListPrefetcher({
  userId,
  userName,
  sigungu = null,
  fitLevel = null,
}: Props) {
  const queryClient = new QueryClient();
  const filters = { sigungu, fitLevel };

  await Promise.all([
    queryClient.prefetchInfiniteQuery({
      queryKey: QUERY_KEYS.jobPostings.list(filters),
      queryFn: () =>
        getJobPostingsPage(userId, {
          cursor: 0,
          limit: JOB_POSTINGS_PAGE_SIZE_FIRST,
          sigungu,
          fitLevel,
        }),
      initialPageParam: 0,
    }),
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.jobPostings.filterOptions,
      queryFn: () => getJobPostingsFilterOptions(userId),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <JobListClient userName={userName} />
    </HydrationBoundary>
  );
}
