import {
  ReportsTabsSection,
  TaskPerformanceCards,
  TaskReportsHeader,
  useDateRange,
  usePerformanceReport,
  useUsersReport
} from 'entities/reports';

export const TaskReportsPage = () => {

  const { preset, setPreset, dateRange, setCustomRange } = useDateRange('week');

  // Queries
  const usersQuery = useUsersReport(dateRange);
  const performanceQuery = usePerformanceReport(dateRange);

  return (
    <div className="space-y-6 p-6">
      <TaskReportsHeader
        preset={preset}
        onPresetChange={setPreset}
        onCustomRangeChange={setCustomRange}
       
      />

      {/* Секция: Производительность */}
      <TaskPerformanceCards
        performance={
          performanceQuery.data?.performance || {
            totalCreated: 0,
            totalCompleted: 0,
            avgCompletionTime: 0,
            completionRate: 0,
          }
        }
        isLoading={performanceQuery.isLoading}
      />

      {/* Секция: Отчеты с табами */}
      <ReportsTabsSection
        users={usersQuery.data?.users || []}
        isUsersLoading={usersQuery.isLoading}
        dateRange={dateRange}
      />
    </div>
  );
};
