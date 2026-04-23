import { Suspense } from 'react';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { supabaseFetch } from '@/shared/api/supabaseFetch';
import { getServerSession } from '@/shared/utils/serverSession';
import { DashboardView, DashboardSkeleton } from '@/features/dashboard';
import { LandingPage } from '@/features/landing';
import { TEST_PROFILE, TEST_MATCH } from '@/shared/utils/testUser';
import type { Profile } from '@/shared/types/profile';
import type { MatchResult } from '@/shared/types/match';

async function getDashboardData(userId: string) {
  const [profileRows, matchRows] = await Promise.all([
    supabaseFetch<Profile[]>(`/rest/v1/profiles?user_id=eq.${userId}&select=*`),
    supabaseFetch<MatchResult[]>(
      `/rest/v1/match_results?user_id=eq.${userId}&select=*`,
    ),
  ]);
  return { profile: profileRows[0] ?? null, matchResult: matchRows[0] ?? null };
}

export default async function Home() {
  const session = await getServerSession();

  if (session) {
    const { profile, matchResult } = session.isTestUser
      ? { profile: TEST_PROFILE, matchResult: TEST_MATCH }
      : await getDashboardData(session.userId);

    if (profile) {
      const queryClient = new QueryClient();
      queryClient.setQueryData(['profile'], profile);
      queryClient.setQueryData(['match-result'], matchResult);

      return (
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense fallback={<DashboardSkeleton />}>
            <DashboardView />
          </Suspense>
        </HydrationBoundary>
      );
    }

    return <LandingPage isLoggedIn={true} />;
  }

  return <LandingPage isLoggedIn={false} />;
}
