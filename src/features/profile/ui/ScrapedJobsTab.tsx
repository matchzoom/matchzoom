import Link from 'next/link';

import type { Bookmark } from '@/shared/types/bookmark';
import type { JobPosting } from '@/shared/types/job';
import { JobCard } from '@/shared/ui/JobCard';

function toJobPosting(bookmark: Bookmark): JobPosting {
  return {
    id: bookmark.id,
    title: bookmark.postingTitle,
    companyName: bookmark.companyName,
    location: '',
    salary: '',
    deadline: bookmark.deadline,
    empType: '',
    reqCareer: '',
    reqEduc: '',
    envConditions: [],
    fitLevel: bookmark.fitLevel || undefined,
    detailUrl: bookmark.postingUrl,
    bookmarked: true,
  };
}

type ScrapedJobsTabProps = {
  jobs: Bookmark[];
  onBookmarkToggle: (job: JobPosting) => void;
};

export function ScrapedJobsTab({
  jobs,
  onBookmarkToggle,
}: ScrapedJobsTabProps) {
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
        <ul
          className="grid gap-6 sm:grid-cols-2"
          aria-label="스크랩한 채용공고 목록"
        >
          {jobs.map((job) => (
            <li key={job.id}>
              <JobCard
                job={toJobPosting(job)}
                onBookmarkToggle={onBookmarkToggle}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
