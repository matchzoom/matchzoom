import { bffFetch } from '@/shared/api/bffFetch';
import type { FitLevel, PaginatedJobPostings } from '@/shared/types/job';

type PaginationParams = {
  offset: number;
  limit: number;
  sigungu?: string | null;
  fitLevel?: FitLevel | null;
};

export const getJobPostingsPaginated = (
  params: PaginationParams,
  signal?: AbortSignal,
): Promise<PaginatedJobPostings> => {
  const query = new URLSearchParams({
    offset: String(params.offset),
    limit: String(params.limit),
  });
  if (params.sigungu) query.set('sigungu', params.sigungu);
  if (params.fitLevel) query.set('fitLevel', params.fitLevel);

  return bffFetch<PaginatedJobPostings>(`/job-postings?${query.toString()}`, {
    method: 'GET',
    signal,
  });
};
