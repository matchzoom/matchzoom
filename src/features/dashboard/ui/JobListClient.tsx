'use client';

import { useJobPostings } from '../hooks/useJobPostings';
import { useJobRegionFilter } from '../hooks/useJobRegionFilter';
import { useJobFitFilter } from '../hooks/useJobFitFilter';
import { useBookmarkToggle } from '../hooks/useBookmarkToggle';
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
  const { data: postings, isPending } = useJobPostings();
  const {
    availableSigungu,
    selectedSigungu,
    filteredPostings: regionFiltered,
    handleSelectSigungu,
  } = useJobRegionFilter(postings ?? [], profileProvinces);
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
