import { Suspense } from 'react';
import { getServerSession } from '@/shared/utils/serverSession';
import { AIResultCard } from '@/shared/ui/AIResultCard';
import { JobListPrefetcher } from '@/features/dashboard/ui/JobListPrefetcher';
import { JobListSkeleton } from '@/features/dashboard/ui/JobListSkeleton';
import { getDashboardData } from '@/features/dashboard/api/dashboardServerApi';
import { LandingPage } from '@/features/landing';
import { toPersonalityAxes, toMatchedJobs } from '@/shared/utils/matchConvert';
import { TEST_PROFILE, TEST_MATCH } from '@/shared/constants/testUser';
import type { FitLevel } from '@/shared/types/job';

const VALID_FIT_LEVELS: readonly FitLevel[] = [
  '잘 맞아요',
  '도전해볼 수 있어요',
  '힘들 수 있어요',
];

function parseFitLevel(value: string | undefined): FitLevel | null {
  if (value && (VALID_FIT_LEVELS as string[]).includes(value))
    return value as FitLevel;
  return null;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ sigungu?: string; fitLevel?: string }>;
}) {
  const params = await searchParams;
  const sigungu = params.sigungu ?? null;
  const fitLevel = parseFitLevel(params.fitLevel);

  const session = await getServerSession();

  if (session) {
    const { profile, matchResult } = session.isTestUser
      ? { profile: TEST_PROFILE, matchResult: TEST_MATCH }
      : await getDashboardData(session.userId);

    if (profile) {
      return (
        <div className="py-10 md:py-16">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-[60px] px-4 md:px-5 lg:px-6">
            <section aria-labelledby="result-summary-heading">
              <h2 id="result-summary-heading" className="sr-only">
                검사 결과 요약
              </h2>
              <AIResultCard
                userName={profile.name}
                axes={
                  matchResult ? toPersonalityAxes(matchResult.radar_chart) : []
                }
                summary={matchResult?.summary_text ?? ''}
                jobs={matchResult ? toMatchedJobs(matchResult.top3_jobs) : []}
              />
            </section>

            <section aria-labelledby="job-postings-heading">
              <h2 id="job-postings-heading" className="sr-only">
                맞춤 채용공고
              </h2>
              <Suspense fallback={<JobListSkeleton />}>
                <JobListPrefetcher
                  userId={session.userId}
                  userName={profile.name}
                  sigungu={sigungu}
                  fitLevel={fitLevel}
                />
              </Suspense>
            </section>
          </div>
        </div>
      );
    }

    return <LandingPage isLoggedIn={true} />;
  }

  return <LandingPage isLoggedIn={false} />;
}
