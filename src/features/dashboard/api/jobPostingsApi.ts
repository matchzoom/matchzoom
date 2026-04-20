import { bffFetch } from '@/shared/api/bffFetch';
import type { JobPosting } from '@/shared/types/job';

export const getJobPostings = (): Promise<JobPosting[]> =>
  bffFetch<JobPosting[]>('/job-postings', { method: 'GET' });
