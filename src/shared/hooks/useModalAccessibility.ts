'use client';

import { type RefObject, useEffect } from 'react';

export function useModalAccessibility(
  modalRef: RefObject<HTMLElement | null>,
  onClose: () => void,
) {
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // modal에서 body까지 역방향으로 올라가며 각 레벨의 sibling에 inert 적용.
    // body 직계 자식만 대상으로 하면 Portal 미사용 시 modal을 감싸는 상위
    // 컨테이너가 제외되어 배경 차단이 작동하지 않는 문제를 방지한다.
    const inertedElements: HTMLElement[] = [];
    let current: HTMLElement | null = modal;
    while (current && current !== document.body) {
      const parent: HTMLElement | null = current.parentElement;
      if (parent) {
        Array.from(parent.children).forEach((child) => {
          if (child !== current && child instanceof HTMLElement) {
            child.setAttribute('inert', '');
            inertedElements.push(child);
          }
        });
      }
      current = parent;
    }

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
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
      inertedElements.forEach((el) => el.removeAttribute('inert'));
    };
  }, [onClose]);
}
