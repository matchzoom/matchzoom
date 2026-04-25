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
              className="flex flex-col gap-2 rounded-md border border-gray-200 px-4 py-3"
            >
              <Skeleton className="h-5 w-16 rounded-sm" />
              <Skeleton className="h-9 w-full rounded-sm" />
            </li>
          ))}
        </ol>
      ) : (
        <ol className="flex flex-col gap-3" aria-label="매칭 직종 목록">
          {jobs.map((job, index) => (
            <li
              key={job.id}
              aria-label={`${index + 1}위: ${job.name}, 매칭률 ${job.matchRate}%`}
              className="flex flex-col gap-2 rounded-md border border-gray-200 bg-white px-4 py-3"
            >
              <FitBadge level={job.fitLevel} />
              <div className="relative h-9 w-full overflow-hidden rounded-sm bg-gray-100">
                <div
                  className="absolute inset-y-0 left-0 bg-primary/20"
                  style={{ width: `${job.matchRate}%` }}
                  role="progressbar"
                  aria-valuenow={job.matchRate}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
                <div className="absolute inset-0 flex items-center justify-between px-3">
                  <span className="text-[0.875rem] font-semibold text-gray-900">
                    {job.name}
                  </span>
                  <span className="tabular-nums text-[0.875rem] font-bold text-primary">
                    {job.matchRate}%
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
