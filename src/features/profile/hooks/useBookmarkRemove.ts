'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { Bookmark } from '@/shared/types/bookmark';
import { removeBookmark } from '../api/bookmarksApi';

export function useBookmarkRemove() {
  const queryClient = useQueryClient();

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

  return (postingUrl: string) => mutate(postingUrl);
}
