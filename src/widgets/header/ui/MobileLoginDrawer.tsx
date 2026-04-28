'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { X, MessageCircle } from 'lucide-react';

import { useModalAccessibility } from '@/shared/hooks/useModalAccessibility';
import { Button } from '@/shared/ui/Button';

type MobileLoginDrawerProps = {
  onClose: () => void;
  onTestLogin: () => void;
  onKakaoLogin: () => void;
  isTestLoginPending: boolean;
};

export function MobileLoginDrawer({
  onClose,
  onTestLogin,
  onKakaoLogin,
  isTestLoginPending,
}: MobileLoginDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  useModalAccessibility(drawerRef, onClose);

  return (
    <div
      ref={drawerRef}
      role="dialog"
      aria-modal="true"
      aria-label="로그인"
      className="fixed inset-0 z-50 flex flex-col bg-white"
    >
      {/* 상단 닫기 버튼 */}
      <div className="flex h-14 shrink-0 items-center px-2">
        <button
          type="button"
          aria-label="메뉴 닫기"
          onClick={onClose}
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-sm text-gray-700 hover:bg-gray-100"
        >
          <X size={24} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>

      {/* 중앙 로고 */}
      <div className="flex flex-1 items-center justify-center">
        <Link
          href="/"
          onClick={onClose}
          className="cursor-pointer text-[3.5rem] font-bold leading-none text-gray-900"
        >
          마주
          <span className="ml-[2px] inline-flex h-[1.4em] w-[1.4em] items-center justify-center rounded-full bg-primary text-[0.9em] font-bold text-static-white">
            봄
          </span>
        </Link>
      </div>

      {/* 하단 버튼 영역 */}
      <div className="flex shrink-0 flex-col gap-3 px-4 pb-10">
        <Button
          variant="outline"
          size="lg"
          disabled={isTestLoginPending}
          onClick={onTestLogin}
          className="w-full justify-center"
        >
          {isTestLoginPending ? '로그인 중...' : '게스트 계정으로 로그인'}
        </Button>
        <Button
          variant="kakao"
          size="lg"
          onClick={onKakaoLogin}
          className="w-full justify-center"
        >
          <MessageCircle
            size={16}
            strokeWidth={0}
            fill="currentColor"
            aria-hidden="true"
          />
          카카오로 로그인
        </Button>
      </div>
    </div>
  );
}
