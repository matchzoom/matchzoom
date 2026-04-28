import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes, Ref } from 'react';
import { cn } from '@/shared/utils/cn';

const buttonVariants = cva(
  'transition-ui inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-[0.9375rem] font-semibold leading-none disabled:cursor-not-allowed',
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
          'hover:bg-gray-100',
        outline:
          'border border-gray-300 bg-white text-gray-700 ' +
          'hover:bg-gray-100',
        destructive:
          'border border-transparent bg-error text-static-white ' +
          'hover:bg-error-hover',
        kakao:
          'border border-transparent bg-[var(--kakao)] text-[var(--kakao-text)] ' +
          'hover:bg-[var(--kakao-hover)]',
      },
      size: {
        lg: 'h-12 px-5',
        md: 'h-[46px] px-4',
        sm: 'h-[42px] px-3',
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
