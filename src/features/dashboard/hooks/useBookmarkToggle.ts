'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { JobPosting } from '@/shared/types/job';
import { addBookmark, removeBookmark } from '../api/bookmarkApi';
import { JOB_POSTINGS_QUERY_KEY } from './useJobPostings';
import { useCurrentUser } from '@/shared/hooks/useCurrentUser';

export function useBookmarkToggle() {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  const [loginModalOpen, setLoginModalOpen] = useState(false);

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
      await queryClient.cancelQueries({ queryKey: JOB_POSTINGS_QUERY_KEY });

      const previous = queryClient.getQueryData<JobPosting[]>(
        JOB_POSTINGS_QUERY_KEY,
      );

      queryClient.setQueryData<JobPosting[]>(
        JOB_POSTINGS_QUERY_KEY,
        (old = []) =>
          old.map((p) =>
            p.id === job.id ? { ...p, bookmarked: !p.bookmarked } : p,
          ),
      );

      return { previous };
    },

    onError: (_err, _job, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(JOB_POSTINGS_QUERY_KEY, ctx.previous);
      }
    },
  });

  return {
    toggle: (job: JobPosting) => {
      if (user?.isTestUser) {
        setLoginModalOpen(true);
        return;
      }
      mutate(job);
    },
    loginModalOpen,
    closeLoginModal: () => setLoginModalOpen(false),
  };
}
