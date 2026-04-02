import { useState, useMemo } from 'react';
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
import { useApplicationDocuments } from '../model/queries';
import { Document, DocumentTab, DocumentType } from '../model/types';
import { CreateDocumentDialog } from 'features/create-document';
import { FormQuery, useFormNavigation } from 'shared/lib';

const statusIcons: Record<string, React.ReactNode> = {
  'В режиме ожидания': <Clock className="h-3 w-3 text-yellow-500" />,
  'В процессе выполнения': <CircleDot className="h-3 w-3" />,
  'Выполнено': <CheckCircle2 className="h-3 w-3 text-green-500" />,
  'Доработать': <XCircle className="h-3 w-3 text-red-500" />,
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
      render: (doc) => (
        <Badge variant="outline" className="gap-1.5 whitespace-nowrap">
          {doc.status && statusIcons[doc.status]}
          {doc.status || 'Без статуса'}
        </Badge>
      ),
    },
    {
      key: 'created_at',
      label: 'Дата создания',
      width: '150px',
      minWidth: '150px',
      className: 'whitespace-nowrap',
      render: (doc) => new Date(doc.created_at).toLocaleDateString('ru-RU'),
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

