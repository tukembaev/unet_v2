import { useMemo, type ReactNode } from "react";
import { usePermissions } from "entities/user";
import {
  Empty,
  EmptyDescription,
  EmptyTitle,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "shared/ui";
import {
  getEducationTabLabel,
  getVisibleEducationTabIds,
  type EducationTabId,
} from "../../lib/education-tab-permissions";
import { FamiliesTab } from "./Family/FamiliesTab.tsx";
import { DisciplinesTab } from "./discipline/DisciplinesTab.tsx";
import { ReportsTab } from "./report/ReportsTab.tsx";
import { DispatcherTab } from "./dispatcher/DispatcherTab.tsx";
import { WorkloadTab } from "./workload/WorkloadTab.tsx";

function useVisibleEducationTabs(): EducationTabId[] {
  const { permissions } = usePermissions();
  return useMemo(
    () => getVisibleEducationTabIds(permissions),
    [permissions]
  );
}

export const EducationManagementTabsList = () => {
  const visible = useVisibleEducationTabs();
  if (visible.length === 0) return null;
  return (
    <TabsList className="inline-flex h-auto w-auto flex-wrap gap-1 p-1">
      {visible.map((id) => (
        <TabsTrigger key={id} value={id} className="flex-shrink-0">
          {getEducationTabLabel(id)}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

const TAB_CONTENT: Record<EducationTabId, ReactNode> = {
  families: <FamiliesTab />,
  disciplines: <DisciplinesTab />,
  reports: <ReportsTab />,
  dispatcher: <DispatcherTab />,
  workload: <WorkloadTab />,
};

export const EducationManagementTabsContent = () => {
  const visible = useVisibleEducationTabs();
  return (
    <div className="mt-6">
      {visible.map((id) => (
        <TabsContent key={id} value={id}>
          {TAB_CONTENT[id]}
        </TabsContent>
      ))}
    </div>
  );
};

/** Если ни одной вкладки по правам — показываем заглушку. */
export function EducationManagementNoAccess() {
  return (
    <Empty className="border border-dashed py-12">
      <EmptyTitle>Нет доступа</EmptyTitle>
      <EmptyDescription>
        У вас нет прав на разделы учебного управления. Обратитесь к администратору.
      </EmptyDescription>
    </Empty>
  );
}
