import { useMemo } from "react";
import { usePermissions } from "entities/user";
import {
  EducationManagementNoAccess,
  EducationManagementTabsContent,
  EducationManagementTabsList,
} from "entities/education-management/ui/tabs";
import { getFirstAccessibleEducationTab } from "entities/education-management/lib/education-tab-permissions";
import { Tabs } from "shared/ui";
import { Skeleton } from "shared/ui";
import { PageHeader } from "widgets/page-header";

/** URL `/education/workload` — приоритет вкладки «Нагрузка» (`education_department:workload`). */
export default function WorkloadPage() {
  const { permissions, isLoading } = usePermissions();
  const defaultTab = useMemo(
    () => getFirstAccessibleEducationTab(permissions, "workload"),
    [permissions]
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!defaultTab) {
    return (
      <div className="space-y-4">
        <PageHeader
          title="Учебное управление"
          description="Нагрузка — КГТУ им. И. Раззакова"
        />
        <EducationManagementNoAccess />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue={defaultTab} key={defaultTab} className="w-full">
        <PageHeader
          title="Учебное управление"
          description="Нагрузка — КГТУ им. И. Раззакова"
        >
          <EducationManagementTabsList />
        </PageHeader>

        <EducationManagementTabsContent />
      </Tabs>
    </div>
  );
}
