'use client';

import { Bookmark, BookmarkCheck, MapPin, Calendar, Eye } from 'lucide-react';

import type { JobPosting } from '@/shared/types/job';
import { FitBadge } from '@/shared/ui/FitBadge';

type JobCardProps = {
  job: JobPosting;
  onBookmarkToggle: (id: number) => void;
};

export function JobCard({ job, onBookmarkToggle }: JobCardProps) {
  return (
    <article
      aria-label={job.title}
      className="relative flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-5 transition-ui hover:border-primary-border"
    >
      <header className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <FitBadge level={job.fitLevel} />
          <h3 className="text-[0.9375rem] font-semibold leading-[1.5] text-gray-900 line-clamp-1">
            {job.title}
          </h3>
          <p className="text-[0.875rem] text-gray-500">{job.companyName}</p>
        </div>
        <button
          type="button"
          onClick={() => onBookmarkToggle(job.id)}
          aria-label={job.bookmarked ? '북마크 해제' : '북마크 추가'}
          aria-pressed={job.bookmarked}
          className="transition-ui mt-0.5 shrink-0 rounded-sm p-1 text-gray-400 hover:text-primary"
        >
          {job.bookmarked ? (
            <BookmarkCheck
              size={20}
              strokeWidth={1.5}
              className="text-primary"
              aria-hidden="true"
            />
          ) : (
            <Bookmark size={20} strokeWidth={1.5} aria-hidden="true" />
          )}
        </button>
      </header>

      <dl className="flex flex-wrap gap-x-4 gap-y-1.5">
        <div className="flex items-center gap-1">
          <MapPin
            size={16}
            strokeWidth={1.5}
            className="text-gray-400"
            aria-hidden="true"
          />
          <dt className="sr-only">지역</dt>
          <dd className="text-[0.8125rem] text-gray-500">{job.location}</dd>
        </div>
        <div className="flex items-center gap-1">
          <dt className="sr-only">근무 형태</dt>
          <dd className="text-[0.8125rem] text-gray-500">{job.workType}</dd>
        </div>
        <div className="flex items-center gap-1">
          <dt className="sr-only">급여</dt>
          <dd className="text-[0.8125rem] font-semibold text-gray-700">
            {job.salary}
          </dd>
        </div>
      </dl>

      <p className="text-[0.8125rem] leading-[1.5] text-primary line-clamp-1">
        <span className="text-gray-400">매칭 포인트</span>
        &nbsp;{job.matchPoints}
      </p>

      <footer className="flex items-center justify-between border-t border-gray-100 pt-3">
        <div className="flex items-center gap-1 text-gray-400">
          <Calendar size={14} strokeWidth={1.5} aria-hidden="true" />
          <span className="text-[0.75rem]">
            <span className="sr-only">마감일</span>
            {job.deadline}
          </span>
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <Eye size={14} strokeWidth={1.5} aria-hidden="true" />
          <span className="tabular-nums text-[0.75rem]">
            <span className="sr-only">조회수</span>
            {job.views.toLocaleString()}
          </span>
        </div>
      </footer>
    </article>
  );
}
