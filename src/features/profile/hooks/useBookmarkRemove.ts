'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { Bookmark } from '@/shared/types/bookmark';
import { removeBookmark } from '../api/bookmarksApi';
import { BOOKMARKS_QUERY_KEY } from './useScrapedJobs';
import { useCurrentUser } from '@/shared/hooks/useCurrentUser';

export function useBookmarkRemove() {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const { mutate } = useMutation({
    mutationFn: (postingUrl: string) => removeBookmark(postingUrl),

    onMutate: async (postingUrl) => {
      await queryClient.cancelQueries({ queryKey: BOOKMARKS_QUERY_KEY });

      const previous =
        queryClient.getQueryData<Bookmark[]>(BOOKMARKS_QUERY_KEY);

      queryClient.setQueryData<Bookmark[]>(BOOKMARKS_QUERY_KEY, (old = []) =>
        old.filter((b) => b.postingUrl !== postingUrl),
      );

      return { previous };
    },

    onError: (_err, _url, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(BOOKMARKS_QUERY_KEY, ctx.previous);
      }
    },
  });

  return {
    remove: (postingUrl: string) => {
      if (user?.isTestUser) {
        setLoginModalOpen(true);
        return;
      }
      mutate(postingUrl);
    },
    loginModalOpen,
    closeLoginModal: () => setLoginModalOpen(false),
  };
}
