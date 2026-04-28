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
import { QUERY_KEYS } from '@/shared/utils/queryKeys';
import { JobListClient } from './JobListClient';

type Props = {
  userId: string;
  userName: string;
};

export async function JobListPrefetcher({ userId, userName }: Props) {
  const queryClient = new QueryClient();

  const defaultFilters = { sigungu: null, fitLevel: null };

  await Promise.all([
    queryClient.prefetchInfiniteQuery({
      queryKey: QUERY_KEYS.jobPostings.list(defaultFilters),
      queryFn: () =>
        getJobPostingsPage(userId, {
          cursor: 0,
          limit: JOB_POSTINGS_PAGE_SIZE_FIRST,
          sigungu: null,
          fitLevel: null,
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
