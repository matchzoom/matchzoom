import type { FitLevel } from '@/shared/types/job';

const VALID_FIT_LEVELS: readonly FitLevel[] = [
  '잘 맞아요',
  '도전해볼 수 있어요',
  '힘들 수 있어요',
];

export function parseFitLevel(
  value: string | null | undefined,
): FitLevel | null {
  if (value && (VALID_FIT_LEVELS as string[]).includes(value))
    return value as FitLevel;
  return null;
}
