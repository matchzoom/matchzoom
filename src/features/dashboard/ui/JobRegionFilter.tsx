import { ChevronDown, Info } from 'lucide-react';
import type { FitLevel } from '@/shared/types/job';
import { cn } from '@/shared/utils/cn';

const fitLevelSelectedStyle: Record<FitLevel, string> = {
  '잘 맞아요': 'border-success bg-success-bg text-success',
  '도전해볼 수 있어요': 'border-warning bg-warning-bg text-warning',
  '힘들 수 있어요': 'border-error bg-error-bg text-error',
};

type JobRegionFilterProps = {
  sigunguList: string[];
  selectedSigungu: string | null;
  onSelectSigungu: (sigungu: string | null) => void;
  fitLevelList: FitLevel[];
  selectedFitLevel: FitLevel | null;
  onSelectFitLevel: (fitLevel: FitLevel | null) => void;
};

export function JobRegionFilter({
  sigunguList,
  selectedSigungu,
  onSelectSigungu,
  fitLevelList,
  selectedFitLevel,
  onSelectFitLevel,
}: JobRegionFilterProps) {
  if (sigunguList.length === 0 && fitLevelList.length < 2) return null;

  return (
    <>
      <p className="mb-6 flex items-center gap-1 text-[0.875rem] text-gray-400">
        <Info
          size={14}
          strokeWidth={1.5}
          aria-hidden="true"
          className="shrink-0"
        />
        주소는 본사 기준이에요. 실제 근무지는 공고에서 확인해주세요.
      </p>

      {sigunguList.length > 0 && (
        <div
          role="group"
          aria-label="시/군/구 필터"
          className="mb-2 flex flex-wrap items-center gap-2"
        >
          <button
            type="button"
            aria-pressed={selectedSigungu === null}
            onClick={() => onSelectSigungu(null)}
            className={cn(
              'h-8 cursor-pointer rounded-sm border px-3 text-[0.8125rem] font-semibold transition-colors',
              selectedSigungu === null
                ? 'border-primary bg-primary-tag text-primary'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50',
            )}
          >
            전체
          </button>

          <div
            aria-hidden="true"
            className="h-6 w-px self-stretch bg-gray-300"
          />

          <div className="relative">
            <select
              aria-label="시/군/구 선택"
              value={selectedSigungu ?? ''}
              onChange={(e) => onSelectSigungu(e.target.value || null)}
              className={cn(
                'h-8 cursor-pointer appearance-none rounded-sm border pl-3 pr-8 text-[0.8125rem] font-semibold transition-colors',
                'focus:border-primary focus-visible:[outline-offset:0]',
                selectedSigungu !== null
                  ? 'border-primary bg-primary-tag text-primary'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50',
              )}
            >
              <option value="">지역 선택</option>
              {sigunguList.map((sigungu) => (
                <option key={sigungu} value={sigungu}>
                  {sigungu}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              strokeWidth={1.5}
              aria-hidden="true"
              className={cn(
                'pointer-events-none absolute right-2 top-1/2 -translate-y-1/2',
                selectedSigungu !== null ? 'text-primary' : 'text-gray-500',
              )}
            />
          </div>
        </div>
      )}

      {fitLevelList.length >= 2 && (
        <div
          role="group"
          aria-label="적합도 필터"
          className="mb-8 flex flex-wrap gap-2"
        >
          {fitLevelList.map((fitLevel) => (
            <button
              key={fitLevel}
              type="button"
              aria-pressed={selectedFitLevel === fitLevel}
              onClick={() => onSelectFitLevel(fitLevel)}
              className={cn(
                'h-8 cursor-pointer rounded-sm border px-3 text-[0.8125rem] font-semibold transition-colors',
                selectedFitLevel === fitLevel
                  ? fitLevelSelectedStyle[fitLevel]
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50',
              )}
            >
              {fitLevel}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
