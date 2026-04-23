import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { verifySession } from '@/shared/utils/session';
import { AUTH_COOKIE_KEYS } from '@/shared/utils/authCookies';
import { supabaseFetch } from '@/shared/api/supabaseFetch';
import { DashboardView, DashboardSkeleton } from '@/features/dashboard';
import { LandingPage } from '@/features/landing';

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_KEYS.SESSION)?.value;
  const session = token ? await verifySession(token) : null;

  if (session?.userId) {
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
