'use client';

import { useDashboard } from '../hooks/useDashboard';
import { useJobPostings } from '../hooks/useJobPostings';
import { useJobRegionFilter } from '../hooks/useJobRegionFilter';
import { useJobFitFilter } from '../hooks/useJobFitFilter';
import { useBookmarkToggle } from '../hooks/useBookmarkToggle';
import { JobListSection } from './JobListSection';
import { DashboardSkeleton } from './DashboardSkeleton';
import { AIResultCard } from '@/shared/ui/AIResultCard';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';

export function DashboardView() {
  const {
    isPending,
    userName,
    personalityAxes,
    personalitySummary,
    matchedJobs,
    profileProvinces,
  } = useDashboard();

  if (isPending) return <DashboardSkeleton />;
  const { data: postings } = useJobPostings();
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
    <div className="py-10 md:py-16">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-[60px] px-4 md:px-5 lg:px-6">
        <section aria-labelledby="result-summary-heading">
          <h2 id="result-summary-heading" className="sr-only">
            검사 결과 요약
          </h2>
          <AIResultCard
            userName={userName}
            axes={personalityAxes}
            summary={personalitySummary}
            jobs={matchedJobs}
          />
        </section>

        <section aria-labelledby="job-postings-heading">
          <h2 id="job-postings-heading" className="sr-only">
            맞춤 채용공고
          </h2>
          <JobListSection
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
        </section>
      </div>

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
    </div>
  );
}
