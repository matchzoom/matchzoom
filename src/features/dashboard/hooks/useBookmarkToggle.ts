'use client';

import { useState } from 'react';
import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query';

import type { JobPosting, JobPostingsPage } from '@/shared/types/job';
import { addBookmark, removeBookmark } from '../api/bookmarkApi';
import { QUERY_KEYS } from '@/shared/utils/queryKeys';
import { useCurrentUser } from '@/shared/hooks/useCurrentUser';

type CachedJobList = InfiniteData<JobPostingsPage> | undefined;

function flipBookmark(data: CachedJobList, jobId: number): CachedJobList {
  if (!data) return data;
  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      items: page.items.map((p) =>
        p.id === jobId ? { ...p, bookmarked: !p.bookmarked } : p,
      ),
    })),
  };
}

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
        queryKey: QUERY_KEYS.jobPostings.all,
      });

      const previous = queryClient.getQueriesData<
        InfiniteData<JobPostingsPage>
      >({ queryKey: QUERY_KEYS.jobPostings.all });

      queryClient.setQueriesData<InfiniteData<JobPostingsPage>>(
        { queryKey: QUERY_KEYS.jobPostings.all },
        (old) => flipBookmark(old, job.id),
      );

      return { previous };
    },

    onError: (_err, _job, ctx) => {
      if (!ctx?.previous) return;
      for (const [key, data] of ctx.previous) {
        queryClient.setQueryData(key, data);
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
