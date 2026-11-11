import { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Button, Card } from 'shared/ui';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'shared/ui/table';
import {
  useDeleteStream,
  useFlowsSchedules,
  useGenerateFlows,
} from '../model/queries';
import type { FlowInfo } from '../model/types';
import { FlowInfoModal } from 'features/flow/flowInfoModal';
import { Link, useLocation } from 'react-router-dom';
import { DataTableSkeleton } from 'shared/components/data-table';
import { ROUTES } from 'app/providers/routes';
import { ArrowLeft } from 'lucide-react';

const STREAMS_INFO_COLUMNS = [
  { key: 'index', label: '№', className: 'w-[60px] text-center', cellClassName: 'mx-auto w-6' },
  { key: 'number', label: 'Номер потока', cellClassName: 'w-20' },
  { key: 'subject', label: 'Предмет', cellClassName: 'w-[70%]' },
  { key: 'type', label: 'Тип', cellClassName: 'w-24' },
  { key: 'status', label: 'Статус', cellClassName: 'w-28' },
  { key: 'students', label: 'Студенты / макс.', cellClassName: 'w-24' },
  { key: 'teacher', label: 'Преподаватель', cellClassName: 'w-40' },
  { key: 'action', label: 'Действие', className: 'text-right', cellClassName: 'ml-auto w-8' },
];

export const StreamsInfo = () => {
  const [selectedFlow, setSelectedFlow] = useState<FlowInfo | null>(null);
  const subjectId = useLocation().state?.streamId as number | undefined;

  const { data: flowInfo, isLoading, isFetching } = useFlowsSchedules(
    subjectId ?? null
  );
  const generateFlows = useGenerateFlows(subjectId ?? null);
  const deleteFlow = useDeleteStream(subjectId ?? null);

  if (!subjectId) {
    return (
      <div className="space-y-4 p-4">
        <p className="text-sm text-muted-foreground">
          Предмет не выбран. Вернитесь к списку потоков.
        </p>
        <Button variant="outline" asChild>
          <Link to={ROUTES.STREAMS} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            К списку
          </Link>
        </Button>
      </div>
    );
  }

  const handleDelete = (item: FlowInfo) => {
    const label = item.number ? `поток №${item.number}` : 'этот поток';
    if (!window.confirm(`Удалить ${label}?`)) return;
    void deleteFlow.mutateAsync(item.id);
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <DataTableSkeleton columns={STREAMS_INFO_COLUMNS} rows={6} />
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link to={ROUTES.STREAMS} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            К списку
          </Link>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={generateFlows.isPending || isFetching}
          onClick={() => void generateFlows.mutateAsync()}
        >
          {generateFlows.isPending ? 'Генерация…' : 'Сгенерировать потоки'}
        </Button>
      </div>

      <Card className="overflow-hidden rounded-2xl shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px] text-center">№</TableHead>
              <TableHead>Номер потока</TableHead>
              <TableHead>Предмет</TableHead>
              <TableHead>Тип</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="text-center">Студенты / макс.</TableHead>
              <TableHead>Преподаватель</TableHead>
              <TableHead className="text-right">Действие</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {(flowInfo ?? []).length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-10 text-center text-muted-foreground"
                >
                  Потоки ещё не созданы
                </TableCell>
              </TableRow>
            ) : (
              flowInfo?.map((item, index) => (
                <TableRow
                  key={item.id}
                  className="transition-colors hover:bg-muted/40"
                >
                  <TableCell className="text-center font-medium">
                    {index + 1}
                  </TableCell>
                  <TableCell>{item.number}</TableCell>
                  <TableCell>{item.name_subject}</TableCell>
                  <TableCell>{item.stream_type}</TableCell>
                  <TableCell>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-xs font-medium transition-colors ${
                        item.status === 'Открыт'
                          ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400'
                          : item.status === 'В ожидании'
                            ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400'
                            : item.status === 'В диспетчерской'
                              ? 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400'
                              : 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400'
                      }`}
                    >
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-center tabular-nums">
                    {item.students_count ?? 0} / {item.capacity ?? '—'}
                  </TableCell>
                  <TableCell>{item.teacher_name || 'Не указан'}</TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => setSelectedFlow(item)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                        aria-label="Прикрепить преподавателя"
                        title="Прикрепить преподавателя"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        disabled={deleteFlow.isPending}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
                        aria-label="Удалить поток"
                        title="Удалить поток"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <FlowInfoModal
        open={selectedFlow != null}
        onOpenChange={(open) => {
          if (!open) setSelectedFlow(null);
        }}
        flow={selectedFlow}
        subjectId={subjectId}
      />
    </div>
  );
};
