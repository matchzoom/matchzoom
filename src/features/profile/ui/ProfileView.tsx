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
    </div>
  );
}
