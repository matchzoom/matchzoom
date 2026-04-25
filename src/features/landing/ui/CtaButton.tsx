'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui/Button';
import type { ButtonHTMLAttributes } from 'react';

type CtaButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'onClick'
> & {
  isLoggedIn: boolean;
  label: string;
  size?: 'sm' | 'md' | 'lg';
};

export function CtaButton({
  isLoggedIn,
  label,
  size = 'lg',
  ...props
}: CtaButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (isLoggedIn) {
      router.push('/survey');
    } else {
      window.location.href = '/api/oauth/kakao/authorize';
    }
  };

  return (
    <Button size={size} variant="primary" onClick={handleClick} {...props}>
      {label}
    </Button>
  );
}
