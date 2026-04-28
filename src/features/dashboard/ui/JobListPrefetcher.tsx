import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';
import { getJobPostingsData } from '../api/jobPostingsServerApi';
import { QUERY_KEYS } from '@/shared/utils/queryKeys';
import { JobListClient } from './JobListClient';

type Props = {
  userId: string;
  userName: string;
};

export async function JobListPrefetcher({ userId, userName }: Props) {
  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: [
      ...QUERY_KEYS.jobPostingsInfinite,
      { sigungu: null, fitLevel: null },
    ],
    queryFn: () => getJobPostingsData(userId, { offset: 0, limit: 12 }),
    initialPageParam: 0,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <JobListClient userName={userName} />
    </HydrationBoundary>
  );
}
