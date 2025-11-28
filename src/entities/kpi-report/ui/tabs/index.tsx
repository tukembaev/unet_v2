import { TabsContent, TabsList, TabsTrigger } from "shared/ui";

import { BarChart2, Building2, Star, Users } from "lucide-react";
import { Institute } from "./institute/Institute";
import { EmployeesTab } from "./employees/EmployeesTab";
import { AvgScoreTab } from "./avgScore/AvgScoreTab";
import { Rating } from "./rating/Rating";

export const KpiReportTabList = () => {
  return (
    <TabsList className="inline-flex h-auto w-auto flex-wrap gap-1 p-1">
      <TabsTrigger value="institute" className="flex-shrink-0 gap-1">
        <Building2 size={20} /> Институты
      </TabsTrigger>
      <TabsTrigger value="employees" className="flex-shrink-0 gap-1">
        <Users size={20} /> Все сотрудники
      </TabsTrigger>
      <TabsTrigger value="avgScore" className="flex-shrink-0 gap-1">
        <Star size={20} /> Выше среднего бала
      </TabsTrigger>
      <TabsTrigger value="rating" className="flex-shrink-0 gap-1">
        <BarChart2 size={20} /> Рейтинг по критериям
      </TabsTrigger>
    </TabsList>
  );
};

export const KpiReportTabContent = () => {
  return (
    <div className="mt-6">
      <TabsContent value="institute">
        <Institute />
      </TabsContent>

      <TabsContent value="employees">
        <EmployeesTab />
      </TabsContent>

      <TabsContent value="avgScore">
        <AvgScoreTab />
      </TabsContent>

      <TabsContent value="rating">
        <Rating />
      </TabsContent>
    </div>
  );
};


