type ProductSkeletonProps = {
  count?: number;
  className?: string;
};

function SingleSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white dark:border-[#1f3524] dark:bg-[#0e1c12]">
      <div className="aspect-square animate-shimmer bg-zencarta-surface" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-16 rounded-full bg-zencarta-surface" />
        <div className="h-4 w-full rounded-full bg-zencarta-surface" />
        <div className="h-4 w-2/3 rounded-full bg-zencarta-surface" />
        <div className="flex justify-between pt-2">
          <div className="h-5 w-14 rounded-full bg-zencarta-surface" />
          <div className="h-9 w-9 rounded-xl bg-zencarta-surface" />
        </div>
      </div>
    </div>
  );
}

export function ProductSkeleton({ count = 1, className = "" }: ProductSkeletonProps) {
  if (count === 1) return <SingleSkeleton />;

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={className}>
          <SingleSkeleton />
        </div>
      ))}
    </>
  );
}

export function ProductSkeletonGrid({
  count = 8,
  className = "grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4",
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <SingleSkeleton key={i} />
      ))}
    </div>
  );
}
