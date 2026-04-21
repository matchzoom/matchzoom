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

type ProfileTab = 'result' | 'scraps';

export function ProfileView() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ProfileTab>('result');

  const {
    userProfile,
    isLoading,
    lastSurveyDate,
    personalityAxes,
    personalitySummary,
    matchedJobs,
  } = useProfile();
  const { data: scrapedJobs = [] } = useScrapedJobs();
  const handleBookmarkRemove = useBookmarkRemove();

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
    router.push('/survey?mode=edit');
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 md:px-5 lg:px-6">
      <div className="flex gap-8">
        <div className="hidden w-[220px] shrink-0 md:block">
          <ProfileSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        <div className="min-w-0 flex-1">
          {activeTab === 'result' ? (
            <ProfileInfoTab
              userProfile={userProfile}
              lastSurveyDate={lastSurveyDate}
              personalityAxes={personalityAxes}
              personalitySummary={personalitySummary}
              matchedJobs={matchedJobs}
              onEdit={handleEdit}
            />
          ) : (
            <ScrapedJobsTab
              jobs={scrapedJobs}
              onBookmarkToggle={(job) =>
                handleBookmarkRemove(job.detailUrl ?? '')
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
