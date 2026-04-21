import { bffFetch } from '@/shared/api/bffFetch';
import type { Bookmark } from '@/shared/types/bookmark';

export const getBookmarks = (): Promise<Bookmark[]> =>
  bffFetch<Bookmark[]>('/bookmarks', { method: 'GET' });

export const removeBookmark = (postingUrl: string): Promise<void> =>
  bffFetch<void>(`/bookmarks?postingUrl=${encodeURIComponent(postingUrl)}`, {
    method: 'DELETE',
  });
