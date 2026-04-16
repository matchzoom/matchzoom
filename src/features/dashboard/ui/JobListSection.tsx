'use client';

import type { JobPosting } from '@/shared/types/job';
import { Skeleton } from '@/shared/ui/Skeleton';
import { JobCard } from './JobCard';

type JobListSectionProps = {
  childName: string;
  postings: JobPosting[];
  onBookmarkToggle: (id: number) => void;
  isLoading?: boolean;
};

export function JobListSection({
  childName,
  postings,
  onBookmarkToggle,
  isLoading = false,
}: JobListSectionProps) {
  return (
    <section aria-labelledby="job-list-heading">
      <h2
        id="job-list-heading"
        className="mb-5 border-l-[3px] border-primary pl-[10px] text-[1rem] font-semibold leading-[1.5] text-gray-900"
      >
        {childName}님에게 맞는 채용공고
      </h2>

      {isLoading ? (
        <ul
          aria-busy="true"
          aria-label="채용공고 로딩 중"
          className="grid gap-4 md:grid-cols-2"
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i} className="rounded-lg border border-gray-200 p-5">
              <Skeleton className="mb-3 h-6 w-16 rounded-sm" />
              <Skeleton className="mb-2 h-5 w-3/4 rounded-sm" />
              <Skeleton className="mb-4 h-4 w-1/2 rounded-sm" />
              <Skeleton className="h-4 w-full rounded-sm" />
            </li>
          ))}
        </ul>
      ) : postings.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 py-16 text-center">
          <p className="text-[0.9375rem] font-semibold text-gray-700">
            조건에 맞는 채용공고가 없어요
          </p>
          <p className="text-[0.875rem] text-gray-400">필터를 조정해 보세요</p>
        </div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2" aria-label="채용공고 목록">
          {postings.map((job) => (
            <li key={job.id}>
              <JobCard job={job} onBookmarkToggle={onBookmarkToggle} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
