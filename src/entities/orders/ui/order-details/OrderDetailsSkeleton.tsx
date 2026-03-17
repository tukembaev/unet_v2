import { Card, CardContent, Skeleton } from 'shared/ui';
import { Separator } from 'shared/ui/separator';

const OrderDetailsSkeleton = () => {
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Description Skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-48" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>

      {/* Split layout: PDF and cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Left side - PDF Viewers and Approval Flow */}
        <div className="w-full flex flex-col gap-4">
          {/* PDF Viewer Skeleton */}
          <div className="rounded-lg border bg-muted/50 overflow-hidden">
            <div className="h-[600px] flex flex-col">
              {/* PDF Toolbar */}
              <div className="flex items-center justify-between p-3 border-b bg-background">
                <Skeleton className="h-8 w-32" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
              {/* PDF Content */}
              <div className="flex-1 flex items-center justify-center bg-muted/60">
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
          </div>

          {/* Additional Files Skeletons */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <div className="rounded-lg border bg-muted/60 h-48" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-36" />
            <div className="rounded-lg border bg-muted/60 h-48" />
          </div>

          {/* Approval Flow Skeleton */}
          <Card className="hover:shadow-md transition-all duration-200">
            <CardContent className="p-4 md:p-6">
              <div className="mb-4 flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-48" />
              </div>
              
              {/* Snake grid of avatars */}
              <div className="grid grid-cols-4 gap-x-4 gap-y-12">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right side - Order Info Card */}
        <div className="w-full space-y-4 md:space-y-6">
          <Card className="hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-40" />
              </div>

              <div className="space-y-4">
                {/* Order Number */}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Skeleton className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>

                {/* Document Number */}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Skeleton className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Skeleton className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-4 w-36" />
                  </div>
                </div>

                {/* Order Date */}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Skeleton className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                </div>

                {/* Sender Info */}
                <div className="border-t border-border pt-4">
                  <Skeleton className="h-3 w-40 mb-3" />

                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <Skeleton className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <Skeleton className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-4 w-48" />
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <Skeleton className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-3 w-28" />
                        <Skeleton className="h-4 w-56" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator className="my-6" />

      {/* History Skeleton */}
      <Card className="hover:shadow-md transition-all duration-200">
        <CardContent className="p-4 md:p-6">
          <div className="mb-4 flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-6 w-40" />
          </div>

          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="relative pl-8">
                {/* Timeline indicator */}
                <Skeleton className="absolute left-0 top-0.5 h-7 w-7 rounded-full" />
                
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full max-w-md" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetailsSkeleton;

