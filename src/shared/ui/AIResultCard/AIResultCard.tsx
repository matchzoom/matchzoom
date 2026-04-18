import type { MatchedJob, PersonalityAxis } from '@/shared/types/job';
import { FitBadge } from '@/shared/ui/FitBadge';
import { PersonalityRadarChart } from '@/shared/ui/PersonalityRadarChart';

type AIResultCardProps = {
  userName: string;
  axes: PersonalityAxis[];
  summary: string;
  jobs: MatchedJob[];
};

export function AIResultCard({
  userName,
  axes,
  summary,
  jobs,
}: AIResultCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      {/* 상단: 직업 성향 + 맞는 직종 TOP 3 */}
      <div className="grid divide-y divide-gray-100 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
        {/* 좌: 레이더 차트 */}
        <div className="flex flex-col items-center p-6">
          <h3 className="mb-6 w-full border-l-[3px] border-primary pl-[10px] text-[1rem] font-semibold leading-[1.5] text-gray-900">
            {userName}님의 직업 성향
          </h3>
          <PersonalityRadarChart data={axes} />
        </div>

        {/* 우: 맞는 직종 TOP 3 */}
        <div className="p-6">
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
      </div>

      {/* 하단: AI 성향 요약 */}
      <div className="border-t border-gray-100 p-6">
        <p className="mb-2 text-[0.875rem] font-semibold text-gray-500">
          AI 성향 요약
        </p>
        <p className="text-[0.9375rem] leading-[1.6] text-gray-900">
          &ldquo;{summary}&rdquo;
        </p>
      </div>
    </div>
  );
}
