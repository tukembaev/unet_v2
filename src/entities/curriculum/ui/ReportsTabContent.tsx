import { useReports } from 'entities/education-management/model/queries';
import { ReportsTable } from 'entities/education-management/ui/tabs/report/ReportsTable';



export const ReportsTabContent = () => {
  const { data: reports } = useReports();
  return (
    <div className="space-y-4">
      {reports && reports.length > 0 && <ReportsTable data={reports} />}
    </div>
  );
};

