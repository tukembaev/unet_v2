import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'shared/ui/tabs';
import { TaskUsersTable } from './TaskUsersTable';
import { TasksTable } from './TasksTable';
import { useTasksReport } from '../model/queries';
import type { UserTaskStats, TaskRole, TaskStatus, DateRangeParams } from '../model/types';

interface ReportsTabsSectionProps {
  users: UserTaskStats[];
  isUsersLoading: boolean;
  dateRange: DateRangeParams;
}

export const ReportsTabsSection = ({
  users,
  isUsersLoading,
  dateRange,
}: ReportsTabsSectionProps) => {
  const [selectedRole, setSelectedRole] = useState<TaskRole | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | 'ALL'>('ALL');

  // Параметры для запроса задач
  const tasksParams = {
    ...dateRange,
    ...(selectedRole !== 'ALL' && { role: selectedRole }),
    ...(selectedStatus !== 'ALL' && { status: selectedStatus }),
  };

  const tasksQuery = useTasksReport(tasksParams);

  return (
    <Tabs defaultValue="users" className="space-y-4">
      <TabsList>
        <TabsTrigger value="users">Отчет по исполнителям</TabsTrigger>
        <TabsTrigger value="tasks">Отчет по задачам</TabsTrigger>
      </TabsList>

      <TabsContent value="users">
        <TaskUsersTable users={users} isLoading={isUsersLoading} />
      </TabsContent>

      <TabsContent value="tasks">
        <TasksTable
          tasks={tasksQuery.data?.tasks || []}
          isLoading={tasksQuery.isLoading}
          onRoleChange={setSelectedRole}
          onStatusChange={setSelectedStatus}
          selectedRole={selectedRole}
          selectedStatus={selectedStatus}
        />
      </TabsContent>
    </Tabs>
  );
};