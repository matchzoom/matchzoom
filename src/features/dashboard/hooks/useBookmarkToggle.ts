'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { JobPosting } from '@/shared/types/job';
import { addBookmark, removeBookmark } from '../api/bookmarkApi';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
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
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.jobPostings });

      const previous = queryClient.getQueryData<JobPosting[]>(
        QUERY_KEYS.jobPostings,
      );

      queryClient.setQueryData<JobPosting[]>(
        QUERY_KEYS.jobPostings,
        (old = []) =>
          old.map((p) =>
            p.id === job.id ? { ...p, bookmarked: !p.bookmarked } : p,
          ),
      );

      return { previous };
    },

    onError: (_err, _job, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(QUERY_KEYS.jobPostings, ctx.previous);
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
