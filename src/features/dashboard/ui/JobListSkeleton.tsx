import { Skeleton } from '@/shared/ui/Skeleton';
import { JOB_POSTINGS_PAGE_SIZE } from '../constants/jobPostingsConfig';

export function JobListSkeleton() {
  return (
    <section aria-labelledby="job-list-heading" aria-busy="true">
      <Skeleton className="mb-4 h-8 w-56 rounded-sm" />
      <div className="mb-8 flex flex-wrap gap-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-14 rounded-sm" />
        ))}
      </div>
      <ul
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        aria-label="채용공고 로딩 중"
      >
        {Array.from({ length: JOB_POSTINGS_PAGE_SIZE }).map((_, i) => (
          <li key={i} className="rounded-lg border border-gray-200 p-5">
            <Skeleton className="mb-3 h-6 w-16 rounded-sm" />
            <Skeleton className="mb-2 h-5 w-3/4 rounded-sm" />
            <Skeleton className="mb-4 h-4 w-1/2 rounded-sm" />
            <Skeleton className="h-4 w-full rounded-sm" />
          </li>
        ))}
      </ul>
    </section>
  );
}
