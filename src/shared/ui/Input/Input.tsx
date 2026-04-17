import { cva, type VariantProps } from 'class-variance-authority';
import type { InputHTMLAttributes, Ref } from 'react';
import { cn } from '@/shared/utils/cn';

const inputVariants = cva(
  [
    'w-full rounded-md border bg-white px-4',
    'text-[0.9375rem] font-normal text-gray-900 placeholder:text-gray-400',
    'transition-ui',
    'focus:border-primary focus-visible:[outline-offset:0]',
    'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400',
  ],
  {
    variants: {
      size: {
        lg: 'h-12',
        md: 'h-10',
      },
      state: {
        default: 'border-gray-300',
        error: 'border-error focus:border-error',
      },
    },
    defaultVariants: {
      size: 'md',
      state: 'default',
    },
  },
);

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> &
  VariantProps<typeof inputVariants> & {
    label?: string;
    hint?: string;
    error?: string;
    ref?: Ref<HTMLInputElement>;
  };

export function Input({
  label,
  hint,
  error,
  size,
  required,
  className,
  id,
  ref,
  ...props
}: InputProps) {
  const inputId =
    id ??
    (label ? `input-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  const errorId = error ? `${inputId}-error` : undefined;
  const hintId = hint && !error ? `${inputId}-hint` : undefined;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          htmlFor={inputId}
          className="text-[0.875rem] font-semibold text-gray-900"
        >
          {label}
          {required && (
            <span aria-hidden="true" className="ml-0.5 text-error">
              *
            </span>
          )}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        required={required}
        aria-required={required || undefined}
        aria-describedby={
          [errorId, hintId].filter(Boolean).join(' ') || undefined
        }
        aria-invalid={error ? true : undefined}
        {...props}
        className={cn(
          inputVariants({ size, state: error ? 'error' : 'default' }),
          className,
        )}
      />
      {hint && !error && (
        <p id={hintId} className="text-[0.8125rem] text-gray-500">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={errorId}
          role="alert"
          aria-live="polite"
          className="text-[0.8125rem] text-error"
        >
          {error}
        </p>
      )}
    </div>
  );
}
