import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes, Ref } from 'react';
import { cn } from '@/shared/utils/cn';

const buttonVariants = cva(
  'transition-ui inline-flex items-center justify-center gap-2 rounded-md text-[0.9375rem] font-semibold leading-none enabled:cursor-pointer disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary:
          'border border-transparent bg-primary text-static-white ' +
          'hover:bg-primary-hover active:bg-primary-pressed ' +
          'disabled:bg-gray-200 disabled:text-gray-400',
        secondary:
          'border border-primary-on-dark bg-white text-primary-on-dark ' +
          'hover:bg-primary-bg ' +
          'disabled:border-gray-200 disabled:bg-white disabled:text-gray-400',
        ghost:
          'border border-transparent bg-transparent text-gray-700 ' +
          'enabled:hover:bg-gray-100 ' +
          'disabled:opacity-50',
        outline:
          'border border-gray-300 bg-white text-gray-700 ' +
          'enabled:hover:bg-gray-100 ' +
          'disabled:opacity-50',
        destructive:
          'border border-transparent bg-error text-static-white ' +
          'enabled:hover:bg-error-hover ' +
          'disabled:opacity-50',
        kakao:
          'border border-transparent bg-[var(--kakao)] text-[var(--kakao-text)] ' +
          'enabled:hover:bg-[var(--kakao-hover)] ' +
          'disabled:opacity-50',
      },
      size: {
        lg: 'h-12 px-5',
        md: 'h-[46px] px-4',
        sm: 'h-[42px] px-3',
        xs: 'h-8 rounded-sm px-3 text-[0.8125rem]',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export { buttonVariants };

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    ref?: Ref<HTMLButtonElement>;
  };

export function Button({
  variant,
  size,
  type = 'button',
  disabled,
  className,
  ref,
  ...props
}: ButtonProps) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      {...props}
      className={cn(buttonVariants({ variant, size }), className)}
    />
  );
}
