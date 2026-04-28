import Link from 'next/link';

import { buttonVariants } from '@/shared/ui/Button/Button';
import { cn } from '@/shared/utils/cn';

type CtaButtonProps = {
  isLoggedIn: boolean;
  label: string;
  size?: 'sm' | 'md' | 'lg';
};

export function CtaButton({ isLoggedIn, label, size = 'lg' }: CtaButtonProps) {
  const href = isLoggedIn ? '/survey' : '/api/oauth/kakao/authorize';
  return (
    <Link
      href={href}
      className={cn(buttonVariants({ variant: 'primary', size }))}
    >
      {label}
    </Link>
  );
}
