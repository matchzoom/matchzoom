'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useWindowVirtualizer } from '@tanstack/react-virtual';

import type { JobPosting } from '@/shared/types/job';
import { JobCard } from '@/shared/ui/JobCard';
import { useBreakpointLimit } from '../hooks/useBreakpointLimit';

const ESTIMATED_ROW_HEIGHT = 380;

type Props = {
  items: JobPosting[];
  onBookmarkToggle: (job: JobPosting) => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
};

export function VirtualJobList({
  items,
  onBookmarkToggle,
  hasNextPage = false,
  isFetchingNextPage = false,
  fetchNextPage,
}: Props) {
  const columns = useBreakpointLimit();
  const listRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [scrollMargin, setScrollMargin] = useState(0);

  useLayoutEffect(() => {
    setScrollMargin(listRef.current?.offsetTop ?? 0);
  }, []);

  const rowCount = Math.ceil(items.length / columns);

  const virtualizer = useWindowVirtualizer({
    count: rowCount,
    estimateSize: () => ESTIMATED_ROW_HEIGHT,
    scrollMargin,
    measureElement: (el) => el.getBoundingClientRect().height,
    overscan: 2,
  });

  // isFetchingNextPage 변화에도 observer를 재생성해 fetch 완료 후 sentinel이
  // 여전히 뷰포트에 있으면 자동 재발화시킨다
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !fetchNextPage) return;
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) fetchNextPage();
      },
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const ariaSetSize = hasNextPage ? -1 : items.length;

  return (
    <div ref={listRef}>
      <div
        role="list"
        aria-label="채용공고 목록"
        style={{ height: virtualizer.getTotalSize(), position: 'relative' }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const startIndex = virtualRow.index * columns;
          const rowItems = items.slice(startIndex, startIndex + columns);

          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start - scrollMargin}px)`,
                paddingBottom: 24,
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                  gap: 24,
                }}
              >
                {rowItems.map((job, colIndex) => (
                  <div
                    key={job.id}
                    role="listitem"
                    aria-setsize={ariaSetSize}
                    aria-posinset={startIndex + colIndex + 1}
                    className="min-w-0"
                  >
                    <JobCard job={job} onBookmarkToggle={onBookmarkToggle} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <div
          ref={sentinelRef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: 200,
            height: 1,
            width: '100%',
          }}
        />
      </div>

      {isFetchingNextPage && (
        <p
          role="status"
          aria-live="polite"
          className="py-6 text-center text-[0.875rem] text-gray-400"
        >
          불러오는 중…
        </p>
      )}
    </div>
  );
}
