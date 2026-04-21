'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { JobPosting } from '@/shared/types/job';
import { addBookmark, removeBookmark } from '../api/bookmarkApi';

export function useBookmarkToggle() {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (job: JobPosting) =>
      job.bookmarked
        ? removeBookmark(job.detailUrl ?? '')
        : addBookmark(
            job.title,
            job.detailUrl ?? '',
            job.companyName,
            job.deadline,
            job.fitLevel ?? '',
          ),

    onMutate: async (job) => {
      await queryClient.cancelQueries({ queryKey: ['job-postings'] });

      const previous = queryClient.getQueryData<JobPosting[]>(['job-postings']);

      queryClient.setQueryData<JobPosting[]>(['job-postings'], (old = []) =>
        old.map((p) =>
          p.id === job.id ? { ...p, bookmarked: !p.bookmarked } : p,
        ),
      );

      return { previous };
    },

    onError: (_err, _job, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(['job-postings'], ctx.previous);
      }
    },
  });

  return (job: JobPosting) => mutate(job);
}
