import { Tabs, TabsContent, TabsList, TabsTrigger } from 'shared/ui';
import { PendingDocuments } from '../components/PendingDocuments';
import { ActiveTasks } from '../components/ActiveTasks';
import { UpcomingEvents } from '../components/UpcomingEvents';

export const AttentionCards = () => {
  return (
    <Tabs defaultValue="documents" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="documents">Документы</TabsTrigger>
        <TabsTrigger value="tasks">Задачи</TabsTrigger>
        <TabsTrigger value="events">События</TabsTrigger>
      </TabsList>

      <TabsContent value="documents" className="mt-4">
        <PendingDocuments />
      </TabsContent>

      <TabsContent value="tasks" className="mt-4">
        <ActiveTasks />
      </TabsContent>

      <TabsContent value="events" className="mt-4">
        <UpcomingEvents />
      </TabsContent>
    </Tabs>
  );
};
