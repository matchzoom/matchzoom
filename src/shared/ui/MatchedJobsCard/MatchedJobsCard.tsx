import type { MatchedJob } from '@/shared/types/job';
import { FitBadge } from '@/shared/ui/FitBadge';

type MatchedJobsCardProps = {
  userName: string;
  jobs: MatchedJob[];
};

export function MatchedJobsCard({ userName, jobs }: MatchedJobsCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-6 border-l-[3px] border-primary pl-[10px] text-[1rem] font-semibold leading-[1.5] text-gray-900">
        {userName}님에게 맞는 직종 TOP 3
      </h3>
      <ol className="flex flex-col gap-3" aria-label="매칭 직종 목록">
        {jobs.map((job, index) => (
          <li
            key={job.id}
            className="flex items-center gap-4 rounded-md border border-gray-200 bg-white px-4 py-3"
          >
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-gray-100 text-[0.75rem] font-semibold text-gray-500 tabular-nums"
              aria-label={`${index + 1}위`}
            >
              {index + 1}
            </span>
            <span className="flex-1 text-[0.9375rem] font-semibold leading-[1.5] text-gray-900">
              {job.name}
            </span>
            <div className="flex items-center gap-3">
              <FitBadge level={job.fitLevel} />
              <span className="tabular-nums text-[0.875rem] font-semibold text-primary">
                {job.matchRate}%
              </span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
