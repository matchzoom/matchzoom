import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

import type { Bookmark } from '@/shared/types/bookmark';

type ScrapedJobsTabProps = {
  jobs: Bookmark[];
};

export function ScrapedJobsTab({ jobs }: ScrapedJobsTabProps) {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-[1.125rem] font-bold leading-[1.35] text-gray-900">
          스크랩한 공고{' '}
          <span className="tabular-nums text-[1rem] font-semibold text-primary">
            {jobs.length}건
          </span>
        </h1>
      </header>

      {jobs.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-lg border border-gray-200 bg-white py-16 text-center">
          <p className="text-[0.9375rem] text-gray-500">
            아직 스크랩한 공고가 없어요.
          </p>
          <Link
            href="/"
            className="transition-ui inline-flex h-10 cursor-pointer items-center justify-center rounded-md border border-primary bg-white px-4 text-[0.9375rem] font-semibold text-primary hover:bg-primary-bg"
          >
            맞춤 공고 보러가기
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-3" aria-label="스크랩한 채용공고 목록">
          {jobs.map((job) => (
            <li key={job.id}>
              <a
                href={job.postingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-ui flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-4 hover:border-primary-border"
              >
                <span className="line-clamp-1 text-[0.9375rem] font-medium text-gray-900">
                  {job.postingTitle}
                </span>
                <ExternalLink
                  size={16}
                  strokeWidth={1.5}
                  className="shrink-0 text-gray-400"
                  aria-hidden="true"
                />
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
