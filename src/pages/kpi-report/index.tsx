import { KpiReportTabContent, KpiReportTabList } from "entities/kpi-report";
import { PageHeader } from "widgets/page-header";
import { Tabs } from "shared/ui";

export const KpiReportPage = () => {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="institute" className="w-full">
        <PageHeader
          title="KPI Отчеты"
          description="Кыргызский Государственный Технический Университет имени И.Раззакова"
        >
          <KpiReportTabList />
        </PageHeader>
        <KpiReportTabContent />
      </Tabs>
    </div>
  );
};
