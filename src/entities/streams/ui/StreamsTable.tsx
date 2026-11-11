import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'shared/ui';
import { DataTableSkeleton } from 'shared/components/data-table';
import type { FlowSubject } from '../model/types';

const STREAMS_TABLE_COLUMNS = [
  { key: 'index', label: '№', className: 'w-[60px] text-center', cellClassName: 'mx-auto w-6' },
  { key: 'code', label: 'Код предмета', cellClassName: 'w-24' },
  { key: 'name', label: 'Наименование дисциплины', cellClassName: 'w-[70%]' },
  { key: 'semester', label: 'Семестр', cellClassName: 'w-16' },
  { key: 'direction', label: 'Направление', cellClassName: 'w-[60%]' },
  { key: 'profile', label: 'Профиль', cellClassName: 'w-28' },
] as const;

interface Props {
  data?: FlowSubject[];
  isLoading?: boolean;
}

export const StreamsTable: FC<Props> = ({ data = [], isLoading }) => {
  const navigate = useNavigate();

  const onSelect = (id: number) => {
    navigate('/education/stream/', { state: { streamId: id } });
  };

  if (isLoading) {
    return (
      <DataTableSkeleton
        columns={[...STREAMS_TABLE_COLUMNS]}
        rows={8}
      />
    );
  }

  if (data.length === 0) {
    return (
      <Card className="flex h-40 items-center justify-center text-muted-foreground">
        Список предметов пуст
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden rounded-2xl shadow-sm">
      <Table>
        <TableCaption>Список предметов кафедры</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px] text-center">№</TableHead>
            <TableHead>Код предмета</TableHead>
            <TableHead>Наименование дисциплины</TableHead>
            <TableHead>Семестр</TableHead>
            <TableHead>Направление</TableHead>
            <TableHead>Профиль</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow
              key={item.id}
              onClick={() => onSelect(item.id)}
              className="cursor-pointer transition-colors hover:bg-muted/40"
            >
              <TableCell className="text-center">{index + 1}</TableCell>
              <TableCell>{item.code || '—'}</TableCell>
              <TableCell className="font-medium">{item.name_subject}</TableCell>
              <TableCell>{item.semester}</TableCell>
              <TableCell>{item.direction}</TableCell>
              <TableCell>
                {item.profile_name ? item.profile_name : 'Не указан'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
