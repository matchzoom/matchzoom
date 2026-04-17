import { ChevronDown } from 'lucide-react';
import type { Ref, SelectHTMLAttributes } from 'react';
import { cn } from '@/shared/utils/cn';

type SelectOption = { value: string; label: string };

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> & {
  label?: string;
  hint?: string;
  error?: string;
  placeholder?: string;
  options: SelectOption[];
  ref?: Ref<HTMLSelectElement>;
};

export function Select({
  label,
  hint,
  error,
  placeholder,
  options,
  required,
  className,
  id,
  ref,
  ...props
}: SelectProps) {
  const selectId =
    id ??
    (label ? `select-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  const errorId = error ? `${selectId}-error` : undefined;
  const hintId = hint && !error ? `${selectId}-hint` : undefined;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          htmlFor={selectId}
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

      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          required={required}
          aria-required={required || undefined}
          aria-describedby={
            [errorId, hintId].filter(Boolean).join(' ') || undefined
          }
          aria-invalid={error ? true : undefined}
          {...props}
          className={cn(
            'w-full appearance-none rounded-md border px-4 pr-10',
            'h-10 cursor-pointer text-[0.9375rem] font-normal',
            'bg-white text-gray-900',
            'transition-ui',
            'focus:border-primary focus-visible:[outline-offset:0]',
            'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400',
            error ? 'border-error focus:border-error' : 'border-gray-300',
            className,
          )}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <ChevronDown
          size={16}
          strokeWidth={1.5}
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
        />
      </div>

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
