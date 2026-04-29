'use client';

import { useMemo } from 'react';

import { ConfirmModal } from '@/shared/ui/ConfirmModal';
import { ROUTES } from '@/shared/constants/routes';
import { useBookmarkToggle } from './hooks/useBookmarkToggle';
import { useJobFilterOptions } from './hooks/useJobFilterOptions';
import { useJobFilter } from './hooks/useJobFilter';
import { useJobPostings } from './hooks/useJobPostings';
import { JobListSection } from './ui/JobListSection';

type JobListClientProps = {
  userName: string;
};

export function JobListClient({ userName }: JobListClientProps) {
  const { data: filterOptions } = useJobFilterOptions();
  const sigunguList = filterOptions?.sigunguList ?? [];
  const fitLevelList = filterOptions?.fitLevels ?? [];

  const { sigungu, fitLevel, handleSelectSigungu, handleSelectFitLevel } =
    useJobFilter();

  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useJobPostings({ sigungu, fitLevel });

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
        selectedSigungu={sigungu}
        onSelectSigungu={handleSelectSigungu}
        fitLevelList={fitLevelList}
        selectedFitLevel={fitLevel}
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
            window.location.href = ROUTES.KAKAO_AUTHORIZE;
          }}
          onClose={closeLoginModal}
        />
      )}
    </>
  );
}
