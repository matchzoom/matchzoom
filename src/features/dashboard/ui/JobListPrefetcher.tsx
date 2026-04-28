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
  profileProvinces: string[];
  userName: string;
};

export async function JobListPrefetcher({
  userId,
  profileProvinces,
  userName,
}: Props) {
  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: QUERY_KEYS.jobPostings,
    queryFn: () => getJobPostingsData(userId, 0, 12),
    initialPageParam: 0,
    getNextPageParam: (last: Awaited<ReturnType<typeof getJobPostingsData>>) =>
      last.nextOffset,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <JobListClient profileProvinces={profileProvinces} userName={userName} />
    </HydrationBoundary>
  );
}
