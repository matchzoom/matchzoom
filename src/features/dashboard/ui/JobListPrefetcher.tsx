import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';
import { getJobPostingsData } from '../api/jobPostingsServerApi';
import { JOB_POSTINGS_QUERY_KEY } from '../utils/queryKeys';
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
    queryKey: JOB_POSTINGS_QUERY_KEY,
    queryFn: () => getJobPostingsData(userId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <JobListClient profileProvinces={profileProvinces} userName={userName} />
    </HydrationBoundary>
  );
}
