import type { InputHTMLAttributes, ReactNode, Ref } from 'react';
import { cn } from '@/shared/utils/cn';

/* ─── Radio (Pill) ────────────────────────────────────────────────── */

type RadioProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size'
> & {
  label?: string;
  ref?: Ref<HTMLInputElement>;
};

export function Radio({
  label,
  className,
  id,
  ref,
  disabled,
  ...props
}: RadioProps) {
  const inputId =
    id ??
    (label ? `radio-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

  return (
    <label
      htmlFor={inputId}
      className={cn(
        'transition-ui inline-flex h-10 items-center rounded-md border px-4',
        'text-[0.875rem] font-normal leading-none',
        disabled
          ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
          : 'cursor-pointer border-gray-300 bg-white text-gray-700 hover:border-primary-border hover:bg-primary-bg',
        'has-[:checked]:border-primary has-[:checked]:bg-primary has-[:checked]:text-static-white',
        'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary has-[:focus-visible]:[outline-offset:2px]',
        className,
      )}
    >
      <input
        type="radio"
        id={inputId}
        ref={ref}
        disabled={disabled}
        className="sr-only"
        {...props}
      />
      {label}
    </label>
  );
}

/* ─── RadioGroup ──────────────────────────────────────────────────── */

type RadioGroupProps = {
  label?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
};

export function RadioGroup({
  label,
  error,
  required,
  children,
  className,
}: RadioGroupProps) {
  const errorId = error ? 'radiogroup-error' : undefined;

  return (
    <fieldset className={cn('flex flex-col gap-0 border-0 p-0', className)}>
      {label && (
        <legend className="mb-3 text-[0.875rem] font-semibold text-gray-900">
          {label}
          {required && (
            <span aria-hidden="true" className="ml-0.5 text-error">
              *
            </span>
          )}
        </legend>
      )}

      <div className="flex flex-wrap gap-2" aria-describedby={errorId}>
        {children}
      </div>

      {error && (
        <p
          id={errorId}
          role="alert"
          aria-live="polite"
          className="mt-2 text-[0.8125rem] text-error"
        >
          {error}
        </p>
      )}
    </fieldset>
  );
}
