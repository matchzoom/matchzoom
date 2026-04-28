'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useProfile } from '@/shared/hooks/useProfile';
import { useMatchResult } from '@/shared/hooks/useMatchResult';
import { useCurrentUser } from '@/shared/hooks/useCurrentUser';
import { useScrapedJobs } from '@/features/profile/hooks/useScrapedJobs';
import { useBookmarkRemove } from '@/features/profile/hooks/useBookmarkRemove';
import { toPersonalityAxes, toMatchedJobs } from '@/shared/utils/matchConvert';
import { ProfileView } from '@/features/profile/ui/ProfileView';
import { ProfileEmptyView } from '@/features/profile/ui/ProfileEmptyView';
import { Skeleton } from '@/shared/ui/Skeleton';
import { type ProfileTab } from '@/features/profile/utils/profileTabs';

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ProfileTab>('result');
  const [editLoginModalOpen, setEditLoginModalOpen] = useState(false);

  const { data: user } = useCurrentUser();
  const {
    userProfile,
    isLoading: isProfileLoading,
    lastSurveyDate,
  } = useProfile();
  const { data: matchResult, isLoading: isMatchLoading } = useMatchResult({
    enabled: !!userProfile,
  });
  const isLoading = isProfileLoading || isMatchLoading;
  const { data: scrapedJobs = [] } = useScrapedJobs();
  const {
    remove: handleBookmarkRemove,
    loginModalOpen,
    closeLoginModal,
  } = useBookmarkRemove();

  function handleEdit() {
    if (user?.isTestUser) {
      setEditLoginModalOpen(true);
      return;
    }
    router.push('/survey?mode=edit');
  }

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
    return (
      <ProfileEmptyView activeTab={activeTab} onTabChange={setActiveTab} />
    );
  }

  return (
    <ProfileView
      userProfile={userProfile}
      lastSurveyDate={lastSurveyDate}
      personalityAxes={
        matchResult ? toPersonalityAxes(matchResult.radar_chart) : []
      }
      personalitySummary={matchResult?.summary_text ?? ''}
      matchedJobs={matchResult ? toMatchedJobs(matchResult.top3_jobs) : []}
      scrapedJobs={scrapedJobs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      editLoginModalOpen={editLoginModalOpen}
      onEditLoginModalClose={() => setEditLoginModalOpen(false)}
      loginModalOpen={loginModalOpen}
      onLoginModalClose={closeLoginModal}
      onEdit={handleEdit}
      onBookmarkToggle={(job) => handleBookmarkRemove(job.detailUrl ?? '')}
    />
  );
}
