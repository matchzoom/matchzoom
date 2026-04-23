export function DashboardSkeleton() {
  return (
    <div className="animate-pulse py-10 md:py-16">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-[60px] px-4 md:px-5 lg:px-6">
        {/* AIResultCard 스켈레톤 */}
        <div className="h-[360px] rounded-2xl bg-gray-100" />

        {/* JobListSection 스켈레톤 */}
        <div className="flex flex-col gap-4">
          <div className="h-10 w-48 rounded-lg bg-gray-100" />
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-28 rounded-xl bg-gray-100" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
