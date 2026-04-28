import { bffFetch } from '@/shared/api/bffFetch';
import type { PaginatedJobPostings } from '@/shared/types/job';

export const getPaginatedJobPostings = (
  offset: number,
  limit: number,
  signal?: AbortSignal,
): Promise<PaginatedJobPostings> =>
  bffFetch<PaginatedJobPostings>(
    `/job-postings?offset=${offset}&limit=${limit}`,
    { method: 'GET', signal },
  );
