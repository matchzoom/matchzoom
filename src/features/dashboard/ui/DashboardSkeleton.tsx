'use client';

import { AIResultCard } from '@/shared/ui/AIResultCard';
import { JobListSection } from './JobListSection';

export function DashboardSkeleton() {
  return (
    <div className="py-10 md:py-16">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-[60px] px-4 md:px-5 lg:px-6">
        <section aria-labelledby="result-summary-heading">
          <h2 id="result-summary-heading" className="sr-only">
            검사 결과 요약
          </h2>
          <AIResultCard isLoading userName="" axes={[]} summary="" jobs={[]} />
        </section>

        <section aria-labelledby="job-postings-heading">
          <h2 id="job-postings-heading" className="sr-only">
            맞춤 채용공고
          </h2>
          <JobListSection
            isLoading
            isLoadingUser
            userName=""
            postings={[]}
            onBookmarkToggle={() => {}}
          />
        </section>
      </div>
    </div>
  );
}
