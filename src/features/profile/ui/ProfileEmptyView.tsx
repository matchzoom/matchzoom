'use client';

import { useState } from 'react';
import Link from 'next/link';

import { ProfileSidebar } from './ProfileSidebar';

type ProfileTab = 'result' | 'scraps';

export function ProfileEmptyView() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('result');

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 md:px-5 lg:px-6">
      <div className="flex gap-8">
        {/* 데스크탑 사이드바 */}
        <div className="hidden w-[220px] shrink-0 md:block">
          <ProfileSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* 콘텐츠 영역 */}
        <div className="min-w-0 flex-1">
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
    </div>
  );
}
