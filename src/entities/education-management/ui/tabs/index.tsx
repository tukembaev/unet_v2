import { Tabs, TabsContent, TabsList, TabsTrigger } from "shared/ui";
import { FamiliesTab } from "./Family/FamiliesTab.tsx";
import { DisciplinesTab } from "./discipline/DisciplinesTab.tsx";
import { ReportsTab } from "./ReportsTab.tsx";
import { DispatcherTab } from "./DispatcherTab.tsx";
import { WorkloadTab } from "./workload/WorkloadTab.tsx";


export const EducationManagementTabsList = () => {
  return (
    <TabsList className="inline-flex h-auto w-auto flex-wrap gap-1 p-1">
      <TabsTrigger value="families" className="flex-shrink-0">
        Семейства
      </TabsTrigger>
      <TabsTrigger value="disciplines" className="flex-shrink-0">
        Дисциплины
      </TabsTrigger>
      <TabsTrigger value="reports" className="flex-shrink-0">
        Отчеты
      </TabsTrigger>
      <TabsTrigger value="dispatcher" className="flex-shrink-0">
        Диспетчерская
      </TabsTrigger>
      <TabsTrigger value="workload" className="flex-shrink-0">
        Нагрузка
      </TabsTrigger>
    </TabsList>
  );
};

export const EducationManagementTabsContent = () => {
  return (
    <div className="mt-6">
      <TabsContent value="families">
        <FamiliesTab />
      </TabsContent>
      
      <TabsContent value="disciplines">
        <DisciplinesTab />
      </TabsContent>
      
      <TabsContent value="reports">
        <ReportsTab />
      </TabsContent>
      
      <TabsContent value="dispatcher">
        <DispatcherTab />
      </TabsContent>
      
      <TabsContent value="workload">
        <WorkloadTab />
      </TabsContent>
    </div>
  );
};

export const EducationManagementTabs = () => {
  return (
    <Tabs defaultValue="families" className="w-full">
      <EducationManagementTabsList />
      <EducationManagementTabsContent />
    </Tabs>
  );
};
