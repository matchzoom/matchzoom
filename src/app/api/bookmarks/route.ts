import { createAuthorizedRoute } from '@/shared/api/createAuthorizedRoute';
import { supabaseFetch } from '@/shared/api/supabaseFetch';
import { isApiError } from '@/shared/utils/errorGuards';
import { TEST_USER_ID } from '@/shared/constants/testUser';

type BookmarkRow = {
  id: number;
  posting_title: string;
  posting_url: string;
  company_name: string;
  deadline: string;
  fit_level: string;
  created_at: string;
};

type AddBookmarkBody = {
  postingTitle: string;
  postingUrl: string;
  companyName: string;
  deadline: string;
  fitLevel: string;
};

export const GET = createAuthorizedRoute(async ({ userId }) => {
  if (userId === TEST_USER_ID) return [];

  const rows = await supabaseFetch<BookmarkRow[]>(
    `/rest/v1/bookmarks?user_id=eq.${userId}&select=id,posting_title,posting_url,company_name,deadline,fit_level,created_at&order=created_at.desc`,
  );

  return rows.map((row) => ({
    id: row.id,
    postingTitle: row.posting_title,
    postingUrl: row.posting_url,
    companyName: row.company_name,
    deadline: row.deadline,
    fitLevel: row.fit_level,
    createdAt: row.created_at,
  }));
});

export const POST = createAuthorizedRoute<AddBookmarkBody>(
  async ({ userId, body }) => {
    if (userId === TEST_USER_ID) return;

    try {
      await supabaseFetch<BookmarkRow[]>('/rest/v1/bookmarks', {
        method: 'POST',
        headers: {
          Prefer: 'resolution=ignore-duplicates,return=representation',
        },
        body: JSON.stringify({
          user_id: userId,
          posting_title: body!.postingTitle,
          posting_url: body!.postingUrl,
          company_name: body!.companyName,
          deadline: body!.deadline,
          fit_level: body!.fitLevel,
        }),
      });
    } catch (err) {
      if (isApiError(err) && err.status === 409) return;
      throw err;
    }
  },
);

export const DELETE = createAuthorizedRoute(async ({ userId, request }) => {
  if (userId === TEST_USER_ID) return;

  const { searchParams } = new URL(request.url);
  const postingUrl = searchParams.get('postingUrl');

  if (!postingUrl) {
    throw Object.assign(new Error('postingUrl이 필요합니다.'), { status: 400 });
  }

  await supabaseFetch(
    `/rest/v1/bookmarks?user_id=eq.${userId}&posting_url=eq.${encodeURIComponent(postingUrl)}`,
    { method: 'DELETE' },
  );
});
