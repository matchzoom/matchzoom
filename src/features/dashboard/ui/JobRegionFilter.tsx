import { cva } from 'class-variance-authority';
import { Info } from 'lucide-react';
import type { FitLevel } from '@/shared/types/job';
import { Button } from '@/shared/ui/Button';

const filterChipVariants = cva('', {
  variants: {
    selected: {
      sigungu:
        'border-primary bg-primary-tag text-primary enabled:hover:bg-primary-tag',
      success:
        'border-success bg-success-bg text-success enabled:hover:bg-success-bg',
      warning:
        'border-warning bg-warning-bg text-warning enabled:hover:bg-warning-bg',
      error: 'border-error bg-error-bg text-error enabled:hover:bg-error-bg',
    },
  },
});

const fitLevelVariant = {
  '잘 맞아요': 'success',
  '도전해볼 수 있어요': 'warning',
  '힘들 수 있어요': 'error',
} as const satisfies Record<FitLevel, 'success' | 'warning' | 'error'>;

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
          <Button
            variant="outline"
            size="xs"
            aria-pressed={selectedSigungu === null}
            onClick={() => onSelectSigungu(null)}
            disabled={disabled}
            className={filterChipVariants({
              selected: selectedSigungu === null ? 'sigungu' : undefined,
            })}
          >
            전체
          </Button>

          <div aria-hidden="true" className="w-px self-stretch bg-gray-300" />

          {sigunguList.map((sigungu) => (
            <Button
              key={sigungu}
              variant="outline"
              size="xs"
              aria-pressed={selectedSigungu === sigungu}
              onClick={() => onSelectSigungu(sigungu)}
              disabled={disabled}
              className={filterChipVariants({
                selected: selectedSigungu === sigungu ? 'sigungu' : undefined,
              })}
            >
              {sigungu}
            </Button>
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
            <Button
              key={fitLevel}
              variant="outline"
              size="xs"
              aria-pressed={selectedFitLevel === fitLevel}
              onClick={() => onSelectFitLevel(fitLevel)}
              disabled={disabled}
              className={filterChipVariants({
                selected:
                  selectedFitLevel === fitLevel
                    ? fitLevelVariant[fitLevel]
                    : undefined,
              })}
            >
              {fitLevel}
            </Button>
          ))}
        </div>
      )}
    </>
  );
}
