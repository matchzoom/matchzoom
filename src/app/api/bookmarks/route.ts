import { createAuthorizedRoute } from '@/shared/api/createAuthorizedRoute';
import { supabaseFetch } from '@/shared/api/supabaseFetch';

type BookmarkRow = {
  id: number;
  posting_title: string;
  posting_url: string;
  created_at: string;
};

export const GET = createAuthorizedRoute(async ({ userId }) => {
  const rows = await supabaseFetch<BookmarkRow[]>(
    `/rest/v1/bookmarks?user_id=eq.${userId}&select=id,posting_title,posting_url,created_at&order=created_at.desc`,
  );

  return rows.map((row) => ({
    id: row.id,
    postingTitle: row.posting_title,
    postingUrl: row.posting_url,
    createdAt: row.created_at,
  }));
});
