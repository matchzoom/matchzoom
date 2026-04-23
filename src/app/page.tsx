import { Suspense } from 'react';
import { supabaseFetch } from '@/shared/api/supabaseFetch';
import { getServerSession } from '@/shared/utils/serverSession';
import { DashboardView, DashboardSkeleton } from '@/features/dashboard';
import { LandingPage } from '@/features/landing';

export default async function Home() {
  const session = await getServerSession();

  if (session?.userId) {
    const hasProfile =
      session.isTestUser ||
      (await supabaseFetch<{ id: number }[]>(
        `/rest/v1/profiles?user_id=eq.${session.userId}&select=id&limit=1`,
      ).then((rows) => rows.length > 0));

    if (hasProfile) {
      return (
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardView />
        </Suspense>
      );
    }

    return <LandingPage isLoggedIn={true} />;
  }

  return <LandingPage isLoggedIn={false} />;
}
