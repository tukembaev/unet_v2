import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Clock, CircleDot, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from 'shared/ui';
import { DocumentsTableSkeleton } from 'entities/documents';
import {
  GenericTabsContent,
  ColumnConfig,
  FilterGroup,
  TabConfig,
  ButtonConfig,
} from 'shared/components/data-table';
import { useOrders } from '../model/queries';
import { InboxOrder, OrderTab } from '../model/types';

const statusIcons: Record<string, React.ReactNode> = {
  'В режиме ожидания': <Clock className="h-3 w-3 text-yellow-500" />,
  'В работе': <CircleDot className="h-3 w-3" />,
  'Выполнено': <CheckCircle2 className="h-3 w-3 text-green-500" />,
  'Отклонено': <XCircle className="h-3 w-3 text-red-500" />,
};

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

export const OrdersContent = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<OrderTab>('incoming');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['all']);

  const { data, isLoading } = useOrders({
    tab: activeTab,
    statuses: selectedStatuses,
  });

  const columns: ColumnConfig<InboxOrder>[] = [
    {
      key: 'order_number',
      label: 'Номер оборота',
      width: '150px',
      minWidth: '150px',
      className: 'font-medium whitespace-nowrap',
      render: (order) => order.order_number || order.number,
    },
    {
      key: 'title',
      label: 'Тема приказа',
      minWidth: '250px',
      render: (order) => order.title,
    },
    {
      key: 'employee',
      label: 'Заявитель',
      width: '200px',
      minWidth: '200px',
      className: 'whitespace-nowrap',
      render: (order) => order.employee.surname_name,
    },
    {
      key: 'status',
      label: 'Статус',
      width: '180px',
      minWidth: '180px',
      render: (order) => (
        <Badge variant="outline" className="gap-1.5 whitespace-nowrap">
          {statusIcons[order.status]}
          {order.status}
        </Badge>
      ),
    },
    {
      key: 'date_zayavki',
      label: 'Дата подачи',
      width: '150px',
      minWidth: '150px',
      className: 'whitespace-nowrap',
      render: (order) => order.date_zayavki,
    },
  ];

  const filterGroups: FilterGroup[] = [
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
      onClick: () => console.log('Create order'),
      variant: 'default',
    },
  ];

  const handleClearFilters = () => {
    setSelectedStatuses(['all']);
  };

  const handleRowClick = (order: InboxOrder) => {
    navigate(`/documents/orders/${order.id}`);
  };

  return (
    <GenericTabsContent
      tabs={tabs}
      defaultTab="incoming"
      columns={columns}
      data={data?.orders}
      isLoading={isLoading}
      onTabChange={(tab) => setActiveTab(tab as OrderTab)}
      filterGroups={filterGroups}
      onClearFilters={handleClearFilters}
      buttons={buttons}
      onRowClick={handleRowClick}
      emptyMessage="Приказы не найдены"
      getRowKey={(order) => order.id}
      loadingComponent={<DocumentsTableSkeleton />}
    />
  );
};

