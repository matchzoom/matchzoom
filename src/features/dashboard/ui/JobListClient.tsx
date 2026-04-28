'use client';

import { useMemo } from 'react';

import { ConfirmModal } from '@/shared/ui/ConfirmModal';
import { useBookmarkToggle } from '../hooks/useBookmarkToggle';
import { useJobFilterOptions } from '../hooks/useJobFilterOptions';
import { useJobFitFilter } from '../hooks/useJobFitFilter';
import { useJobPostings } from '../hooks/useJobPostings';
import { useJobRegionFilter } from '../hooks/useJobRegionFilter';
import { JobListSection } from './JobListSection';

type JobListClientProps = {
  userName: string;
};

export function JobListClient({ userName }: JobListClientProps) {
  const { data: filterOptions } = useJobFilterOptions();
  const sigunguList = filterOptions?.sigunguList ?? [];
  const fitLevelList = filterOptions?.fitLevels ?? [];

  const { selectedSigungu, handleSelectSigungu } =
    useJobRegionFilter(sigunguList);
  const { selectedFitLevel, handleSelectFitLevel } =
    useJobFitFilter(fitLevelList);

  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useJobPostings({
      sigungu: selectedSigungu,
      fitLevel: selectedFitLevel,
    });

  const postings = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );

  const {
    toggle: handleBookmarkToggle,
    loginModalOpen,
    closeLoginModal,
  } = useBookmarkToggle();

  return (
    <>
      <JobListSection
        isLoading={isPending}
        userName={userName}
        postings={postings}
        onBookmarkToggle={handleBookmarkToggle}
        sigunguList={sigunguList}
        selectedSigungu={selectedSigungu}
        onSelectSigungu={handleSelectSigungu}
        fitLevelList={fitLevelList}
        selectedFitLevel={selectedFitLevel}
        onSelectFitLevel={handleSelectFitLevel}
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
            window.location.href = '/api/oauth/kakao/authorize';
          }}
          onClose={closeLoginModal}
        />
      )}
    </>
  );
}
