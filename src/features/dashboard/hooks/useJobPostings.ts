'use client';

import { useQuery } from '@tanstack/react-query';

import { getJobPostings } from '../api/jobPostingsApi';

export function useJobPostings() {
  return useQuery({
    queryKey: ['job-postings'],
    queryFn: getJobPostings,
  });
}
