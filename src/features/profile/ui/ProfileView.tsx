'use client';

import { useState } from 'react';

import { useProfile } from '../hooks/useProfile';
import { useScrapedJobs } from '../hooks/useScrapedJobs';
import { ProfileSidebar } from './ProfileSidebar';
import { ProfileInfoTab } from './ProfileInfoTab';
import { ScrapedJobsTab } from './ScrapedJobsTab';

type ProfileTab = 'result' | 'scraps';

export function ProfileView() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('result');

  const {
    childProfile,
    lastSurveyDate,
    personalityAxes,
    personalitySummary,
    matchedJobs,
  } = useProfile();
  const { scrapedJobs, toggleBookmark } = useScrapedJobs();

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 md:px-5 lg:px-6">
      <div className="flex gap-8">
        {/* 데스크탑 사이드바 */}
        <div className="hidden w-[220px] shrink-0 md:block">
          <ProfileSidebar activeTab={activeTab} onTabChange={setActiveTab} />
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
