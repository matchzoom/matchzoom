'use client';

import type { MatchedJob, PersonalityAxis } from '@/shared/types/job';
import { FitBadge } from '@/shared/ui/FitBadge';
import { PersonalityRadarChart } from '@/shared/ui/PersonalityRadarChart';
import { Skeleton } from '@/shared/ui/Skeleton';

type AIResultCardProps = {
  userName: string;
  axes: PersonalityAxis[];
  summary: string;
  jobs: MatchedJob[];
  isLoading?: boolean;
};

export function AIResultCard({
  userName,
  axes,
  summary,
  jobs,
  isLoading = false,
}: AIResultCardProps) {
  const displayName = isLoading ? '사용자' : userName;

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      {/* 상단: 직업 성향 + 맞는 직종 TOP 3 */}
      <div className="grid divide-y divide-gray-100 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
        {/* 좌: 레이더 차트 */}
        <div className="flex flex-col items-center p-6">
          <h3 className="mb-6 w-full border-l-[3px] border-primary pl-[10px] text-[1rem] font-semibold leading-[1.5] text-gray-900">
            {displayName}님의 직업 성향
          </h3>
          {isLoading ? (
            <Skeleton className="h-[240px] w-[240px] rounded-full" />
          ) : (
            <PersonalityRadarChart data={axes} />
          )}
        </div>

        {/* 우: 맞는 직종 TOP 3 */}
        <div className="p-6">
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
      </div>

      {/* 하단: AI 성향 요약 */}
      <div className="border-t border-gray-100 p-6">
        <p className="mb-2 text-[0.875rem] font-semibold text-gray-500">
          AI 성향 요약
        </p>
        {isLoading ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-full rounded-sm" />
            <Skeleton className="h-4 w-4/5 rounded-sm" />
          </div>
        ) : (
          <p className="text-[0.9375rem] leading-[1.6] text-gray-900">
            &ldquo;{summary}&rdquo;
          </p>
        )}
      </div>
    </div>
  );
}
