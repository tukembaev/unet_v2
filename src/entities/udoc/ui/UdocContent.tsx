import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from 'app/providers/routes';
import { FormQuery, useFormNavigation } from 'shared/lib';
import { GenericDataTable, type ColumnConfig } from 'shared/components/data-table';
import { Button } from 'shared/ui';
import { usePermissions } from 'entities/user';
import { ShareUdocDialog } from 'features/share-udoc';
import { useUdocList } from '../model/queries';
import type { UdocListItem } from '../model/types';
import { UdocTableSkeleton } from './UdocTableSkeleton';

export function UdocContent() {
  const navigate = useNavigate();
  const openForm = useFormNavigation();
  const { can } = usePermissions();
  const canShare = can('udoc');
  const { data, isLoading } = useUdocList();

  const columns: ColumnConfig<UdocListItem>[] = [
    {
      key: 'id',
      label: 'ID',
      width: '220px',
      minWidth: '180px',
      className: 'font-medium whitespace-nowrap',
      render: (item) => item.id,
    },
    {
      key: 'title',
      label: 'Тема',
      minWidth: '220px',
      render: (item) => item.title?.trim() || '—',
    },
    {
      key: 'description',
      label: 'Описание',
      minWidth: '280px',
      render: (item) => item.description?.trim() || '—',
    },
  ];

  return (
    <>
      <div className="space-y-4">
        {canShare ? (
          <div className="flex justify-end">
            <Button
              variant="default"
              className="w-full sm:w-auto"
              onClick={() => openForm(FormQuery.SHARE_UDOC)}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Загрузить приказ</span>
            </Button>
          </div>
        ) : null}

        {isLoading ? (
          <UdocTableSkeleton />
        ) : (
          <GenericDataTable
            data={data ?? []}
            columns={columns}
            onRowClick={(item) =>
              navigate(ROUTES.UDOC_DETAILS.replace(':id', item.id))
            }
            emptyMessage="Приказы не найдены"
            getRowKey={(item) => item.id}
          />
        )}
      </div>
      {canShare ? <ShareUdocDialog /> : null}
    </>
  );
}
