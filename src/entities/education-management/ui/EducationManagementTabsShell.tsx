import type { ReactNode } from "react";
import { usePermissions } from "entities/user";
import { Tabs, Skeleton } from "shared/ui";
import { PageHeader } from "widgets/page-header";
import { useEducationManagementTab } from "../lib/use-education-tab-url";
import type { EducationTabId } from "../lib/education-tab-permissions";
import {
  EducationManagementNoAccess,
  EducationManagementTabsContent,
  EducationManagementTabsList,
} from "./tabs";

type EducationManagementTabsShellProps = {
  prefer?: EducationTabId;
  title?: string;
  description?: string;
  headerExtra?: ReactNode;
};

export function EducationManagementTabsShell({
  prefer,
  title = "Учебное управление",
  description = "Кыргызский Государственный Технический Университет имени И.Раззакова",
  headerExtra,
}: EducationManagementTabsShellProps) {
  const { isLoading } = usePermissions();
  const { activeTab, setActiveTab, fallbackTab } = useEducationManagementTab(prefer);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!fallbackTab || !activeTab) {
    return (
      <div className="space-y-4">
        <PageHeader title={title} description={description} />
        <EducationManagementNoAccess />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <PageHeader title={title} description={description}>
          {headerExtra ?? <EducationManagementTabsList />}
        </PageHeader>
        <EducationManagementTabsContent />
      </Tabs>
    </div>
  );
}
