'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

import { Button } from '@/shared/ui/Button';

type ConfirmModalProps = {
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  variant?: 'default' | 'destructive';
  onConfirm: () => void;
  onClose: () => void;
};

export function ConfirmModal({
  title,
  description,
  confirmLabel,
  cancelLabel = '취소',
  variant = 'default',
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const headingId = `confirm-modal-${title.replace(/\s/g, '-')}`;

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
        className="w-full max-w-[400px] rounded-lg bg-white p-6"
        style={{
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          animation: 'fadeIn 100ms ease',
        }}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2
            id={headingId}
            className="text-[1rem] font-semibold leading-[1.5] text-gray-900"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="모달 닫기"
            className="transition-ui -mt-0.5 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={20} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>

        <p className="mb-6 text-[0.875rem] leading-[1.6] text-gray-700">
          {description}
        </p>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" size="md" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant === 'destructive' ? 'destructive' : 'primary'}
            size="md"
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
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
