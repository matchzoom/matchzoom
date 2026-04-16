'use client';

import { useState } from 'react';
import Link from 'next/link';

import { ConfirmModal } from '@/shared/ui/ConfirmModal';
import { ProfileSidebar } from './ProfileSidebar';

type ProfileTab = 'result' | 'scraps';

const MOBILE_TABS: { tab: ProfileTab; label: string }[] = [
  { tab: 'result', label: '내 검사 결과' },
  { tab: 'scraps', label: '스크랩한 공고' },
];

export function ProfileEmptyView() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('result');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

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
                    'transition-ui cursor-pointer px-4 py-3 text-[0.9375rem] font-semibold ' +
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
                href="/survey"
                className="transition-ui cursor-pointer text-[0.875rem] font-semibold text-primary hover:underline"
              >
                검사 시작하기
              </Link>
              <span className="text-gray-200" aria-hidden="true">
                |
              </span>
              <button
                type="button"
                onClick={() => setShowWithdrawModal(true)}
                className="transition-ui cursor-pointer text-[0.875rem] text-gray-400 hover:text-error"
              >
                회원 탈퇴
              </button>
            </div>
          </div>

          {/* 빈 상태 */}
          <div className="flex flex-col items-center gap-6 rounded-lg border border-gray-200 bg-white py-20 text-center">
            <div className="flex flex-col gap-2">
              <h1 className="text-[1.125rem] font-bold leading-[1.35] text-gray-900">
                아직 검사를 완료하지 않았어요
              </h1>
              <p className="text-[0.9375rem] leading-[1.6] text-gray-500">
                자녀의 특성을 입력하면 AI가 적합한 직종과 채용공고를 찾아드려요
              </p>
            </div>
            <Link
              href="/survey"
              className="transition-ui inline-flex h-12 cursor-pointer items-center justify-center rounded-md bg-primary px-5 text-[0.9375rem] font-semibold text-white hover:bg-primary-hover"
            >
              검사 시작하기
            </Link>
          </div>
        </div>
      </div>

      {showWithdrawModal && (
        <ConfirmModal
          title="회원 탈퇴"
          description="탈퇴하면 모든 정보가 삭제됩니다. 정말 탈퇴하시겠습니까?"
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
