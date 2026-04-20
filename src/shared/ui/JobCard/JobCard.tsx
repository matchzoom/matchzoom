'use client';

import {
  Bookmark,
  BookmarkCheck,
  MapPin,
  Calendar,
  Briefcase,
} from 'lucide-react';

import type { JobPosting } from '@/shared/types/job';
import { FitBadge } from '@/shared/ui/FitBadge';

function formatCareer(raw: string): string {
  if (!raw || raw === '무관') return '경력 무관';

  const yearMatch = raw.match(/(\d+)년/);
  const monthMatch = raw.match(/(\d+)개월/);
  const years = yearMatch ? parseInt(yearMatch[1], 10) : 0;
  const months = monthMatch ? parseInt(monthMatch[1], 10) : 0;

  if (years === 0 && months === 0) return '경력 무관';
  if (years === 0) return `경력 ${months}개월 이상`;
  return `경력 ${years}년 이상`;
}

type JobCardProps = {
  job: JobPosting;
  onBookmarkToggle: (id: number) => void;
};

export function JobCard({ job, onBookmarkToggle }: JobCardProps) {
  return (
    <article
      aria-label={job.title}
      className="relative flex h-full w-full flex-col rounded-lg border border-gray-200 bg-white p-5 transition-ui hover:border-primary-border"
    >
      <header className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          {job.fitLevel && (
            <FitBadge level={job.fitLevel} className="self-start" />
          )}
          {!job.fitLevel && job.empType && (
            <span className="self-start rounded-sm bg-primary/10 px-2 py-0.5 text-[0.75rem] font-medium text-primary">
              {job.empType}
            </span>
          )}
          <h3 className="line-clamp-1 text-[0.9375rem] font-semibold leading-[1.5] text-gray-900">
            {job.title}
          </h3>
          <p className="text-[0.875rem] text-gray-500">{job.companyName}</p>
        </div>
        <button
          type="button"
          onClick={() => onBookmarkToggle(job.id)}
          aria-label={job.bookmarked ? '북마크 해제' : '북마크 추가'}
          aria-pressed={job.bookmarked}
          className="transition-ui -mr-1 shrink-0 cursor-pointer rounded-sm text-gray-400 hover:text-primary"
        >
          {job.bookmarked ? (
            <BookmarkCheck
              size={24}
              strokeWidth={1.5}
              className="text-primary"
              aria-hidden="true"
            />
          ) : (
            <Bookmark size={24} strokeWidth={1.5} aria-hidden="true" />
          )}
        </button>
      </header>

      <dl className="mt-3 flex min-w-0 flex-col gap-1.5 pb-3">
        <div className="flex min-w-0 items-center gap-1">
          <MapPin
            size={16}
            strokeWidth={1.5}
            className="shrink-0 text-gray-400"
            aria-hidden="true"
          />
          <dt className="sr-only">지역</dt>
          <dd className="truncate text-[0.8125rem] text-gray-500">
            {job.location}
          </dd>
        </div>
        {job.reqCareer && (
          <div className="flex items-center gap-1">
            <Briefcase
              size={16}
              strokeWidth={1.5}
              className="shrink-0 text-gray-400"
              aria-hidden="true"
            />
            <dt className="sr-only">경력</dt>
            <dd className="text-[0.8125rem] text-gray-500">
              {formatCareer(job.reqCareer)}
            </dd>
          </div>
        )}
      </dl>

      <footer className="mt-auto border-t border-gray-100 pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-gray-400">
            <Calendar size={14} strokeWidth={1.5} aria-hidden="true" />
            <span className="text-[0.75rem]">
              <span className="sr-only">마감일</span>~{job.deadline}
            </span>
          </div>
          <span className="text-[0.75rem] font-medium text-gray-700">
            {job.salary}
          </span>
        </div>
      </footer>
    </article>
  );
}
