import { bffFetch } from '@/shared/api/bffFetch';

export const addBookmark = (
  postingTitle: string,
  postingUrl: string,
  companyName: string,
  deadline: string,
  fitLevel: string,
): Promise<void> =>
  bffFetch<void>('/bookmarks', {
    method: 'POST',
    body: JSON.stringify({
      postingTitle,
      postingUrl,
      companyName,
      deadline,
      fitLevel,
    }),
  });

export const removeBookmark = (postingUrl: string): Promise<void> =>
  bffFetch<void>(`/bookmarks?postingUrl=${encodeURIComponent(postingUrl)}`, {
    method: 'DELETE',
  });
