'use client';

import { useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import type { FitLevel } from '@/shared/types/job';

const VALID_FIT_LEVELS: readonly FitLevel[] = [
  '잘 맞아요',
  '도전해볼 수 있어요',
  '힘들 수 있어요',
];

function parseFitLevel(value: string | null): FitLevel | null {
  if (value && (VALID_FIT_LEVELS as string[]).includes(value))
    return value as FitLevel;
  return null;
}

export function useJobFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sigungu = searchParams.get('sigungu') || null;
  const fitLevel = parseFitLevel(searchParams.get('fitLevel'));

  const updateParams = useCallback(
    (updates: { sigungu?: string | null; fitLevel?: FitLevel | null }) => {
      const params = new URLSearchParams(searchParams.toString());

      if ('sigungu' in updates) {
        if (updates.sigungu) params.set('sigungu', updates.sigungu);
        else params.delete('sigungu');
      }
      if ('fitLevel' in updates) {
        if (updates.fitLevel) params.set('fitLevel', updates.fitLevel);
        else params.delete('fitLevel');
      }

      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    },
    [router, pathname, searchParams],
  );

  const handleSelectSigungu = useCallback(
    (value: string | null) => {
      updateParams({ sigungu: sigungu === value ? null : value });
    },
    [sigungu, updateParams],
  );

  const handleSelectFitLevel = useCallback(
    (value: FitLevel | null) => {
      updateParams({ fitLevel: fitLevel === value ? null : value });
    },
    [fitLevel, updateParams],
  );

  return { sigungu, fitLevel, handleSelectSigungu, handleSelectFitLevel };
}
