'use client';

import { useInfiniteJobPostings } from '../hooks/useInfiniteJobPostings';
import { useJobRegionFilter } from '../hooks/useJobRegionFilter';
import { useJobFitFilter } from '../hooks/useJobFitFilter';
import { useBookmarkToggle } from '../hooks/useBookmarkToggle';
import { useBreakpointLimit } from '../hooks/useBreakpointLimit';
import { JobListSection } from './JobListSection';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';

type JobListClientProps = {
  profileProvinces: string[];
  userName: string;
};

export function JobListClient({
  profileProvinces,
  userName,
}: JobListClientProps) {
  const columns = useBreakpointLimit();
  const { data, isPending, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteJobPostings();

  const allPostings = data?.pages.flatMap((page) => page.items) ?? [];

  const {
    availableSigungu,
    selectedSigungu,
    filteredPostings: regionFiltered,
    handleSelectSigungu,
  } = useJobRegionFilter(allPostings, profileProvinces);
  const {
    availableFitLevels,
    selectedFitLevel,
    filteredPostings,
    handleSelectFitLevel,
  } = useJobFitFilter(regionFiltered);
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
        postings={filteredPostings}
        onBookmarkToggle={handleBookmarkToggle}
        sigunguList={availableSigungu}
        selectedSigungu={selectedSigungu}
        onSelectSigungu={handleSelectSigungu}
        fitLevelList={availableFitLevels}
        selectedFitLevel={selectedFitLevel}
        onSelectFitLevel={handleSelectFitLevel}
        columns={columns}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
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
