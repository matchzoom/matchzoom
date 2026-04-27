import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
  type InfiniteData,
} from '@tanstack/react-query';
import { getJobPostingsData } from '../api/jobPostingsServerApi';
import { QUERY_KEYS } from '@/shared/utils/queryKeys';
import { JobListClient } from './JobListClient';
import type { PaginatedJobPostings } from '@/shared/types/job';

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
  const firstPage = await getJobPostingsData(userId);

  queryClient.setQueryData<InfiniteData<PaginatedJobPostings>>(
    QUERY_KEYS.jobPostingsInfinite,
    { pages: [firstPage], pageParams: [0] },
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <JobListClient profileProvinces={profileProvinces} userName={userName} />
    </HydrationBoundary>
  );
}
