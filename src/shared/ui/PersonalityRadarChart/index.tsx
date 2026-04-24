import dynamic from 'next/dynamic';

export const PersonalityRadarChart = dynamic(
  () =>
    import('./PersonalityRadarChart').then((mod) => ({
      default: mod.PersonalityRadarChart,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[260px] w-full max-w-[320px] items-center justify-center">
        <div className="h-[200px] w-[200px] animate-pulse rounded-full bg-gray-100" />
      </div>
    ),
  },
);
