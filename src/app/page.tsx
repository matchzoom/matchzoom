import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { supabaseFetch } from '@/shared/api/supabaseFetch';
import { getServerSession } from '@/shared/utils/serverSession';
import { DashboardView } from '@/features/dashboard';
import {
  dedupeItems,
  parseJobItems,
  rankPostings,
  type ProfileRow,
} from '@/features/dashboard/utils/jobPostings';
import { LandingPage } from '@/features/landing';
import { JOB_POSTINGS_QUERY_KEY } from '@/features/dashboard/hooks/useJobPostings';
import { PROFILE_QUERY_KEY } from '@/features/profile/hooks/useProfile';
import { MATCH_RESULT_QUERY_KEY } from '@/features/match/hooks/useMatchResult';
import {
  TEST_USER_ID,
  TEST_PROFILE,
  TEST_MATCH,
} from '@/shared/utils/testUser';
import type { Profile } from '@/shared/types/profile';
import type { MatchResult } from '@/shared/types/match';
import type { JobPosting } from '@/shared/types/job';

async function getDashboardData(userId: string) {
  const [profileRows, matchRows] = await Promise.all([
    supabaseFetch<Profile[]>(`/rest/v1/profiles?user_id=eq.${userId}&select=*`),
    supabaseFetch<MatchResult[]>(
      `/rest/v1/match_results?user_id=eq.${userId}&select=*`,
    ),
  ]);
  return { profile: profileRows[0] ?? null, matchResult: matchRows[0] ?? null };
}

async function getJobPostingsData(
  userId: string,
  profile: ProfileRow | undefined,
): Promise<JobPosting[]> {
  const baseUrl = process.env.JOB_API_BASE_URL;
  const serviceKey = process.env.JOB_API_KEY;
  if (!baseUrl || !serviceKey) return [];

  const [bookmarkRows, jobXml] = await Promise.all([
    userId === TEST_USER_ID
      ? Promise.resolve([])
      : supabaseFetch<{ posting_url: string }[]>(
          `/rest/v1/bookmarks?user_id=eq.${userId}&select=posting_url`,
        ),
    fetch(
      `${baseUrl}?serviceKey=${encodeURIComponent(serviceKey)}&numOfRows=100&pageNo=1`,
      { next: { revalidate: 300 } },
    ).then((r) => r.text()),
  ]);

  const bookmarkedUrls = new Set(bookmarkRows.map((r) => r.posting_url));
  const unique = dedupeItems(parseJobItems(jobXml));
  return rankPostings(unique, profile, bookmarkedUrls);
}

export default async function Home() {
  const session = await getServerSession();

  if (session) {
    const { profile, matchResult } = session.isTestUser
      ? { profile: TEST_PROFILE, matchResult: TEST_MATCH }
      : await getDashboardData(session.userId);

    if (profile) {
      const profileRow: ProfileRow = {
        mobility: profile.mobility,
        hand_usage: profile.hand_usage,
        stamina: profile.stamina,
        communication: profile.communication,
        region_primary: profile.region_primary,
      };
      const jobPostings = await getJobPostingsData(session.userId, profileRow);

      const queryClient = new QueryClient();
      queryClient.setQueryData(PROFILE_QUERY_KEY, profile);
      queryClient.setQueryData(MATCH_RESULT_QUERY_KEY, matchResult);
      queryClient.setQueryData(JOB_POSTINGS_QUERY_KEY, jobPostings);

      return (
        <HydrationBoundary state={dehydrate(queryClient)}>
          <DashboardView />
        </HydrationBoundary>
      );
    }

    return <LandingPage isLoggedIn={true} />;
  }

  return <LandingPage isLoggedIn={false} />;
}
