'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { Bookmark } from '@/shared/types/bookmark';
import { removeBookmark } from '../api/bookmarksApi';
import { useCurrentUser } from '@/shared/hooks/useCurrentUser';

export function useBookmarkRemove() {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const { mutate } = useMutation({
    mutationFn: (postingUrl: string) => removeBookmark(postingUrl),

    onMutate: async (postingUrl) => {
      await queryClient.cancelQueries({ queryKey: ['bookmarks'] });

      const previous = queryClient.getQueryData<Bookmark[]>(['bookmarks']);

      queryClient.setQueryData<Bookmark[]>(['bookmarks'], (old = []) =>
        old.filter((b) => b.postingUrl !== postingUrl),
      );

      return { previous };
    },

    onError: (_err, _url, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(['bookmarks'], ctx.previous);
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
