import { Tabs } from "@radix-ui/react-tabs";
import { PageHeader } from "widgets/page-header";
import { KpiReportTabContent, KpiReportTabList } from "entities/kpi-report";

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
