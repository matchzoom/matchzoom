import clsx from 'clsx';
import type { ButtonHTMLAttributes, Ref } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
type ButtonSize = 'lg' | 'md' | 'sm' | 'icon';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  ref?: Ref<HTMLButtonElement>;
};

const sizeClass: Record<ButtonSize, string> = {
  lg: 'h-12 px-5',
  md: 'h-10 px-4',
  sm: 'h-8 px-3',
  icon: 'h-11 w-11',
};

const variantClass: Record<ButtonVariant, string> = {
  primary:
    'border border-transparent bg-primary text-white ' +
    'hover:bg-primary-hover active:bg-primary-pressed ' +
    'disabled:bg-gray-200 disabled:text-gray-400',
  secondary:
    'border border-primary bg-white text-primary ' +
    'hover:bg-primary-bg ' +
    'disabled:border-gray-200 disabled:bg-white disabled:text-gray-400',
  ghost:
    'border border-transparent bg-transparent text-gray-700 ' +
    'hover:bg-gray-100',
  destructive:
    'border border-transparent bg-error text-white ' + 'hover:bg-error-hover',
};

export function Button({
  variant = 'primary',
  size = 'md',
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
      className={clsx(
        'transition-ui inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-[0.9375rem] font-semibold leading-none',
        'disabled:cursor-not-allowed',
        sizeClass[size],
        variantClass[variant],
        className,
      )}
    />
  );
}
