'use client';

import { useState } from 'react';
import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query';

import type { JobPosting, PaginatedJobPostings } from '@/shared/types/job';
import { addBookmark, removeBookmark } from '../api/bookmarkApi';
import { QUERY_KEYS } from '@/shared/utils/queryKeys';
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
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.jobPostingsInfinite,
      });

      const previous = queryClient.getQueryData<
        InfiniteData<PaginatedJobPostings>
      >(QUERY_KEYS.jobPostingsInfinite);

      queryClient.setQueryData<InfiniteData<PaginatedJobPostings>>(
        QUERY_KEYS.jobPostingsInfinite,
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.map((p) =>
                p.id === job.id ? { ...p, bookmarked: !p.bookmarked } : p,
              ),
            })),
          };
        },
      );

      return { previous };
    },

    onError: (_err, _job, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(QUERY_KEYS.jobPostingsInfinite, ctx.previous);
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
