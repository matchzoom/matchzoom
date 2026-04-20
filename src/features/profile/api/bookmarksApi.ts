import { bffFetch } from '@/shared/api/bffFetch';
import type { Bookmark } from '@/shared/types/bookmark';

export const getBookmarks = (): Promise<Bookmark[]> =>
  bffFetch<Bookmark[]>('/bookmarks', { method: 'GET' });
