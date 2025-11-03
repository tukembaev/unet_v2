import { Card, CardContent, CardHeader, Skeleton } from 'shared/ui';
import { Separator } from 'shared/ui/separator';

const TaskDetailsSkeleton = () => {
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64 bg-muted" />
        <Skeleton className="h-4 w-96 bg-muted" />
      </div>

      {/* Top Info Skeleton */}
      <div className="flex flex-wrap items-center gap-4">
        <Skeleton className="h-4 w-48 bg-muted" />
        <Skeleton className="h-4 w-48 bg-muted" />
      </div>

      {/* Description Skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-48 bg-muted" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full bg-muted" />
          <Skeleton className="h-4 w-full bg-muted" />
          <Skeleton className="h-4 w-3/4 bg-muted" />
        </div>
      </div>

      {/* Main Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Left side - Main content (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Members Table Skeleton */}
          <Card className="hover:shadow-md transition-all duration-200">
            <CardHeader>
              <Skeleton className="h-6 w-32 bg-muted" />
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-x-auto rounded-md border">
                <div className="space-y-3 p-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-full bg-muted" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-48 bg-muted" />
                        <Skeleton className="h-3 w-32 bg-muted" />
                      </div>
                      <Skeleton className="h-6 w-20 rounded-full bg-muted" />
                      <Skeleton className="h-6 w-24 rounded-full bg-muted" />
                      <Skeleton className="h-4 w-32 bg-muted" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subtasks Table Skeleton */}
          <Card className="hover:shadow-md transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <Skeleton className="h-6 w-32 bg-muted" />
              <Skeleton className="h-9 w-40 bg-muted" />
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-x-auto rounded-md border">
                <div className="space-y-3 p-4">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-4 w-48 bg-muted" />
                      <Skeleton className="h-6 w-24 rounded-full bg-muted" />
                      <Skeleton className="h-4 w-32 bg-muted" />
                      <Skeleton className="h-4 w-24 bg-muted" />
                      <Skeleton className="h-4 w-24 bg-muted" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right side - Documents (1/3) */}
        <div className="lg:col-span-1">
          <Card className="hover:shadow-md transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <Skeleton className="h-6 w-32 bg-muted" />
              <Skeleton className="h-9 w-28 bg-muted" />
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-x-auto rounded-md border">
                <div className="space-y-3 p-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <Skeleton className="h-4 w-32 bg-muted" />
                      <Skeleton className="h-8 w-8 rounded bg-muted" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsSkeleton;

