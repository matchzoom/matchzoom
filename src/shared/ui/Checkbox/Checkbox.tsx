import type { InputHTMLAttributes, Ref } from 'react';
import { cn } from '@/shared/utils/cn';

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
        className="group inline-flex cursor-pointer items-center gap-2 has-[:disabled]:cursor-not-allowed"
      >
        {/* 시각적 체크박스 */}
        <span
          aria-hidden="true"
          className={cn(
            'relative flex h-[1.125rem] w-[1.125rem] shrink-0 items-center justify-center rounded-sm border transition-ui',
            'border-gray-300 bg-white',
            'group-has-[:checked]:border-primary group-has-[:checked]:bg-primary',
            'group-has-[:focus-visible]:outline group-has-[:focus-visible]:outline-2 group-has-[:focus-visible]:outline-primary group-has-[:focus-visible]:[outline-offset:2px]',
            'group-has-[:disabled]:border-gray-300 group-has-[:disabled]:bg-gray-100',
            error &&
              'border-error group-has-[:checked]:border-error group-has-[:checked]:bg-error',
            className,
          )}
        >
          {/* 체크 마크 (CSS border 트릭) */}
          <span
            className="hidden h-2.5 w-1.5 -translate-y-px rotate-45 border-b-2 border-r-2 border-white group-has-[:checked]:block"
            style={{ borderColor: 'white' }}
          />
        </span>

        {/* 실제 input — sr-only로 접근성 유지, ref 전달 */}
        <input
          type="checkbox"
          id={inputId}
          ref={ref}
          aria-describedby={errorId}
          aria-invalid={error ? true : undefined}
          className="sr-only"
          {...props}
        />

        {label && (
          <span className="text-[0.875rem] font-normal text-gray-900 group-has-[:disabled]:text-gray-400">
            {label}
          </span>
        )}
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
