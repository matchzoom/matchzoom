'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

type PolicyContent = {
  title: string;
  effectiveDate: string;
  sections: { heading: string; body: string }[];
};

const TERMS_CONTENT: PolicyContent = {
  title: '이용약관',
  effectiveDate: '2026년 1월 1일',
  sections: [
    {
      heading: '제1조 (목적)',
      body: '본 약관은 마주봄(이하 "서비스")이 제공하는 AI 직종 탐색 및 채용공고 적합도 판별 서비스의 이용 조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.',
    },
    {
      heading: '제2조 (서비스 이용)',
      body: '서비스는 장애인 및 장애인 보호자를 위한 직종 탐색 서비스를 제공합니다. 사용자는 자녀의 특성 정보를 입력하여 AI 기반 직종 매칭 결과를 받아볼 수 있습니다.',
    },
    {
      heading: '제3조 (개인정보 처리)',
      body: '서비스는 입력된 정보를 직종 매칭 목적으로만 사용하며, 제3자에게 제공하지 않습니다. 세부 사항은 개인정보처리방침을 참고하시기 바랍니다.',
    },
    {
      heading: '제4조 (서비스 제한)',
      body: '서비스는 공공데이터 기반의 정보를 제공하며, 취업 결과를 보장하지 않습니다. AI 매칭 결과는 참고 자료로 활용하시기 바랍니다.',
    },
    {
      heading: '제5조 (면책)',
      body: '서비스는 천재지변, 시스템 장애 등 불가항력적인 사유로 인한 서비스 중단에 대해 책임을 지지 않습니다.',
    },
  ],
};

const PRIVACY_CONTENT: PolicyContent = {
  title: '개인정보처리방침',
  effectiveDate: '2026년 1월 1일',
  sections: [
    {
      heading: '1. 수집하는 개인정보 항목',
      body: '이름, 나이, 성별, 최종학력, 희망 지역, 장애 유형 및 등급, 신체 조건, 희망 활동 유형 등 프로필 정보를 수집합니다.',
    },
    {
      heading: '2. 개인정보 수집 목적',
      body: 'AI 직종 매칭 및 채용공고 적합도 분석 서비스 제공을 위해 개인정보를 수집합니다. 수집된 정보는 목적 달성 후 즉시 파기됩니다.',
    },
    {
      heading: '3. 개인정보 보유 기간',
      body: '회원 탈퇴 시 또는 서비스 종료 시까지 보유하며, 관계 법령에서 정하는 경우를 제외하고 즉시 파기합니다.',
    },
    {
      heading: '4. 개인정보의 제3자 제공',
      body: '서비스는 수집된 개인정보를 제3자에게 제공하지 않습니다. 단, 법령에 의한 요구가 있을 경우 관련 기관에 제공할 수 있습니다.',
    },
    {
      heading: '5. 정보주체의 권리',
      body: '사용자는 언제든지 개인정보 열람, 수정, 삭제를 요청할 수 있으며, 서비스 내 탈퇴 기능을 통해 모든 정보를 삭제할 수 있습니다.',
    },
  ],
};

type PolicyModalProps = {
  type: 'terms' | 'privacy';
  onClose: () => void;
};

export function PolicyModal({ type, onClose }: PolicyModalProps) {
  const content = type === 'terms' ? TERMS_CONTENT : PRIVACY_CONTENT;
  const modalRef = useRef<HTMLDivElement>(null);
  const headingId = `policy-modal-${type}`;

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const focusableSelectors =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableElements =
      modal.querySelectorAll<HTMLElement>(focusableSelectors);
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    firstFocusable?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable?.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(17, 24, 39, 0.5)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className="flex max-h-[80vh] w-full max-w-[560px] flex-col rounded-lg bg-white"
        style={{
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          animation: 'fadeIn 100ms ease',
        }}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <h2
              id={headingId}
              className="text-[1rem] font-semibold leading-[1.5] text-gray-900"
            >
              {content.title}
            </h2>
            <p className="mt-0.5 text-[0.8125rem] text-gray-500">
              시행일: {content.effectiveDate}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="모달 닫기"
            className="transition-ui flex h-9 w-9 cursor-pointer items-center justify-center rounded-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={20} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5">
          <dl className="flex flex-col gap-5">
            {content.sections.map((section) => (
              <div key={section.heading}>
                <dt className="mb-1.5 text-[0.875rem] font-semibold text-gray-900">
                  {section.heading}
                </dt>
                <dd className="text-[0.875rem] leading-[1.6] text-gray-700">
                  {section.body}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          @keyframes fadeIn { from { opacity: 1; } to { opacity: 1; } }
        }
      `}</style>
    </div>
  );
}
