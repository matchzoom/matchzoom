import { Check } from 'lucide-react';
import type { InputHTMLAttributes, ReactNode, Ref } from 'react';
import { cn } from '@/shared/utils/cn';

/* ─── Checkbox (Pill) ─────────────────────────────────────────────── */

type CheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size'
> & {
  label?: string;
  error?: string;
  ref?: Ref<HTMLInputElement>;
};

export function Checkbox({
  label,
  error,
  className,
  id,
  ref,
  disabled,
  ...props
}: CheckboxProps) {
  const inputId =
    id ??
    (label
      ? `checkbox-${label.replace(/\s+/g, '-').toLowerCase()}`
      : undefined);
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className={cn(
          'group transition-ui inline-flex h-10 items-center gap-1.5 rounded-md border px-4',
          'text-[0.875rem] font-normal leading-none',
          disabled
            ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
            : 'cursor-pointer border-gray-300 bg-white text-gray-700 hover:border-primary-border hover:bg-primary-bg',
          'has-[:checked]:border-primary has-[:checked]:bg-primary has-[:checked]:text-static-white',
          'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary has-[:focus-visible]:[outline-offset:2px]',
          error && 'border-error',
          className,
        )}
      >
        <Check
          size={16}
          strokeWidth={2}
          aria-hidden="true"
          className="hidden group-has-[:checked]:block"
        />
        <input
          type="checkbox"
          id={inputId}
          ref={ref}
          disabled={disabled}
          aria-describedby={errorId}
          aria-invalid={error ? true : undefined}
          className="sr-only"
          {...props}
        />
        {label && <span>{label}</span>}
      </label>

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

/* ─── CheckboxGroup ──────────────────────────────────────────────────── */

type CheckboxGroupProps = {
  label?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
};

export function CheckboxGroup({
  label,
  error,
  required,
  children,
  className,
}: CheckboxGroupProps) {
  const errorId = error ? 'checkboxgroup-error' : undefined;

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
