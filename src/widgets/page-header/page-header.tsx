import React from "react";
import { cn } from "shared/lib";
import { SmartBreadcrumbs } from "shared/ui";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  children,
  className,
}) => {
  return (
    <div className="space-y-4">
      {/* Breadcrumbs */}
      <SmartBreadcrumbs />

      <div className={cn("w-full", className)}>
        <div className="flex flex-col items-start justify-between lg:flex-row items-start">
          <div className="space-y-1 flex-1 min-w-0">
            <h1 className="text-3xl font-bold tracking-tight">
              {title}
            </h1>
            {description && (
              <p className="text-sm ">{description}</p>
            )}
          </div>
          {children && (
            <div className="flex flex-wrap items-center gap-2 mt-6 lg:mt-0 lg:flex-nowrap lg:shrink-0">
              {children}
            </div>
          )}
        </div>
        {/* <div className="mt-6 border-t border-gray-200" /> */}
      </div>
    </div>
  );
};

export default PageHeader;
