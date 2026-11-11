import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Layers, Pencil, Trash2, Users } from 'lucide-react';
import { ROUTES, getRoute } from 'app/providers/routes';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Skeleton,
} from 'shared/ui';
import { useDeleteSyllabus, useSyllabusList } from '../model';
import { DirectionItem } from '../model';
import { GenericFilter, FilterGroup } from 'shared/components/data-table';
import { FormQuery, getHttpErrorMessage, useFormNavigation } from 'shared/lib';
import {
  normalizeSyllabusStatus,
  SyllabusStatusBadge,
} from 'entities/education-management';
import { toast } from 'sonner';
import { SyllabusStudentsDialog } from './SyllabusStudentsDialog';

// Generate year options from 2020 to 2050
const generateYearOptions = () => {
  const options = [{ label: 'Все', value: 'all', icon: Layers }];
  for (let year = 2020; year <= 2050; year++) {
    options.push({ label: year.toString(), value: year.toString(), icon: Calendar });
  }
  return options;
};

const yearOptions = generateYearOptions();

interface CreatedByMeTabProps {
  searchQuery: string;
}

export const CreatedByMeTab = ({ searchQuery }: CreatedByMeTabProps) => {
  const { data: directions, isLoading } = useSyllabusList();
  const deleteSyllabus = useDeleteSyllabus();
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [syllabusToDelete, setSyllabusToDelete] = useState<DirectionItem | null>(
    null
  );
  const [studentsSyllabus, setStudentsSyllabus] =
    useState<DirectionItem | null>(null);
  const openForm = useFormNavigation();

  const filteredData = useMemo(() => {
    if (!directions) return [];

    let filtered = directions;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((item: DirectionItem) =>
        item.direction.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by selected year (show all records starting from selected year)
    if (selectedYear !== 'all') {
      const yearNum = parseInt(selectedYear, 10);
      filtered = filtered.filter((item: DirectionItem) => {
        if (!item.start_year) return false;
        const itemStartYear = parseInt(item.start_year, 10);
        return itemStartYear >= yearNum;
      });
    }

    return filtered;
  }, [directions, searchQuery, selectedYear]);

  const filterGroups: FilterGroup[] = [
    {
      id: 'year',
      label: 'Год (с ...)',
      options: yearOptions,
      selectedValues: selectedYear === 'all' ? ['all'] : [selectedYear],
      onChange: (values) => {
        setSelectedYear(values.includes('all') ? 'all' : values[0] || 'all');
      },
    },
  ];

  const handleClearFilters = () => {
    setSelectedYear('all');
  };

  const handleConfirmDelete = async () => {
    if (!syllabusToDelete) return;
    try {
      await deleteSyllabus.mutateAsync(syllabusToDelete.id);
      toast.success('РУП удалён', {
        description: syllabusToDelete.direction,
      });
      setSyllabusToDelete(null);
    } catch (e) {
      toast.error('Не удалось удалить РУП', {
        description: getHttpErrorMessage(e),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="rounded-md border">
          <div className="p-4">
            <div className="grid grid-cols-5 gap-4 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-6" />
              ))}
            </div>
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-5 gap-4 mb-2">
                {Array.from({ length: 5 }).map((_, colIndex) => (
                  <Skeleton key={colIndex} className="h-8" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <GenericFilter filterGroups={filterGroups} onClearAll={handleClearFilters} />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="text-center font-bold">Направление</TableHead>
              <TableHead className="text-center font-bold">Количество Предметов</TableHead>
              <TableHead className="text-center font-bold">Количество семестров</TableHead>
              <TableHead className="text-center font-bold">Год</TableHead>
              <TableHead className="text-center font-bold">Форма обучения</TableHead>
              <TableHead className="text-center font-bold">
                Уровень образования
              </TableHead>
              <TableHead className="text-center font-bold min-w-[132px]">
                Статус
              </TableHead>
              <TableHead className="text-center font-bold">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  {searchQuery || selectedYear !== 'all'
                    ? 'По вашему запросу ничего не найдено'
                    : 'Нет данных для отображения'}
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item: DirectionItem) => (
                <TableRow key={item.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <Link
                      to={getRoute(ROUTES.CURRICULUM_DETAIL, {
                        syllabusId: String(item.id),
                      })}
                      className="text-primary hover:underline"
                    >
                      {item.direction}
                    </Link>
                  </TableCell>
                  <TableCell className="text-center">{item.subjects_count}</TableCell>
                  <TableCell className="text-center">{item.semester_count}</TableCell>
                  <TableCell className="text-center">
                    {item.start_year && item.end_year
                      ? `${item.start_year}-${item.end_year}`
                      : '-'}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.form_education?.trim() ? item.form_education : '—'}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.level_education?.trim() ? item.level_education : '—'}
                  </TableCell>
                  <TableCell className="text-center">
                    <SyllabusStatusBadge
                      status={normalizeSyllabusStatus(item.status, item.is_verified)}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="inline-flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setStudentsSyllabus(item)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-muted"
                        aria-label="Студенты РУП"
                        title="Студенты РУП"
                      >
                        <Users className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          openForm(FormQuery.EDIT_RUP, {
                            rupId: String(item.id),
                          })
                        }
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-muted"
                        aria-label="Редактировать РУП"
                        title="Редактировать РУП"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setSyllabusToDelete(item)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-destructive hover:bg-destructive/10"
                        aria-label="Удалить РУП"
                        title="Удалить РУП"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <SyllabusStudentsDialog
        open={studentsSyllabus != null}
        onOpenChange={(open) => {
          if (!open) setStudentsSyllabus(null);
        }}
        syllabusId={studentsSyllabus?.id ?? null}
        syllabusTitle={studentsSyllabus?.direction ?? ''}
      />

      <Dialog
        open={syllabusToDelete != null}
        onOpenChange={(open) => {
          if (!open && !deleteSyllabus.isPending) {
            setSyllabusToDelete(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить РУП?</DialogTitle>
            <DialogDescription>
              {syllabusToDelete ? (
                <>
                  Будет удалён учебный план «{syllabusToDelete.direction}»
                  {syllabusToDelete.start_year && syllabusToDelete.end_year
                    ? ` (${syllabusToDelete.start_year}–${syllabusToDelete.end_year})`
                    : ''}
                  . Это действие нельзя отменить.
                </>
              ) : null}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSyllabusToDelete(null)}
              disabled={deleteSyllabus.isPending}
            >
              Отмена
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => void handleConfirmDelete()}
              disabled={deleteSyllabus.isPending}
            >
              {deleteSyllabus.isPending ? 'Удаление...' : 'Удалить'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
