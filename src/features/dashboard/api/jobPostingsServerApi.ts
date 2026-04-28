import { supabaseFetch } from '@/shared/api/supabaseFetch';
import {
  applyFilters,
  dedupeItems,
  extractFilterOptions,
  parseJobItems,
  parseTotalCount,
  rankPostings,
  type ProfileRow,
} from '../utils/jobPostings';
import { TEST_USER_ID, TEST_PROFILE } from '@/shared/utils/testUser';
import type { FitLevel, PaginatedJobPostings } from '@/shared/types/job';

type Params = {
  offset?: number;
  limit?: number;
  sigungu?: string | null;
  fitLevel?: FitLevel | null;
};

export async function getJobPostingsData(
  userId: string,
  params: Params = {},
): Promise<PaginatedJobPostings> {
  const offset = params.offset ?? 0;
  const limit = params.limit ?? 12;
  const sigungu = params.sigungu ?? null;
  const fitLevel = params.fitLevel ?? null;

  const baseUrl = process.env.JOB_API_BASE_URL;
  const serviceKey = process.env.JOB_API_KEY;

  if (!baseUrl || !serviceKey) {
    throw new Error('JOB_API_BASE_URL 또는 JOB_API_KEY 환경변수가 없습니다.');
  }

  const fetchPage = (page: number) =>
    fetch(
      `${baseUrl}?serviceKey=${encodeURIComponent(serviceKey)}&numOfRows=100&pageNo=${page}`,
      { next: { revalidate: 300 } },
    ).then((r) => {
      if (!r.ok) throw new Error(`Job API 오류: ${r.status}`);
      return r.text();
    });

  const isTest = userId === TEST_USER_ID;
  const testProfile = isTest
    ? (TEST_PROFILE as unknown as ProfileRow)
    : undefined;

  const [profileRows, bookmarkRows, firstXml] = await Promise.all([
    testProfile
      ? Promise.resolve<ProfileRow[]>([testProfile])
      : supabaseFetch<ProfileRow[]>(
          `/rest/v1/profiles?user_id=eq.${userId}&select=mobility,hand_usage,stamina,communication,region_primary`,
        ),
    isTest
      ? Promise.resolve<{ posting_url: string }[]>([])
      : supabaseFetch<{ posting_url: string }[]>(
          `/rest/v1/bookmarks?user_id=eq.${userId}&select=posting_url`,
        ),
    fetchPage(1),
  ]);

  const totalPages = Math.ceil(parseTotalCount(firstXml) / 100);
  const restXmls =
    totalPages > 1
      ? await Promise.all(
          Array.from({ length: totalPages - 1 }, (_, i) => fetchPage(i + 2)),
        )
      : [];

  const profile = profileRows[0];
  const bookmarkedUrls = new Set(bookmarkRows.map((r) => r.posting_url));
  const allItems = dedupeItems([
    ...parseJobItems(firstXml),
    ...restXmls.flatMap(parseJobItems),
  ]);

  const ranked = rankPostings(allItems, profile, bookmarkedUrls);
  const province = profile?.region_primary?.split(' ')[0] ?? null;
  const filterOptions = extractFilterOptions(ranked, sigungu, province);
  const filtered = applyFilters(ranked, sigungu, fitLevel);
  const items = filtered.slice(offset, offset + limit);

  return {
    items,
    hasMore: offset + items.length < filtered.length,
    offset,
    filterOptions,
  };
}
