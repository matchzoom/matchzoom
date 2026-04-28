'use client';

import { useWindowVirtualizer } from '@tanstack/react-virtual';
import type { JobPosting } from '@/shared/types/job';
import { JobCard } from './JobCard';
import { useBreakpointLimit } from '../hooks/useBreakpointLimit';

type VirtualJobListProps = {
  postings: JobPosting[];
  onBookmarkToggle: (job: JobPosting) => void;
};

export function VirtualJobList({
  postings,
  onBookmarkToggle,
}: VirtualJobListProps) {
  const columns = useBreakpointLimit();
  const rowCount = Math.ceil(postings.length / columns);

  const virtualizer = useWindowVirtualizer({
    count: rowCount,
    estimateSize: () => 220,
    overscan: 2,
  });

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
      <ul
        role="list"
        aria-label="채용공고 목록"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          transform: `translateY(${virtualItems[0]?.start ?? 0}px)`,
        }}
      >
        {virtualItems.map((virtualRow) => {
          const startIndex = virtualRow.index * columns;
          const rowItems = postings.slice(startIndex, startIndex + columns);

          return (
            <li
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              className="mb-6 grid gap-6"
              style={{
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              }}
            >
              {rowItems.map((job, colIdx) => (
                <div
                  key={job.id}
                  role="listitem"
                  aria-setsize={postings.length}
                  aria-posinset={startIndex + colIdx + 1}
                >
                  <JobCard job={job} onBookmarkToggle={onBookmarkToggle} />
                </div>
              ))}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
