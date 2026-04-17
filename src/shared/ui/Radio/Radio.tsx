import type { InputHTMLAttributes, ReactNode, Ref } from 'react';
import { cn } from '@/shared/utils/cn';

/* ─── Radio ─────────────────────────────────────────────────────────── */

type RadioProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size'
> & {
  label?: string;
  ref?: Ref<HTMLInputElement>;
};

export function Radio({ label, className, id, ref, ...props }: RadioProps) {
  const inputId =
    id ??
    (label ? `radio-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

  return (
    <label
      htmlFor={inputId}
      className="group inline-flex cursor-pointer items-center gap-2 has-[:disabled]:cursor-not-allowed"
    >
      {/* 시각적 라디오 */}
      <span
        aria-hidden="true"
        className={cn(
          'relative flex h-[1.125rem] w-[1.125rem] shrink-0 items-center justify-center rounded-full border transition-ui',
          'border-gray-300 bg-white',
          'group-has-[:checked]:border-primary',
          'group-has-[:focus-visible]:outline group-has-[:focus-visible]:outline-2 group-has-[:focus-visible]:outline-primary group-has-[:focus-visible]:[outline-offset:2px]',
          'group-has-[:disabled]:border-gray-300 group-has-[:disabled]:bg-gray-100',
          className,
        )}
      >
        {/* 내부 dot */}
        <span className="hidden h-2 w-2 rounded-full bg-primary group-has-[:checked]:block group-has-[:disabled]:bg-gray-400" />
      </span>

      {/* 실제 input — sr-only로 접근성 유지, ref 전달 */}
      <input
        type="radio"
        id={inputId}
        ref={ref}
        className="sr-only"
        {...props}
      />

      {label && (
        <span className="text-[0.875rem] font-normal text-gray-900 group-has-[:disabled]:text-gray-400">
          {label}
        </span>
      )}
    </label>
  );
}

/* ─── RadioGroup ─────────────────────────────────────────────────────── */

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
        <legend className="mb-2 text-[0.875rem] font-semibold text-gray-900">
          {label}
          {required && (
            <span aria-hidden="true" className="ml-0.5 text-error">
              *
            </span>
          )}
        </legend>
      )}

      <div className="flex flex-col gap-2" aria-describedby={errorId}>
        {children}
      </div>

      {error && (
        <p
          id={errorId}
          role="alert"
          aria-live="polite"
          className="mt-1.5 text-[0.8125rem] text-error"
        >
          {error}
        </p>
      )}
    </fieldset>
  );
}
