'use client';

import { useMemo, useState, useEffect, useCallback, useRef } from 'react';

import { ConfirmModal } from '@/shared/ui/ConfirmModal';
import { ROUTES } from '@/shared/constants/routes';
import { useBookmarkToggle } from './hooks/useBookmarkToggle';
import { useJobFilterOptions } from './hooks/useJobFilterOptions';
import { useJobFilter } from './hooks/useJobFilter';
import { useJobPostings } from './hooks/useJobPostings';
import { JobListSection } from './ui/JobListSection';
import type { FitLevel } from '@/shared/types/job';

type JobListClientProps = {
  userName: string;
};

export function JobListClient({ userName }: JobListClientProps) {
  const { data: filterOptions } = useJobFilterOptions();
  const sigunguList = filterOptions?.sigunguList ?? [];
  const fitLevelList = filterOptions?.fitLevels ?? [];

  const { sigungu, fitLevel, handleSelectSigungu, handleSelectFitLevel } =
    useJobFilter();

  const [isFiltering, setIsFiltering] = useState(false);
  const filterStartTimeRef = useRef<number | null>(null);

  const {
    data,
    isPending,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useJobPostings({ sigungu, fitLevel });

  // 페칭 완료 시점에 클릭 후 500ms가 지났으면 즉시, 안 지났으면 남은 시간 후 스켈레톤 해제
  useEffect(() => {
    if (isFiltering && !isFetching && !isPending) {
      const elapsed = filterStartTimeRef.current
        ? Date.now() - filterStartTimeRef.current
        : 500;
      const remaining = Math.max(0, 500 - elapsed);
      const timer = setTimeout(() => {
        setIsFiltering(false);
        filterStartTimeRef.current = null;
      }, remaining);
      return () => clearTimeout(timer);
    }
  }, [isFiltering, isFetching, isPending]);

  const handleFilterSigungu = useCallback(
    (value: string | null) => {
      filterStartTimeRef.current = Date.now();
      setIsFiltering(true);
      handleSelectSigungu(value);
    },
    [handleSelectSigungu],
  );

  const handleFilterFitLevel = useCallback(
    (value: FitLevel | null) => {
      filterStartTimeRef.current = Date.now();
      setIsFiltering(true);
      handleSelectFitLevel(value);
    },
    [handleSelectFitLevel],
  );

  const postings = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );

  const [displayedPostings, setDisplayedPostings] = useState(postings);

  useEffect(() => {
    if (!isFiltering) {
      setDisplayedPostings(postings);
    }
  }, [isFiltering, postings]);

  const {
    toggle: handleBookmarkToggle,
    loginModalOpen,
    closeLoginModal,
  } = useBookmarkToggle();

  return (
    <>
      <JobListSection
        isLoading={isPending}
        isFiltering={isFiltering}
        userName={userName}
        postings={displayedPostings}
        onBookmarkToggle={handleBookmarkToggle}
        sigunguList={sigunguList}
        selectedSigungu={sigungu}
        onSelectSigungu={handleFilterSigungu}
        fitLevelList={fitLevelList}
        selectedFitLevel={fitLevel}
        onSelectFitLevel={handleFilterFitLevel}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={fetchNextPage}
      />
      {loginModalOpen && (
        <ConfirmModal
          title="로그인이 필요해요"
          description="스크랩은 실제 로그인이 필요합니다."
          confirmLabel="로그인하기"
          cancelLabel="닫기"
          onConfirm={() => {
            window.location.href = ROUTES.KAKAO_AUTHORIZE;
          }}
          onClose={closeLoginModal}
        />
      )}
    </>
  );
}
