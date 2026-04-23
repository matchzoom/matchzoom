'use client';

import { Button } from '@/shared/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex flex-col gap-2">
        <p className="text-[1rem] font-semibold text-gray-900">
          오류가 발생했어요
        </p>
        <p className="text-[0.875rem] text-gray-500">
          {error.message || '잠시 후 다시 시도해 주세요.'}
        </p>
      </div>
      <Button variant="secondary" onClick={reset}>
        다시 시도
      </Button>
    </div>
  );
}
