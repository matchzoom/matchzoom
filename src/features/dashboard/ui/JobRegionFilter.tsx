import { Info } from 'lucide-react';
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
  disabled?: boolean;
};

export function JobRegionFilter({
  sigunguList,
  selectedSigungu,
  onSelectSigungu,
  fitLevelList,
  selectedFitLevel,
  onSelectFitLevel,
  disabled = false,
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
          className="mb-2 flex flex-wrap gap-2"
        >
          <button
            type="button"
            aria-pressed={selectedSigungu === null}
            onClick={() => onSelectSigungu(null)}
            disabled={disabled}
            className={cn(
              'h-8 rounded-sm border px-3 text-[0.8125rem] font-semibold transition-colors',
              disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
              selectedSigungu === null
                ? 'border-primary bg-primary-tag text-primary'
                : cn(
                    'border-gray-200 bg-white text-gray-700',
                    !disabled && 'hover:border-gray-300 hover:bg-gray-50',
                  ),
            )}
          >
            전체
          </button>

          <div aria-hidden="true" className="w-px self-stretch bg-gray-300" />

          {sigunguList.map((sigungu) => (
            <button
              key={sigungu}
              type="button"
              aria-pressed={selectedSigungu === sigungu}
              onClick={() => onSelectSigungu(sigungu)}
              disabled={disabled}
              className={cn(
                'h-8 rounded-sm border px-3 text-[0.8125rem] font-semibold transition-colors',
                disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
                selectedSigungu === sigungu
                  ? 'border-primary bg-primary-tag text-primary'
                  : cn(
                      'border-gray-200 bg-white text-gray-700',
                      !disabled && 'hover:border-gray-300 hover:bg-gray-50',
                    ),
              )}
            >
              {sigungu}
            </button>
          ))}
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
              disabled={disabled}
              className={cn(
                'h-8 rounded-sm border px-3 text-[0.8125rem] font-semibold transition-colors',
                disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
                selectedFitLevel === fitLevel
                  ? fitLevelSelectedStyle[fitLevel]
                  : cn(
                      'border-gray-200 bg-white text-gray-700',
                      !disabled && 'hover:border-gray-300 hover:bg-gray-50',
                    ),
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
