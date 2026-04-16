'use client';

import { useState } from 'react';
import Link from 'next/link';

import { ConfirmModal } from '@/shared/ui/ConfirmModal';

export function ProfileEmptyView() {
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
          <nav
            aria-label="프로필 메뉴"
            className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
          >
            <ul role="list">
              <li>
                <Link
                  href="/survey"
                  className="transition-ui block border-l-[3px] border-transparent px-4 py-3 text-[0.9375rem] font-normal text-gray-700 hover:bg-gray-100"
                >
                  검사 시작하기
                </Link>
              </li>
            </ul>

            <div className="border-t border-gray-200" />

            <div className="px-4 py-3">
              <button
                type="button"
                onClick={() => setShowWithdrawModal(true)}
                className="transition-ui text-[0.8125rem] font-normal text-gray-400 hover:text-error"
              >
                회원 탈퇴
              </button>
            </div>
          </nav>
        </div>

        {/* 콘텐츠 영역 */}
        <div className="min-w-0 flex-1">
          {/* 모바일 액션 */}
          <div className="mb-6 flex items-center gap-4 md:hidden">
            <Link
              href="/survey"
              className="transition-ui text-[0.875rem] font-semibold text-primary hover:underline"
            >
              검사 시작하기
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
              className="transition-ui inline-flex h-12 items-center justify-center rounded-md bg-primary px-5 text-[0.9375rem] font-semibold text-white hover:bg-primary-hover"
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
