import { bffFetch } from '@/shared/api/bffFetch';
import type { JobPosting, PaginatedJobPostings } from '@/shared/types/job';

export const getJobPostings = (signal?: AbortSignal): Promise<JobPosting[]> =>
  bffFetch<JobPosting[]>('/job-postings', { method: 'GET', signal });

export const getJobPostingsPaginated = (
  offset: number,
  limit: number,
  signal?: AbortSignal,
): Promise<PaginatedJobPostings> =>
  bffFetch<PaginatedJobPostings>(
    `/job-postings?offset=${offset}&limit=${limit}`,
    { method: 'GET', signal },
  );
