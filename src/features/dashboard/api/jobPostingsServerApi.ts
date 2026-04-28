import { supabaseFetch } from '@/shared/api/supabaseFetch';
import {
  dedupeItems,
  parseJobItems,
  rankPostings,
  type ProfileRow,
} from '../utils/jobPostings';
import { TEST_USER_ID, TEST_PROFILE } from '@/shared/constants/testUser';
import type { JobPosting } from '@/shared/types/job';

export async function getJobPostingsData(
  userId: string,
): Promise<JobPosting[]> {
  const baseUrl = process.env.JOB_API_BASE_URL;
  const serviceKey = process.env.JOB_API_KEY;

  if (!baseUrl || !serviceKey) {
    throw new Error('JOB_API_BASE_URL 또는 JOB_API_KEY 환경변수가 없습니다.');
  }

  const isTest = userId === TEST_USER_ID;
  const testProfile = isTest
    ? (TEST_PROFILE as unknown as ProfileRow)
    : undefined;

  const [profileRows, bookmarkRows, jobXml] = await Promise.all([
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

  return rankPostings(unique, profile, bookmarkedUrls);
}
