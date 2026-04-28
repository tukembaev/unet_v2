import { useCallback, useEffect, useState } from 'react';
import { GraduationCap, Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { getHttpErrorMessage } from 'shared/lib';
import {
  Badge,
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'shared/ui';
import type { DepartmentDisciplineRow } from '../model/types';
import { useDepartmentDisciplines } from '../model/queries';
import { DepartmentDisciplineDialog } from './DepartmentDisciplineDialog';
import { DepartmentDisciplinesTableSkeleton } from './DepartmentDisciplinesTableSkeleton';

const EMPTY_ROWS: DepartmentDisciplineRow[] = [];

function TagList({ items }: { items: string[] | null | undefined }) {
  if (!items?.length) {
    return <span className="text-muted-foreground">—</span>;
  }
  return (
    <div className="flex max-w-[280px] flex-wrap gap-1.5 sm:max-w-[320px]">
      {items.map((label, i) => (
        <Badge
          key={`${label}-${i}`}
          variant="secondary"
          className="h-auto max-w-full rounded-md border-0 px-2 py-1 font-sans font-normal normal-case"
        >
          <span className="break-words text-left leading-snug">{label}</span>
        </Badge>
      ))}
    </div>
  );
}

export function DepartmentDisciplinesContent() {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [editing, setEditing] = useState<DepartmentDisciplineRow | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(searchInput.trim()), 350);
    return () => window.clearTimeout(t);
  }, [searchInput]);

  const {
    data: rowsData,
    isPending,
    isFetching,
    isError,
    error,
    refetch,
  } = useDepartmentDisciplines(debouncedSearch);
  const rows = rowsData ?? EMPTY_ROWS;

  useEffect(() => {
    if (!isError || !error) return;
    toast.error(getHttpErrorMessage(error, 'Не удалось загрузить список дисциплин'), {
      id: 'department-disciplines-list',
    });
  }, [isError, error]);

  const openCreate = useCallback(() => {
    setEditing(null);
    setDialogMode('create');
    setDialogOpen(true);
  }, []);

  const openEdit = useCallback((row: DepartmentDisciplineRow) => {
    setEditing(row);
    setDialogMode('edit');
    setDialogOpen(true);
  }, []);

  const showSkeleton = isPending;
  const showRefetchOverlay = isFetching && !isPending;

  return (
    <>
      <div className="relative rounded-xl border border-border/60 bg-card/40 p-4 shadow-sm backdrop-blur-sm">
        {showRefetchOverlay ? (
          <div
            className="pointer-events-none absolute inset-0 z-10 rounded-xl bg-background/40 transition-opacity"
            aria-hidden
          />
        ) : null}

        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <GraduationCap className="h-5 w-5 text-primary" />
              Список дисциплин
            </div>
            
          <div className="relative w-full max-w-md lg:w-auto lg:flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск дисциплин..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9"
            />
          </div>
          </div>
          <Button type="button" onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Создать дисциплину
            </Button>
        </div>

        {showSkeleton ? (
          <DepartmentDisciplinesTableSkeleton />
        ) : isError ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-destructive/25 bg-destructive/5 px-4 py-12 text-center">
            <p className="text-sm text-destructive">
              {getHttpErrorMessage(error, 'Не удалось загрузить список дисциплин')}
            </p>
            <Button type="button" variant="outline" size="sm" onClick={() => void refetch()}>
              Повторить
            </Button>
          </div>
        ) : (
          <div className="w-full overflow-x-auto rounded-md border border-border bg-card">
            <Table className="min-w-[800px]">
              <TableHeader className="sticky top-0 z-10 bg-card shadow-[inset_0_-1px_0_0_hsl(var(--border))]">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-12 whitespace-nowrap">№</TableHead>
                  <TableHead className="min-w-[220px]">Наименование</TableHead>
                  <TableHead className="w-28 whitespace-nowrap">Кредиты</TableHead>
                  <TableHead className="w-40 whitespace-nowrap">Уровень</TableHead>
                  <TableHead className="min-w-[180px]">Пререквизиты</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      Список дисциплин пуст
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((item, index) => (
                    <TableRow
                      key={item.id}
                      role="button"
                      tabIndex={0}
                      className="cursor-pointer"
                      aria-label={`Редактировать: ${item.title}`}
                      onClick={() => openEdit(item)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          openEdit(item);
                        }
                      }}
                    >
                      <TableCell className="align-top text-muted-foreground tabular-nums">
                        {index + 1}
                      </TableCell>
                      <TableCell className="align-top">
                        <div className="max-w-[min(28rem,55vw)] font-medium leading-snug" title={item.title}>
                          {item.title}
                        </div>
                        {item.title_en ? (
                          <div className="mt-0.5 max-w-[min(28rem,55vw)] text-xs text-muted-foreground" title={item.title_en}>
                            {item.title_en}
                          </div>
                        ) : null}
                      </TableCell>
                      <TableCell className="align-top tabular-nums">
                        <span>{item.credit}</span>
                        {item.credit_part_time != null ? (
                          <span className="text-muted-foreground"> / {item.credit_part_time}</span>
                        ) : null}
                      </TableCell>
                      <TableCell className="align-top text-sm">{item.level_education_name ?? '—'}</TableCell>
                      <TableCell className="align-top">
                        <TagList items={item.prerequisites_names} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <DepartmentDisciplineDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        discipline={dialogMode === 'edit' ? editing : null}
      />
    </>
  );
}
