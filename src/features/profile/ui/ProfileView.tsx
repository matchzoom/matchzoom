'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useProfile } from '../hooks/useProfile';
import { useScrapedJobs } from '../hooks/useScrapedJobs';
import { useBookmarkRemove } from '../hooks/useBookmarkRemove';
import { ProfileSidebar } from './ProfileSidebar';
import { ProfileInfoTab } from './ProfileInfoTab';
import { ProfileEmptyView } from './ProfileEmptyView';
import { ScrapedJobsTab } from './ScrapedJobsTab';
import { Skeleton } from '@/shared/ui/Skeleton';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';
import { useCurrentUser } from '@/shared/hooks/useCurrentUser';
import { PROFILE_TAB_ITEMS, type ProfileTab } from '../utils/profileTabs';

export function ProfileView() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ProfileTab>('result');
  const [editLoginModalOpen, setEditLoginModalOpen] = useState(false);
  const { data: user } = useCurrentUser();

  const {
    userProfile,
    isLoading,
    lastSurveyDate,
    personalityAxes,
    personalitySummary,
    matchedJobs,
  } = useProfile();
  const { data: scrapedJobs = [] } = useScrapedJobs();
  const {
    remove: handleBookmarkRemove,
    loginModalOpen,
    closeLoginModal,
  } = useBookmarkRemove();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1200px] px-4 py-10 md:px-5 lg:px-6">
        <div className="flex gap-8">
          <div className="hidden w-[220px] shrink-0 md:block">
            <Skeleton className="h-[100px] rounded-lg" />
          </div>
          <div className="min-w-0 flex-1">
            <Skeleton className="mb-4 h-8 w-[200px]" />
            <Skeleton className="h-[300px] rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return <ProfileEmptyView />;
  }

  function handleEdit() {
    if (user?.isTestUser) {
      setEditLoginModalOpen(true);
      return;
    }
    router.push('/survey?mode=edit');
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 pt-5 pb-10 md:px-5 md:py-10 lg:px-6">
      <div className="flex gap-8">
        <div className="hidden w-[220px] shrink-0 md:block">
          <ProfileSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        <div className="min-w-0 flex-1">
          <div
            role="tablist"
            aria-label="프로필 메뉴"
            className="mb-10 flex border-b border-gray-200 md:hidden"
          >
            {PROFILE_TAB_ITEMS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                role="tab"
                id={`tab-${id}`}
                aria-selected={activeTab === id}
                aria-controls={`panel-${id}`}
                onClick={() => setActiveTab(id)}
                className={
                  'flex-1 cursor-pointer px-4 py-3 text-[0.9375rem] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-[-2px] ' +
                  (activeTab === id
                    ? 'border-b-2 border-primary font-bold text-primary'
                    : 'border-b-2 border-transparent text-gray-500 hover:text-gray-900')
                }
              >
                {label}
              </button>
            ))}
          </div>

          <div
            role="tabpanel"
            id="panel-result"
            aria-labelledby="tab-result"
            hidden={activeTab !== 'result'}
          >
            <ProfileInfoTab
              userProfile={userProfile}
              lastSurveyDate={lastSurveyDate}
              personalityAxes={personalityAxes}
              personalitySummary={personalitySummary}
              matchedJobs={matchedJobs}
              onEdit={handleEdit}
            />
          </div>
          <div
            role="tabpanel"
            id="panel-scraps"
            aria-labelledby="tab-scraps"
            hidden={activeTab !== 'scraps'}
          >
            <ScrapedJobsTab
              jobs={scrapedJobs}
              onBookmarkToggle={(job) =>
                handleBookmarkRemove(job.detailUrl ?? '')
              }
            />
          </div>
        </div>
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

      {editLoginModalOpen && (
        <ConfirmModal
          title="로그인이 필요해요"
          description="검사 수정은 실제 로그인이 필요합니다."
          confirmLabel="로그인하기"
          cancelLabel="닫기"
          onConfirm={() => {
            window.location.href = '/api/oauth/kakao/authorize';
          }}
          onClose={() => setEditLoginModalOpen(false)}
        />
      )}
    </div>
  );
}
