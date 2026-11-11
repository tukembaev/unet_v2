import { useEffect } from 'react';
import { toast } from 'sonner';
import { useEnrolledDisciplinesQuery } from '../model/queries';
import { getHttpErrorMessage } from 'shared/lib/http-error';
import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'shared/ui';

export function MyDisciplinesContent() {
  const { data, isLoading, isError, error, isSuccess } =
    useEnrolledDisciplinesQuery();

  const semesters = data ? Object.keys(data) : [];

  useEffect(() => {
    if (isError) {
      toast.error('Не удалось загрузить дисциплины', {
        description: getHttpErrorMessage(error),
      });
    }
  }, [isError, error]);

  useEffect(() => {
    if (isSuccess && semesters.length === 0) {
      toast.message('Список дисциплин пуст');
    }
  }, [isSuccess, semesters.length]);

  return (
    <div className="space-y-3 sm:space-y-4">
      <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
        Мои дисциплины
      </h1>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-8 w-40 rounded-xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      ) : !semesters.length ? (
        <div className="rounded-2xl border border-dashed border-border/70 py-12 text-center text-sm text-muted-foreground">
          Список дисциплин пуст
        </div>
      ) : (
        <div className="space-y-4">
          {semesters.map((semester) => (
            <div key={semester} className="space-y-2">
              <div className="inline-flex rounded-full bg-muted/60 px-3 py-1 text-xs font-medium">
                {semester} семестр
              </div>

              {/* Mobile cards */}
              <div className="grid gap-2 md:hidden">
                {(data?.[semester] ?? []).map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-border/70 bg-card p-3 text-sm shadow-sm"
                  >
                    <p className="font-medium leading-snug">{item.name_subject}</p>
                    <div className="mt-1.5 space-y-0.5 text-xs text-muted-foreground">
                      <p>Вид: {item.course_type || '—'}</p>
                      <p>Кредит: {item.credit ?? '—'}</p>
                      <p>Поток: {item.number ?? '—'}</p>
                      <p>Преподаватель: {item.lecturer || '—'}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop table */}
              <div className="hidden overflow-hidden rounded-2xl border border-border/70 md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead>Предмет</TableHead>
                      <TableHead>Вид</TableHead>
                      <TableHead>Кредит</TableHead>
                      <TableHead>Поток</TableHead>
                      <TableHead>Преподаватель</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(data?.[semester] ?? []).map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.name_subject}
                        </TableCell>
                        <TableCell>{item.course_type || '—'}</TableCell>
                        <TableCell>{item.credit ?? '—'}</TableCell>
                        <TableCell>{item.number ?? '—'}</TableCell>
                        <TableCell>{item.lecturer || '—'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
