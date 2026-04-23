import { Suspense } from 'react';
import { supabaseFetch } from '@/shared/api/supabaseFetch';
import { DashboardView, DashboardSkeleton } from '@/features/dashboard';
import { LandingPage } from '@/features/landing';
import { getServerSession } from '@/shared/utils/getServerSession';

export default async function Home() {
  const session = await getServerSession();

  if (session) {
    if (session.isTestUser) {
      return (
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardView />
        </Suspense>
      );
    }

    const rows = await supabaseFetch<{ id: number }[]>(
      `/rest/v1/profiles?user_id=eq.${session.userId}&select=id&limit=1`,
    );
    const hasProfile = rows.length > 0;

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
