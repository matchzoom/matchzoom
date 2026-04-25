'use client';

import { useQuery } from '@tanstack/react-query';
import { getJobPostings } from '../api/jobPostingsApi';
import { JOB_POSTINGS_QUERY_KEY } from '../utils/queryKeys';

export { JOB_POSTINGS_QUERY_KEY };

export function useJobPostings() {
  return useQuery({
    queryKey: JOB_POSTINGS_QUERY_KEY,
    queryFn: ({ signal }) => getJobPostings(signal),
    staleTime: 5 * 60 * 1000,
  });
}
