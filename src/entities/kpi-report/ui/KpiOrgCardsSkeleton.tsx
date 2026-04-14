import { Skeleton } from "shared/ui";
import { cn } from "shared/lib/utils";

function KpiOrgCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="h-[22px] w-[22px] shrink-0 rounded-md" />
        <Skeleton className="h-4 flex-1 max-w-[85%]" />
      </div>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Skeleton className="mt-0.5 h-[18px] w-[18px] shrink-0 rounded-sm" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-[80%] max-w-[200px]" />
            <Skeleton className="h-3 w-full rounded-full" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-[18px] w-[18px] shrink-0 rounded-sm" />
          <Skeleton className="h-4 w-[55%] max-w-[160px]" />
        </div>
      </div>
    </div>
  );
}

type Props = {
  count?: number;
  className?: string;
};

export function KpiOrgCardsSkeleton({ count = 8, className }: Props) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className
      )}
      aria-busy
      aria-label="Загрузка"
    >
      {Array.from({ length: count }).map((_, i) => (
        <KpiOrgCardSkeleton key={i} />
      ))}
    </div>
  );
}
