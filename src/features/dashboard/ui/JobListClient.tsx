'use client';

import { useEffect } from 'react';
import { useIntersectionObserver } from '@/shared/hooks/useIntersectionObserver';
import { useInfiniteJobPostings } from '../hooks/useInfiniteJobPostings';
import { useJobFilter } from '../hooks/useJobFilter';
import { useBookmarkToggle } from '../hooks/useBookmarkToggle';
import { JobListSection } from './JobListSection';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';

type JobListClientProps = {
  userName: string;
};

export function JobListClient({ userName }: JobListClientProps) {
  const {
    selectedSigungu,
    selectedFitLevel,
    handleSelectSigungu,
    handleSelectFitLevel,
    resetFitLevelIfInvalid,
    resetSigunguIfInvalid,
  } = useJobFilter();

  const { data, isPending, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteJobPostings(selectedSigungu, selectedFitLevel);

  const postings = data?.pages.flatMap((p) => p.items) ?? [];
  const filterOptions = data?.pages[0]?.filterOptions ?? {
    sigunguList: [],
    fitLevelList: [],
  };

  useEffect(() => {
    if (!isPending) {
      resetSigunguIfInvalid(filterOptions.sigunguList);
      resetFitLevelIfInvalid(filterOptions.fitLevelList);
    }
  }, [isPending, filterOptions, resetSigunguIfInvalid, resetFitLevelIfInvalid]);

  const sentinelRef = useIntersectionObserver({
    onIntersect: fetchNextPage,
    enabled: hasNextPage && !isPending,
    rootMargin: '0px 0px 500px 0px',
  });

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
        sigunguList={filterOptions.sigunguList}
        selectedSigungu={selectedSigungu}
        onSelectSigungu={handleSelectSigungu}
        fitLevelList={filterOptions.fitLevelList}
        selectedFitLevel={selectedFitLevel}
        onSelectFitLevel={handleSelectFitLevel}
        sentinelRef={sentinelRef}
        hasMore={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
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
