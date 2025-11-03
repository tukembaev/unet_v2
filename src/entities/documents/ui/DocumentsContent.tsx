import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Clock, CircleDot, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from 'shared/ui';
import { DocumentsTableSkeleton } from './DocumentsTableSkeleton';
import {
  GenericTabsContent,
  ColumnConfig,
  FilterGroup,
  TabConfig,
  ButtonConfig,
} from 'shared/components/data-table';
import { useDocuments } from '../model/queries';
import { Document, DocumentTab } from '../model/types';
import { CreateDocumentDialog } from 'features/create-document';

const statusIcons: Record<string, React.ReactNode> = {
  'В режиме ожидания': <Clock className="h-3 w-3 text-yellow-500" />,
  'В работе': <CircleDot className="h-3 w-3" />,
  'Выполнено': <CheckCircle2 className="h-3 w-3 text-green-500" />,
  'Отклонено': <XCircle className="h-3 w-3 text-red-500" />,
};

const typeOptions = [
  { label: 'Все', value: 'all' },
  { label: 'Рапорт', value: 'Рапорт' },
  { label: 'Письмо', value: 'Письмо' },
  { label: 'Заявление', value: 'Заявление' },
];

const statusOptions = [
  { label: 'Все', value: 'all' },
  { label: 'В режиме ожидания', value: 'В режиме ожидания' },
  { label: 'В работе', value: 'В работе' },
  { label: 'Выполнено', value: 'Выполнено' },
  { label: 'Отклонено', value: 'Отклонено' },
];

const tabs: TabConfig[] = [
  { value: 'incoming', label: 'Входящие' },
  { value: 'outgoing', label: 'Исходящие' },
  { value: 'history', label: 'История' },
];

export const DocumentsContent = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DocumentTab>('incoming');
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['all']);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['all']);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data, isLoading } = useDocuments({
    tab: activeTab,
    types: selectedTypes,
    statuses: selectedStatuses,
  });

  const columns: ColumnConfig<Document>[] = [
    {
      key: 'number',
      label: 'Номер',
      width: '180px',
      minWidth: '180px',
      className: 'font-medium whitespace-nowrap',
      render: (doc) => doc.number,
    },
    {
      key: 'employee',
      label: 'Заявитель',
      width: '200px',
      minWidth: '200px',
      className: 'whitespace-nowrap',
      render: (doc) => doc.employee.surname_name,
    },
    {
      key: 'type_doc',
      label: 'Тип',
      width: '150px',
      minWidth: '150px',
      className: 'whitespace-nowrap',
      render: (doc) => doc.type_doc,
    },
    {
      key: 'type',
      label: 'Тема',
      minWidth: '250px',
      render: (doc) => doc.type,
    },
    {
      key: 'status',
      label: 'Статус',
      width: '180px',
      minWidth: '180px',
      render: (doc) => (
        <Badge variant="outline" className="gap-1.5 whitespace-nowrap">
          {statusIcons[doc.status]}
          {doc.status}
        </Badge>
      ),
    },
    {
      key: 'date_zayavki',
      label: 'Дата подачи',
      width: '150px',
      minWidth: '150px',
      className: 'whitespace-nowrap',
      render: (doc) => doc.date_zayavki,
    },
  ];

  const filterGroups: FilterGroup[] = [
    {
      id: 'types',
      label: 'Тип документа',
      options: typeOptions,
      selectedValues: selectedTypes,
      onChange: setSelectedTypes,
    },
    {
      id: 'statuses',
      label: 'Статус',
      options: statusOptions,
      selectedValues: selectedStatuses,
      onChange: setSelectedStatuses,
    },
  ];

  const buttons: ButtonConfig[] = [
    {
      label: 'Создать отчет',
      icon: <FileText className="h-4 w-4" />,
      onClick: () => console.log('Create report'),
      variant: 'outline',
    },
    {
      label: 'Создать',
      icon: <Plus className="h-4 w-4" />,
      onClick: () => setIsCreateDialogOpen(true),
      variant: 'default',
    },
  ];

  const handleClearFilters = () => {
    setSelectedTypes(['all']);
    setSelectedStatuses(['all']);
  };

  const handleRowClick = (doc: Document) => {
    navigate(`/documents/applications/${doc.id}`);
  };

  return (
    <>
      <GenericTabsContent
        tabs={tabs}
        defaultTab="incoming"
        columns={columns}
        data={data?.documents}
        isLoading={isLoading}
        onTabChange={(tab) => setActiveTab(tab as DocumentTab)}
        filterGroups={filterGroups}
        onClearFilters={handleClearFilters}
        buttons={buttons}
        onRowClick={handleRowClick}
        emptyMessage="Документы не найдены"
        getRowKey={(doc) => doc.id}
        loadingComponent={<DocumentsTableSkeleton />}
      />
      
      <CreateDocumentDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </>
  );
};

