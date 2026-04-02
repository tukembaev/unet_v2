import { Skeleton } from "shared/ui";

export function SelectSkeleton() {
  return (
    <div className="py-2 animate-pulse">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center gap-3 px-2 py-1.5">
          <Skeleton className="h-8 w-8 rounded-full shrink-0" />
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <Skeleton className="h-4 w-full max-w-[120px]" />
            <Skeleton className="h-3 w-full max-w-[160px]" />
          </div>
        </div>
      ))}
    </div>
  );
}