import { unstable_cache } from 'next/cache';
import { supabaseFetch } from '@/shared/api/supabaseFetch';
import {
  applyFilters,
  dedupeItems,
  getFilterOptions,
  parseJobItems,
  parseTotalCount,
  rankPostings,
  type JobPostingsFilters,
  type ProfileRow,
  type RawItem,
} from '../utils/jobPostings';
import { TEST_USER_ID, TEST_PROFILE } from '@/shared/utils/testUser';
import type {
  JobPosting,
  JobPostingsFilterOptions,
  JobPostingsPage,
} from '@/shared/types/job';

const EXTERNAL_PAGE_SIZE = 100;
const MAX_EXTERNAL_PAGES = 10;

async function fetchExternalPage(pageNo: number): Promise<string> {
  const baseUrl = process.env.JOB_API_BASE_URL;
  const serviceKey = process.env.JOB_API_KEY;

  if (!baseUrl || !serviceKey) {
    throw new Error('JOB_API_BASE_URL 또는 JOB_API_KEY 환경변수가 없습니다.');
  }

  const res = await fetch(
    `${baseUrl}?serviceKey=${encodeURIComponent(serviceKey)}&numOfRows=${EXTERNAL_PAGE_SIZE}&pageNo=${pageNo}`,
    { next: { revalidate: 300 } },
  );
  if (!res.ok) throw new Error(`Job API 오류: ${res.status}`);
  return res.text();
}

export async function fetchAllExternalPages(): Promise<RawItem[]> {
  const firstXml = await fetchExternalPage(1);
  const totalCount = parseTotalCount(firstXml);
  const totalPages = Math.min(
    Math.ceil(totalCount / EXTERNAL_PAGE_SIZE),
    MAX_EXTERNAL_PAGES,
  );

  const restXmls =
    totalPages <= 1
      ? []
      : await Promise.all(
          Array.from({ length: totalPages - 1 }, (_, i) =>
            fetchExternalPage(i + 2),
          ),
        );

  return [firstXml, ...restXmls].flatMap(parseJobItems);
}

const getCachedRawItems = unstable_cache(
  async () => dedupeItems(await fetchAllExternalPages()),
  ['job-postings-raw'],
  { revalidate: 300 },
);

export async function getRankedPostings(userId: string): Promise<JobPosting[]> {
  const isTest = userId === TEST_USER_ID;

  const [items, profileRows, bookmarkRows] = await Promise.all([
    getCachedRawItems(),
    isTest
      ? Promise.resolve<ProfileRow[]>([TEST_PROFILE as unknown as ProfileRow])
      : supabaseFetch<ProfileRow[]>(
          `/rest/v1/profiles?user_id=eq.${userId}&select=mobility,hand_usage,stamina,communication,region_primary`,
        ),
    isTest
      ? Promise.resolve<{ posting_url: string }[]>([])
      : supabaseFetch<{ posting_url: string }[]>(
          `/rest/v1/bookmarks?user_id=eq.${userId}&select=posting_url`,
        ),
  ]);

  const profile = profileRows[0];
  const bookmarkedUrls = new Set(bookmarkRows.map((r) => r.posting_url));
  return rankPostings(items, profile, bookmarkedUrls);
}

export async function getJobPostingsPage(
  userId: string,
  params: { cursor: number; limit: number } & JobPostingsFilters,
): Promise<JobPostingsPage> {
  const ranked = await getRankedPostings(userId);
  const filtered = applyFilters(ranked, {
    sigungu: params.sigungu,
    fitLevel: params.fitLevel,
  });
  const end = params.cursor + params.limit;
  return {
    items: filtered.slice(params.cursor, end),
    nextCursor: end < filtered.length ? end : null,
  };
}

export async function getJobPostingsFilterOptions(
  userId: string,
): Promise<JobPostingsFilterOptions> {
  const ranked = await getRankedPostings(userId);
  return getFilterOptions(ranked);
}
