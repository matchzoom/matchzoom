'use client';

import { useDashboard } from '../hooks/useDashboard';
import { useJobPostings } from '../hooks/useJobPostings';
import { JobListSection } from './JobListSection';
import { MatchedJobsCard } from './MatchedJobsCard';
import { PersonalitySummaryCard } from './PersonalitySummaryCard';

export function DashboardView() {
  const { childName, personalityAxes, personalitySummary, matchedJobs } =
    useDashboard();
  const { postings, toggleBookmark } = useJobPostings();

  return (
    <div className="py-10 md:py-16">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-4 md:px-5 lg:px-6">
        <section aria-labelledby="result-summary-heading">
          <h2 id="result-summary-heading" className="sr-only">
            검사 결과 요약
          </h2>
          <div className="grid gap-5 lg:grid-cols-2">
            <PersonalitySummaryCard
              childName={childName}
              axes={personalityAxes}
              summary={personalitySummary}
            />
            <MatchedJobsCard childName={childName} jobs={matchedJobs} />
          </div>
        </section>

        <section aria-labelledby="job-postings-heading">
          <h2 id="job-postings-heading" className="sr-only">
            맞춤 채용공고
          </h2>
          <div className="flex flex-col gap-5">
            <JobListSection
              childName={childName}
              postings={postings}
              onBookmarkToggle={toggleBookmark}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
