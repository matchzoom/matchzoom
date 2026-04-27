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
  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.jobPostings,
    queryFn: () => getJobPostingsData(userId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <JobListClient profileProvinces={profileProvinces} userName={userName} />
    </HydrationBoundary>
  );
}
