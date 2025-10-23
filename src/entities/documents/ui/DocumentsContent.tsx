import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger, Button } from 'shared/ui';
import { Plus, FileText } from 'lucide-react';
import { DocumentsTable } from './DocumentsTable';
import { DocumentsTableSkeleton } from './DocumentsTableSkeleton';
import { DocumentsFilter } from './DocumentsFilter';
import { useDocuments } from '../model/queries';
import { DocumentTab } from '../model/types';

export const DocumentsContent = () => {
  const [activeTab, setActiveTab] = useState<DocumentTab>('incoming');
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['all']);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['all']);

  const { data, isLoading } = useDocuments({
    tab: activeTab,
    types: selectedTypes,
    statuses: selectedStatuses,
  });

  return (
    <div className="space-y-4">

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as DocumentTab)}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <TabsList>
              <TabsTrigger value="incoming">Входящие</TabsTrigger>
              <TabsTrigger value="outgoing">Исходящие</TabsTrigger>
              <TabsTrigger value="history">История</TabsTrigger>
            </TabsList>
            <DocumentsFilter
              selectedTypes={selectedTypes}
              selectedStatuses={selectedStatuses}
              onTypesChange={setSelectedTypes}
              onStatusesChange={setSelectedStatuses}
            />
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-initial">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Создать отчет</span>
            </Button>
            <Button className="flex-1 sm:flex-initial">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Создать</span>
            </Button>
          </div>
        </div>

        <TabsContent value="incoming" className="mt-4">
          {isLoading ? (
            <DocumentsTableSkeleton />
          ) : (
            <DocumentsTable documents={data?.documents || []} />
          )}
        </TabsContent>

        <TabsContent value="outgoing" className="mt-4">
          {isLoading ? (
            <DocumentsTableSkeleton />
          ) : (
            <DocumentsTable documents={data?.documents || []} />
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          {isLoading ? (
            <DocumentsTableSkeleton />
          ) : (
            <DocumentsTable documents={data?.documents || []} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

