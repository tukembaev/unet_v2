import { Card, CardHeader, CardContent, Skeleton } from "shared/ui";

export const ScheduleSkeleton = () => {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="border rounded-2xl backdrop-blur-sm">
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[...Array(4)].map((_, j) => (
              <div
                key={j}
                className="flex items-start gap-3 p-3 border rounded-xl"
              >
                <Skeleton className="h-8 w-8 rounded-md" />
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-10" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-14" />
                  </div>
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
