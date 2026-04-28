import { Sun, Moon } from 'lucide-react';

type DarkModeToggleProps = {
  theme: string;
  onToggle: () => void;
};

export function DarkModeToggle({ theme, onToggle }: DarkModeToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={theme === 'dark'}
      aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
      onClick={onToggle}
      className={`relative h-[28px] w-[52px] shrink-0 cursor-pointer rounded-[14px] transition-colors duration-[150ms] ${theme === 'dark' ? 'bg-primary' : 'bg-gray-300'}`}
    >
      <span
        className="absolute top-[2px] flex h-[24px] w-[24px] items-center justify-center rounded-full bg-white transition-[left] duration-[150ms]"
        style={{ left: theme === 'dark' ? '26px' : '2px' }}
      >
        {theme === 'dark' ? (
          <Moon
            size={16}
            strokeWidth={2}
            className="text-primary"
            aria-hidden="true"
          />
        ) : (
          <Sun
            size={14}
            strokeWidth={2}
            className="text-gray-600"
            aria-hidden="true"
          />
        )}
      </span>
    </button>
  );
}
