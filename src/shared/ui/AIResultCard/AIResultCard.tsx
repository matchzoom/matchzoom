'use client';

import type { PersonalityAxis } from '@/shared/types/job';
import { MatchedJobsCard } from '@/shared/ui/MatchedJobsCard';
import { PersonalityRadarChart } from '@/shared/ui/PersonalityRadarChart';
import { Skeleton } from '@/shared/ui/Skeleton';
import type { MatchedJob } from '@/shared/types/job';

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
        <MatchedJobsCard
          userName={userName}
          jobs={jobs}
          isLoading={isLoading}
          className="rounded-none border-0 bg-transparent"
        />
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
