import { PageHeader } from 'widgets/page-header';
import { DocumentsContent } from 'entities/documents';

export const DocumentsPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Обращения"
        description="Управление входящими и исходящими документами, заявлениями и отчетами"
      />
      
      <DocumentsContent />
    </div>
  );
};

