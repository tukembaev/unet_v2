import { KpiReportTabContent, KpiReportTabList } from "entities/kpi-report";
import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { PageHeader } from "widgets/page-header";
import { Tabs } from "shared/ui";

export const KpiReportPage = () => {
  const location = useLocation();
  const restoreContext = (location.state as { kpiRestoreContext?: Record<string, unknown> } | null)
    ?.kpiRestoreContext as
    | {
        tab?: string;
        instituteId?: number;
        departmentId?: number;
        departmentName?: string;
      }
    | undefined;
  const initialTab = useMemo(
    () => (restoreContext?.tab === "employees" || restoreContext?.tab === "avgScore" ? restoreContext.tab : "institute"),
    [restoreContext]
  );
  const [tab, setTab] = useState(initialTab);

  return (
    <div className="space-y-4">
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <PageHeader
          title="KPI Отчеты"
          description="Кыргызский Государственный Технический Университет имени И.Раззакова"
        >
          <KpiReportTabList />
        </PageHeader>
        <KpiReportTabContent restoreContext={restoreContext} />
      </Tabs>
    </div>
  );
};
