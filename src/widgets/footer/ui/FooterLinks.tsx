'use client';

import { useState } from 'react';

import { PolicyModal } from './PolicyModal';

const linkClass =
  'transition-ui cursor-pointer text-[0.875rem] text-footer-text underline-offset-2 hover:text-static-white hover:underline';

export function FooterLinks() {
  const [openModal, setOpenModal] = useState<'terms' | 'privacy' | null>(null);

  return (
    <>
      <ul className="flex flex-wrap gap-6">
        <li>
          <button
            type="button"
            onClick={() => setOpenModal('terms')}
            className={linkClass}
          >
            이용약관
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={() => setOpenModal('privacy')}
            className={linkClass}
          >
            개인정보처리방침
          </button>
        </li>
      </ul>

      {openModal && (
        <PolicyModal type={openModal} onClose={() => setOpenModal(null)} />
      )}
    </>
  );
}
