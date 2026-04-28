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

type InfiniteJobData = InfiniteData<PaginatedJobPostings>;

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

      const queries = queryClient.getQueriesData<InfiniteJobData>({
        queryKey: QUERY_KEYS.jobPostingsInfinite,
      });

      queries.forEach(([queryKey, data]) => {
        if (!data) return;
        queryClient.setQueryData<InfiniteJobData>(queryKey, {
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            items: page.items.map((p) =>
              p.id === job.id ? { ...p, bookmarked: !p.bookmarked } : p,
            ),
          })),
        });
      });

      return { previous: queries };
    },

    onError: (_err, _job, ctx) => {
      ctx?.previous?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
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
