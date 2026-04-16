'use client';

import { useState } from 'react';
import Link from 'next/link';

import { ConfirmModal } from '@/shared/ui/ConfirmModal';
import { useProfile } from '../hooks/useProfile';
import { useScrapedJobs } from '../hooks/useScrapedJobs';
import { ProfileSidebar } from './ProfileSidebar';
import { ProfileInfoTab } from './ProfileInfoTab';
import { ScrapedJobsTab } from './ScrapedJobsTab';

type ProfileTab = 'result' | 'scraps';

const MOBILE_TABS: { tab: ProfileTab; label: string }[] = [
  { tab: 'result', label: '내 검사 결과' },
  { tab: 'scraps', label: '스크랩한 공고' },
];

export function ProfileView() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('result');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const {
    childProfile,
    lastSurveyDate,
    personalityAxes,
    personalitySummary,
    matchedJobs,
  } = useProfile();
  const { scrapedJobs, toggleBookmark } = useScrapedJobs();

  const handleWithdraw = () => {
    console.warn('[마주봄 목업] 회원 탈퇴 처리 → 화면 A로 이동 예정');
    setShowWithdrawModal(false);
  };

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 md:px-5 lg:px-6">
      <div className="flex gap-8">
        {/* 데스크탑 사이드바 */}
        <div className="hidden w-[220px] shrink-0 md:block">
          <ProfileSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onWithdrawClick={() => setShowWithdrawModal(true)}
          />
        </div>

        {/* 콘텐츠 영역 */}
        <div className="min-w-0 flex-1">
          {/* 모바일 탭 */}
          <div className="mb-6 md:hidden">
            <div
              role="tablist"
              aria-label="프로필 탭"
              className="flex border-b border-gray-200"
            >
              {MOBILE_TABS.map(({ tab, label }) => (
                <button
                  key={tab}
                  role="tab"
                  type="button"
                  aria-selected={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                  className={
                    'transition-ui px-4 py-3 text-[0.9375rem] font-semibold ' +
                    (activeTab === tab
                      ? 'border-b-2 border-primary text-primary'
                      : 'border-b-2 border-transparent text-gray-500 hover:text-gray-900')
                  }
                >
                  {label}
                </button>
              ))}
            </div>

            {/* 모바일 액션 버튼 */}
            <div className="mt-3 flex items-center gap-4">
              <Link
                href="/survey?mode=edit"
                className="transition-ui text-[0.875rem] font-semibold text-primary hover:underline"
              >
                검사 내용 수정
              </Link>
              <span className="text-gray-200" aria-hidden="true">
                |
              </span>
              <button
                type="button"
                onClick={() => setShowWithdrawModal(true)}
                className="transition-ui text-[0.875rem] text-gray-400 hover:text-error"
              >
                회원 탈퇴
              </button>
            </div>
          </div>

          {/* 탭 콘텐츠 */}
          {activeTab === 'result' ? (
            <ProfileInfoTab
              childProfile={childProfile}
              lastSurveyDate={lastSurveyDate}
              personalityAxes={personalityAxes}
              personalitySummary={personalitySummary}
              matchedJobs={matchedJobs}
            />
          ) : (
            <ScrapedJobsTab
              jobs={scrapedJobs}
              onBookmarkToggle={toggleBookmark}
            />
          )}
        </div>
      </div>

      {/* 탈퇴 확인 모달 */}
      {showWithdrawModal && (
        <ConfirmModal
          title="회원 탈퇴"
          description="탈퇴하면 검사 결과와 스크랩한 공고가 모두 삭제됩니다. 정말 탈퇴하시겠습니까?"
          confirmLabel="탈퇴하기"
          cancelLabel="취소"
          variant="destructive"
          onConfirm={handleWithdraw}
          onClose={() => setShowWithdrawModal(false)}
        />
      )}
    </div>
  );
}
