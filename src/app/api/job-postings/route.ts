import { createAuthorizedRoute } from '@/shared/api/createAuthorizedRoute';
import { supabaseFetch } from '@/shared/api/supabaseFetch';
import {
  dedupeItems,
  parseJobItems,
  rankPostings,
  type ProfileRow,
} from '@/features/dashboard/utils/jobPostings';
import { TEST_USER_ID, TEST_PROFILE } from '@/shared/utils/testUser';
import type { PaginatedJobPostings } from '@/shared/types/job';

export const GET = createAuthorizedRoute(async ({ userId, request }) => {
  const { searchParams } = new URL(request.url);
  const offset = parseInt(searchParams.get('offset') ?? '0', 10) || 0;
  const limit = parseInt(searchParams.get('limit') ?? '12', 10) || 12;
  const baseUrl = process.env.JOB_API_BASE_URL;
  const serviceKey = process.env.JOB_API_KEY;

  if (!baseUrl || !serviceKey) {
    throw new Error('JOB_API_BASE_URL 또는 JOB_API_KEY 환경변수가 없습니다.');
  }

  const testProfile: ProfileRow | undefined =
    userId === TEST_USER_ID ? TEST_PROFILE : undefined;

  const [profileRows, bookmarkRows, jobXml] = await Promise.all([
    testProfile
      ? Promise.resolve([testProfile])
      : supabaseFetch<ProfileRow[]>(
          `/rest/v1/profiles?user_id=eq.${userId}&select=mobility,hand_usage,stamina,communication,region_primary`,
        ),
    userId === TEST_USER_ID
      ? Promise.resolve([])
      : supabaseFetch<{ posting_url: string }[]>(
          `/rest/v1/bookmarks?user_id=eq.${userId}&select=posting_url`,
        ),
    fetch(
      `${baseUrl}?serviceKey=${encodeURIComponent(serviceKey)}&numOfRows=100&pageNo=1`,
      { next: { revalidate: 300 } },
    ).then((r) => {
      if (!r.ok) throw new Error(`Job API 오류: ${r.status}`);
      return r.text();
    }),
  ]);

  const profile = profileRows[0];
  const bookmarkedUrls = new Set(bookmarkRows.map((r) => r.posting_url));
  const unique = dedupeItems(parseJobItems(jobXml));
  const ranked = rankPostings(unique, profile, bookmarkedUrls);

  const items = ranked.slice(offset, offset + limit);
  const nextOffset = offset + limit < ranked.length ? offset + limit : null;

  return {
    items,
    nextOffset,
    total: ranked.length,
  } satisfies PaginatedJobPostings;
});
