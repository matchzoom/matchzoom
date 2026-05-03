'use client';

import type { FitLevel, JobPosting } from '@/shared/types/job';
import { Skeleton } from '@/shared/ui/Skeleton';
import { JobRegionFilter } from './JobRegionFilter';
import { VirtualJobList } from './VirtualJobList';
import { JOB_POSTINGS_PAGE_SIZE } from '../constants/jobPostingsConfig';

type JobListSectionProps = {
  userName: string;
  postings: JobPosting[];
  onBookmarkToggle: (job: JobPosting) => void;
  isLoading?: boolean;
  isLoadingUser?: boolean;
  isFiltering?: boolean;
  sigunguList?: string[];
  selectedSigungu?: string | null;
  onSelectSigungu?: (sigungu: string | null) => void;
  fitLevelList?: FitLevel[];
  selectedFitLevel?: FitLevel | null;
  onSelectFitLevel?: (fitLevel: FitLevel | null) => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
};

export function JobListSection({
  userName,
  postings,
  onBookmarkToggle,
  isLoading = false,
  isLoadingUser = false,
  isFiltering = false,
  sigunguList = [],
  selectedSigungu = null,
  onSelectSigungu,
  fitLevelList = [],
  selectedFitLevel = null,
  onSelectFitLevel,
  hasNextPage = false,
  isFetchingNextPage = false,
  onLoadMore,
}: JobListSectionProps) {
  const showSkeleton = isLoading || isLoadingUser;
  const showEmpty = !showSkeleton && postings.length === 0;

  return (
    <section aria-labelledby="job-list-heading">
      <h2
        id="job-list-heading"
        className="mb-1 text-[1.375rem] font-semibold leading-[1.5] text-gray-900"
      >
        {isLoadingUser ? '사용자' : userName}님에게 맞는 채용공고
      </h2>

      {showSkeleton ? (
        <div className="mb-8">
          <div className="mb-2 flex flex-wrap gap-2">
            <Skeleton className="h-8 w-10 rounded-sm" />
            <div className="w-px self-stretch bg-gray-200" />
            <Skeleton className="h-8 w-16 rounded-sm" />
            <Skeleton className="h-8 w-14 rounded-sm" />
            <Skeleton className="h-8 w-20 rounded-sm" />
            <Skeleton className="h-8 w-14 rounded-sm" />
            <Skeleton className="h-8 w-16 rounded-sm" />
            <Skeleton className="h-8 w-12 rounded-sm" />
            <Skeleton className="h-8 w-16 rounded-sm" />
            <Skeleton className="h-8 w-14 rounded-sm" />
            <Skeleton className="h-8 w-16 rounded-sm" />
            <Skeleton className="h-8 w-12 rounded-sm" />
          </div>
          <div className="mb-8 flex flex-wrap gap-2">
            <Skeleton className="h-8 w-20 rounded-sm" />
            <Skeleton className="h-8 w-28 rounded-sm" />
            <Skeleton className="h-8 w-24 rounded-sm" />
          </div>
        </div>
      ) : onSelectSigungu && onSelectFitLevel ? (
        <JobRegionFilter
          sigunguList={sigunguList}
          selectedSigungu={selectedSigungu}
          onSelectSigungu={onSelectSigungu}
          fitLevelList={fitLevelList}
          selectedFitLevel={selectedFitLevel}
          onSelectFitLevel={onSelectFitLevel}
        />
      ) : null}

      {showSkeleton ? (
        <ul
          aria-busy="true"
          aria-label="채용공고 로딩 중"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {Array.from({ length: JOB_POSTINGS_PAGE_SIZE }).map((_, i) => (
            <li
              key={i}
              className="min-w-0 rounded-lg border border-gray-200 p-5"
            >
              <Skeleton className="mb-3 h-6 w-16 rounded-sm" />
              <Skeleton className="mb-2 h-5 w-3/4 rounded-sm" />
              <Skeleton className="mb-4 h-4 w-1/2 rounded-sm" />
              <Skeleton className="h-4 w-full rounded-sm" />
            </li>
          ))}
        </ul>
      ) : (
        <div
          className={
            isFiltering
              ? 'pointer-events-none opacity-50 transition-opacity duration-200'
              : 'transition-opacity duration-200'
          }
          aria-busy={isFiltering}
        >
          {showEmpty ? (
            <div className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 py-16 text-center">
              <p className="text-[0.9375rem] font-semibold text-gray-700">
                희망 지역의 채용공고가 없어요
              </p>
              <p className="text-[0.875rem] text-gray-400">
                프로필에서 희망 지역을 변경하거나 나중에 다시 확인해보세요
              </p>
            </div>
          ) : (
            <VirtualJobList
              items={postings}
              onBookmarkToggle={onBookmarkToggle}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={onLoadMore}
            />
          )}
        </div>
      )}
    </section>
  );
}
