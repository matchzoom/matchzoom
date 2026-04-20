type Props = {
  message?: string;
};

export function LoadingOverlay({ message }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-primary" />
      {message && (
        <p className="mt-4 text-[0.9375rem] text-gray-600">{message}</p>
      )}
    </div>
  );
}
