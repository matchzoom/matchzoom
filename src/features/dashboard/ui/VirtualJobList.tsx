'use client';

import { useRef, useEffect, useLayoutEffect, useState } from 'react';
import { useWindowVirtualizer } from '@tanstack/react-virtual';

import type { JobPosting } from '@/shared/types/job';
import { JobCard } from '@/shared/ui/JobCard';

const ESTIMATED_ROW_HEIGHT = 260;

type VirtualJobListProps = {
  items: JobPosting[];
  columns: number;
  onBookmarkToggle: (job: JobPosting) => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
};

export function VirtualJobList({
  items,
  columns,
  onBookmarkToggle,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: VirtualJobListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [scrollMargin, setScrollMargin] = useState(0);

  const hasNextPageRef = useRef(hasNextPage);
  const isFetchingRef = useRef(isFetchingNextPage);
  const fetchNextPageRef = useRef(fetchNextPage);

  useEffect(() => {
    hasNextPageRef.current = hasNextPage;
  }, [hasNextPage]);
  useEffect(() => {
    isFetchingRef.current = isFetchingNextPage;
  }, [isFetchingNextPage]);
  useEffect(() => {
    fetchNextPageRef.current = fetchNextPage;
  }, [fetchNextPage]);

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

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          hasNextPageRef.current &&
          !isFetchingRef.current
        ) {
          fetchNextPageRef.current();
        }
      },
      { threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

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
          style={{
            position: 'absolute',
            bottom: 200,
            height: 1,
            width: '100%',
          }}
        />
      </div>

      {isFetchingNextPage && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 56,
          }}
        >
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--color-primary)] border-t-transparent" />
        </div>
      )}
    </div>
  );
}
