import clsx from 'clsx';

import type { FitLevel } from '@/shared/types/job';

type FitBadgeProps = {
  level: FitLevel;
  className?: string;
};

const fitBadgeStyles: Record<FitLevel, string> = {
  '잘 맞아요': 'bg-success-bg text-success',
  '도전해볼 수 있어요': 'bg-warning-bg text-warning',
  '힘들 수 있어요': 'bg-error-bg text-error',
};

export function FitBadge({ level, className }: FitBadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex h-6 items-center rounded-sm px-2 text-[0.75rem] font-semibold leading-none',
        fitBadgeStyles[level],
        className,
      )}
    >
      {level}
    </span>
  );
}
