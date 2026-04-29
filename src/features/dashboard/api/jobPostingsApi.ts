import { bffFetch } from '@/shared/api/bffFetch';
import type {
  FitLevel,
  JobPostingsFilterOptions,
  JobPostingsPage,
} from '@/shared/types/job';

export type GetJobPostingsPageParams = {
  cursor: number;
  limit: number;
  sigungu: string | null;
  fitLevel: FitLevel | null;
};

export const getJobPostingsPage = (
  params: GetJobPostingsPageParams,
  signal?: AbortSignal,
): Promise<JobPostingsPage> => {
  const qs = new URLSearchParams();
  qs.set('cursor', String(params.cursor));
  qs.set('limit', String(params.limit));
  if (params.sigungu) qs.set('sigungu', params.sigungu);
  if (params.fitLevel) qs.set('fitLevel', params.fitLevel);
  return bffFetch<JobPostingsPage>(`/job-postings?${qs.toString()}`, {
    method: 'GET',
    signal,
  });
};

export const getJobPostingsFilterOptions = (
  signal?: AbortSignal,
): Promise<JobPostingsFilterOptions> =>
  bffFetch<JobPostingsFilterOptions>('/job-postings/filter-options', {
    method: 'GET',
    signal,
  });
