import type { MatchedJob } from '@/shared/types/job';
import { cn } from '@/shared/utils/cn';
import { FitBadge } from '@/shared/ui/FitBadge';
import { Skeleton } from '@/shared/ui/Skeleton';

type MatchedJobsCardProps = {
  userName: string;
  jobs: MatchedJob[];
  isLoading?: boolean;
  className?: string;
};

export function MatchedJobsCard({
  userName,
  jobs,
  isLoading = false,
  className,
}: MatchedJobsCardProps) {
  const displayName = isLoading ? '사용자' : userName;

  return (
    <div
      className={cn(
        'rounded-lg border border-gray-200 bg-white p-6',
        className,
      )}
    >
      <h3 className="mb-6 border-l-[3px] border-primary pl-[10px] text-[1rem] font-semibold leading-[1.5] text-gray-900">
        {displayName}님에게 맞는 직종 TOP 3
      </h3>
      {isLoading ? (
        <ol className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <li
              key={i}
              className="flex items-center gap-4 rounded-md border border-gray-200 px-4 py-3"
            >
              <Skeleton className="h-6 w-6 shrink-0 rounded-sm" />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <Skeleton className="h-5 w-16 rounded-sm" />
                <Skeleton className="h-5 w-3/4 rounded-sm" />
              </div>
              <Skeleton className="h-5 w-10 shrink-0 rounded-sm" />
            </li>
          ))}
        </ol>
      ) : (
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
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <FitBadge level={job.fitLevel} className="self-start" />
                <span className="text-[0.9375rem] font-semibold leading-[1.5] text-gray-900">
                  {job.name}
                </span>
              </div>
              <span className="shrink-0 tabular-nums text-[0.875rem] font-semibold text-primary">
                {job.matchRate}%
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
