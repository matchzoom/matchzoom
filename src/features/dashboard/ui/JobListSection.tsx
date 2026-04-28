'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { useInView } from 'react-intersection-observer';

import type { FitLevel, JobPosting } from '@/shared/types/job';
import { Skeleton } from '@/shared/ui/Skeleton';
import { JobCard } from './JobCard';
import { JobRegionFilter } from './JobRegionFilter';

type JobListSectionProps = {
  userName: string;
  postings: JobPosting[];
  onBookmarkToggle: (job: JobPosting) => void;
  isLoading?: boolean;
  isLoadingUser?: boolean;
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

function useItemsPerRow(): number {
  const [itemsPerRow, setItemsPerRow] = useState(3);

  useEffect(() => {
    const compute = () => {
      if (window.matchMedia('(min-width: 1024px)').matches) return 3;
      if (window.matchMedia('(min-width: 640px)').matches) return 2;
      return 1;
    };
    setItemsPerRow(compute());
    const handler = () => setItemsPerRow(compute());
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return itemsPerRow;
}

export function JobListSection({
  userName,
  postings,
  onBookmarkToggle,
  isLoading = false,
  isLoadingUser = false,
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
  const itemsPerRow = useItemsPerRow();
  const rowCount = Math.ceil(postings.length / itemsPerRow);

  const parentRef = useRef<HTMLDivElement | null>(null);
  const [parentOffset, setParentOffset] = useState(0);

  const setParentRef = useCallback((node: HTMLDivElement | null) => {
    parentRef.current = node;
    if (node) setParentOffset(node.offsetTop);
  }, []);

  useEffect(() => {
    const handler = () => {
      if (parentRef.current) {
        setParentOffset(parentRef.current.offsetTop);
      }
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const virtualizer = useWindowVirtualizer({
    count: rowCount,
    estimateSize: () => 380,
    overscan: 1,
    scrollMargin: parentOffset,
  });

  const { ref: sentinelRef, inView } = useInView({
    rootMargin: '200px',
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && onLoadMore) {
      onLoadMore();
    }
  }, [inView, hasNextPage, isFetchingNextPage, onLoadMore]);

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
          {Array.from({ length: 6 }).map((_, i) => (
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
      ) : showEmpty ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 py-16 text-center">
          <p className="text-[0.9375rem] font-semibold text-gray-700">
            희망 지역의 채용공고가 없어요
          </p>
          <p className="text-[0.875rem] text-gray-400">
            프로필에서 희망 지역을 변경하거나 나중에 다시 확인해보세요
          </p>
        </div>
      ) : (
        <>
          <div ref={setParentRef} aria-label="채용공고 목록">
            <div
              className="relative w-full"
              style={{ height: `${virtualizer.getTotalSize()}px` }}
            >
              {virtualizer.getVirtualItems().map((vRow) => {
                const start = vRow.index * itemsPerRow;
                const rowItems = postings.slice(start, start + itemsPerRow);
                return (
                  <div
                    key={vRow.key}
                    data-index={vRow.index}
                    ref={virtualizer.measureElement}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      transform: `translateY(${vRow.start - virtualizer.options.scrollMargin}px)`,
                    }}
                  >
                    <ul className="grid grid-cols-1 gap-6 pb-6 sm:grid-cols-2 lg:grid-cols-3">
                      {rowItems.map((job) => (
                        <li key={job.id} className="min-w-0">
                          <JobCard
                            job={job}
                            onBookmarkToggle={onBookmarkToggle}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          <div ref={sentinelRef} aria-hidden="true" className="h-px" />

          {isFetchingNextPage && (
            <p
              role="status"
              aria-live="polite"
              className="py-6 text-center text-[0.875rem] text-gray-400"
            >
              불러오는 중…
            </p>
          )}
        </>
      )}
    </section>
  );
}
