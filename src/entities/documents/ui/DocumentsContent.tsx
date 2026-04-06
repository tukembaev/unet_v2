import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Clock, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from 'shared/ui';
import { DocumentsTableSkeleton } from './DocumentsTableSkeleton';
import {
  GenericTabsContent,
  ColumnConfig,
  FilterGroup,
  TabConfig,
  ButtonConfig,
} from 'shared/components/data-table';
import { useApplicationDocuments } from '../model/queries';
import { Document, DocumentTab, DocumentType } from '../model/types';
import { CreateDocumentDialog } from 'features/create-document';
import { FormQuery, useFormNavigation } from 'shared/lib';

const statusConfig: Record<string, { icon: React.ReactNode; className: string }> = {
  'В режиме ожидания': {
    icon: <Clock className="h-3 w-3" />,
    className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  },
  'В процессе выполнения': {
    icon: <Loader2 className="h-3 w-3 animate-spin" />,
    className: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  'Завершено': {
    icon: <CheckCircle2 className="h-3 w-3" />,
    className: 'bg-green-100 text-green-800 border-green-300',
  },
  'Доработать': {
    icon: <XCircle className="h-3 w-3" />,
    className: 'bg-red-100 text-red-800 border-red-300',
  },

};

const typeLabels: Record<DocumentType, string> = {
  ORDER_STUD: 'Приказ (студент)',
  ORDER_EMPL: 'Приказ (сотрудник)',
  APPLICATION: 'Заявление',
  MAIL: 'Письмо',
  REPORT: 'Отчет',
};

const typeOptions = [
  { label: 'Все', value: 'all' },
  { label: 'Приказ (студент)', value: 'ORDER_STUD' },
  { label: 'Приказ (сотрудник)', value: 'ORDER_EMPL' },
  { label: 'Заявление', value: 'APPLICATION' },
  { label: 'Письмо', value: 'MAIL' },
  { label: 'Отчет', value: 'REPORT' },
];

const statusOptions = [
  { label: 'Все', value: 'all' },
  { label: 'В режиме ожидания', value: 'В режиме ожидания' },
  { label: 'В процессе выполнения', value: 'В процессе выполнения' },
  { label: 'Выполнено', value: 'Выполнено' },
  { label: 'Доработать', value: 'Доработать' },
];

const tabs: TabConfig[] = [
  { value: 'inbox', label: 'Входящие' },
  { value: 'outbox', label: 'Исходящие' },
  { value: 'history', label: 'История' },
];

export const DocumentsContent = () => {
  const navigate = useNavigate();
  const openForm = useFormNavigation();
  const [activeTab, setActiveTab] = useState<DocumentTab>('inbox');
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['all']);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['all']);

  const { data, isLoading } = useApplicationDocuments(activeTab);

  // Фильтрация данных на клиенте
  const filteredData = useMemo(() => {
    if (!data) return [];

    let documents = data;

    // Фильтр по типам
    if (selectedTypes.length > 0 && !selectedTypes.includes('all')) {
      documents = documents.filter((doc) => selectedTypes.includes(doc.type));
    }

    // Фильтр по статусам
    if (selectedStatuses.length > 0 && !selectedStatuses.includes('all')) {
      documents = documents.filter((doc) => doc.status && selectedStatuses.includes(doc.status));
    }

    return documents;
  }, [data, selectedTypes, selectedStatuses]);

  const columns: ColumnConfig<Document>[] = [
    {
      key: 'id',
      label: 'ID',
      width: '180px',
      minWidth: '180px',
      className: 'font-medium whitespace-nowrap',
      render: (doc) => doc.id,
    },
    {
      key: 'sender',
      label: 'Отправитель',
      width: '200px',
      minWidth: '200px',
      className: 'whitespace-nowrap',
      render: (doc) => doc.sender_full_name,
    },
    {
      key: 'type',
      label: 'Тип',
      width: '150px',
      minWidth: '150px',
      className: 'whitespace-nowrap',
      render: (doc) => typeLabels[doc.type] || doc.type,
    },
    {
      key: 'title',
      label: 'Тема',
      minWidth: '250px',
      render: (doc) => doc.title || '-',
    },
    {
      key: 'status',
      label: 'Статус',
      width: '180px',
      minWidth: '180px',
      render: (doc) => {
        const config = doc.status ? statusConfig[doc.status] : null;
        return (
          <Badge 
            variant="outline" 
            className={`gap-1.5 whitespace-nowrap ${config?.className || 'bg-gray-100 text-gray-800 border-gray-300'}`}
          >
            {config?.icon}
            {doc.status || 'Без статуса'}
          </Badge>
        );
      },
    },
    {
      key: 'created_at',
      label: 'Дата создания',
      width: '150px',
      minWidth: '150px',
      className: 'whitespace-nowrap',
      render: (doc) => new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(new Date(doc.created_at)),
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
      onClick: () => openForm(FormQuery.CREATE_DOCUMENT),
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
        defaultTab="inbox"
        columns={columns}
        data={filteredData}
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
      
      <CreateDocumentDialog />
    </>
  );
};

