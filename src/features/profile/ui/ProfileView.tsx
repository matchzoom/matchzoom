import type { UserProfile } from '@/shared/types/userProfile';
import type {
  MatchedJob,
  PersonalityAxis,
  JobPosting,
} from '@/shared/types/job';
import type { Bookmark } from '@/shared/types/bookmark';
import { ProfileSidebar } from './ProfileSidebar';
import { ProfileInfoTab } from './ProfileInfoTab';
import { ScrapedJobsTab } from './ScrapedJobsTab';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';
import { PROFILE_TAB_ITEMS, type ProfileTab } from '../utils/profileTabs';
import { ROUTES } from '@/shared/constants/routes';

type ProfileViewProps = {
  userProfile: UserProfile;
  lastSurveyDate: string;
  personalityAxes: PersonalityAxis[];
  personalitySummary: string;
  matchedJobs: MatchedJob[];
  scrapedJobs: Bookmark[];
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  editLoginModalOpen: boolean;
  onEditLoginModalClose: () => void;
  loginModalOpen: boolean;
  onLoginModalClose: () => void;
  onEdit: () => void;
  onBookmarkToggle: (job: JobPosting) => void;
};

export function ProfileView({
  userProfile,
  lastSurveyDate,
  personalityAxes,
  personalitySummary,
  matchedJobs,
  scrapedJobs,
  activeTab,
  onTabChange,
  editLoginModalOpen,
  onEditLoginModalClose,
  loginModalOpen,
  onLoginModalClose,
  onEdit,
  onBookmarkToggle,
}: ProfileViewProps) {
  return (
    <div className="mx-auto max-w-[1200px] px-4 pt-5 pb-10 md:px-5 md:py-10 lg:px-6">
      <div className="flex gap-8">
        <div className="hidden w-[220px] shrink-0 md:block">
          <ProfileSidebar activeTab={activeTab} onTabChange={onTabChange} />
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
                onClick={() => onTabChange(id)}
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
              onEdit={onEdit}
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
              onBookmarkToggle={onBookmarkToggle}
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
            window.location.href = ROUTES.KAKAO_AUTHORIZE;
          }}
          onClose={onLoginModalClose}
        />
      )}

      {editLoginModalOpen && (
        <ConfirmModal
          title="로그인이 필요해요"
          description="검사 수정은 실제 로그인이 필요합니다."
          confirmLabel="로그인하기"
          cancelLabel="닫기"
          onConfirm={() => {
            window.location.href = ROUTES.KAKAO_AUTHORIZE;
          }}
          onClose={onEditLoginModalClose}
        />
      )}
    </div>
  );
}
