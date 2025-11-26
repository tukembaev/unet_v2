import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from 'shared/ui';
import { CreatedByMeTab } from './CreatedByMeTab';
import { ReportsTabContent } from './ReportsTabContent';

interface CurriculumContentProps {
  searchQuery: string;
}

export const CurriculumContent = ({ searchQuery }: CurriculumContentProps) => {
  const [activeTab, setActiveTab] = useState('created');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="created">Созданные мной</TabsTrigger>
        <TabsTrigger value="reports">Отчеты</TabsTrigger>
      </TabsList>

      <TabsContent value="created" className="mt-4">
        <CreatedByMeTab searchQuery={searchQuery} />
      </TabsContent>

      <TabsContent value="reports" className="mt-4">
        <ReportsTabContent />
      </TabsContent>
    </Tabs>
  );
};

