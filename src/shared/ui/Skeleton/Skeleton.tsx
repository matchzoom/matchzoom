import clsx from 'clsx';

type SkeletonProps = {
  className?: string;
  width?: string;
  height?: string;
};

export function Skeleton({ className, width, height }: SkeletonProps) {
  return (
    <span
      role="status"
      aria-busy="true"
      aria-label="로딩 중"
      className={clsx('block animate-pulse rounded-sm bg-gray-200', className)}
      style={{ width, height }}
    />
  );
}
