'use client';

import type { FitLevel, JobPosting } from '@/shared/types/job';
import { Skeleton } from '@/shared/ui/Skeleton';
import { JobCard } from './JobCard';
import { JobRegionFilter } from './JobRegionFilter';

type JobListSectionProps = {
  userName: string;
  postings: JobPosting[];
  onBookmarkToggle: (job: JobPosting) => void;
  isLoading?: boolean;
  sigunguList?: string[];
  selectedSigungu?: string | null;
  onSelectSigungu?: (sigungu: string | null) => void;
  fitLevelList?: FitLevel[];
  selectedFitLevel?: FitLevel | null;
  onSelectFitLevel?: (fitLevel: FitLevel | null) => void;
};

export function JobListSection({
  userName,
  postings,
  onBookmarkToggle,
  isLoading = false,
  sigunguList = [],
  selectedSigungu = null,
  onSelectSigungu,
  fitLevelList = [],
  selectedFitLevel = null,
  onSelectFitLevel,
}: JobListSectionProps) {
  return (
    <section aria-labelledby="job-list-heading">
      <h2
        id="job-list-heading"
        className="mb-5 border-l-[3px] border-primary pl-[10px] text-[1rem] font-semibold leading-[1.5] text-gray-900"
      >
        {userName}님에게 맞는 채용공고
      </h2>

      {!isLoading && onSelectSigungu && onSelectFitLevel && (
        <JobRegionFilter
          sigunguList={sigunguList}
          selectedSigungu={selectedSigungu}
          onSelectSigungu={onSelectSigungu}
          fitLevelList={fitLevelList}
          selectedFitLevel={selectedFitLevel}
          onSelectFitLevel={onSelectFitLevel}
        />
      )}

      {isLoading ? (
        <ul
          aria-busy="true"
          aria-label="채용공고 로딩 중"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
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
            희망 지역의 채용공고가 없어요
          </p>
          <p className="text-[0.875rem] text-gray-400">
            프로필에서 희망 지역을 변경하거나 나중에 다시 확인해보세요
          </p>
        </div>
      ) : (
        <ul
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          aria-label="채용공고 목록"
        >
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
