import Link from 'next/link';

import { buttonVariants } from '@/shared/ui/Button';
import { cn } from '@/shared/utils/cn';
import { ROUTES } from '@/shared/constants/routes';

type CtaButtonProps = {
  isLoggedIn: boolean;
  label: string;
  size?: 'sm' | 'md' | 'lg';
};

export function CtaButton({ isLoggedIn, label, size = 'lg' }: CtaButtonProps) {
  const href = isLoggedIn ? '/survey' : ROUTES.KAKAO_AUTHORIZE;
  return (
    <Link
      href={href}
      className={cn(buttonVariants({ variant: 'primary', size }))}
    >
      {label}
    </Link>
  );
}
