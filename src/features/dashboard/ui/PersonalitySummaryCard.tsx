import type { PersonalityAxis } from '@/shared/types/job';
import { PersonalityRadarChart } from './PersonalityRadarChart';

type PersonalitySummaryCardProps = {
  childName: string;
  axes: PersonalityAxis[];
  summary: string;
};

export function PersonalitySummaryCard({
  childName,
  axes,
  summary,
}: PersonalitySummaryCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-6 border-l-[3px] border-primary pl-[10px] text-[1rem] font-semibold leading-[1.5] text-gray-900">
        {childName}님의 직업 성향
      </h3>
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
        <PersonalityRadarChart data={axes} />
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="text-[0.875rem] leading-[1.6] text-gray-500">
            AI 성향 요약
          </p>
          <p className="text-[0.9375rem] leading-[1.6] text-gray-900">
            &ldquo;{summary}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}
