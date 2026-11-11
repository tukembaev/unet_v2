import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useStudentSubjectsQuery } from '../model/queries';
import { StudentSubjectCard } from './StudentSubjectCard';
import { StreamSelectionDialog } from './StreamSelectionDialog';
import { getHttpErrorMessage } from 'shared/lib/http-error';
import { Skeleton } from 'shared/ui';

export function StudentRegistrationContent() {
  const { data = [], isLoading, isError, error, isSuccess } =
    useStudentSubjectsQuery();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const clearSelectedTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (clearSelectedTimer.current != null) {
        window.clearTimeout(clearSelectedTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isError) {
      toast.error('Не удалось загрузить дисциплины', {
        description: getHttpErrorMessage(error),
      });
    }
  }, [isError, error]);

  useEffect(() => {
    if (isSuccess && data.length === 0) {
      toast.message('Нет доступных дисциплин для регистрации');
    }
  }, [isSuccess, data.length]);

  const openStreams = (subject: { id: number; name_subject: string }) => {
    if (clearSelectedTimer.current != null) {
      window.clearTimeout(clearSelectedTimer.current);
      clearSelectedTimer.current = null;
    }
    setSelected({ id: subject.id, name: subject.name_subject });
    setDialogOpen(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      // Не сбрасываем subjectId сразу — иначе Select/Dialog
      // размонтируются с ошибкой и errorElement показывает 404.
      if (clearSelectedTimer.current != null) {
        window.clearTimeout(clearSelectedTimer.current);
      }
      clearSelectedTimer.current = window.setTimeout(() => {
        setSelected(null);
        clearSelectedTimer.current = null;
      }, 200);
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div>
        <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
          Регистрация на дисциплины
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
          Выберите дисциплину и потоки для записи
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      ) : !data.length ? (
        <div className="rounded-2xl border border-dashed border-border/70 py-12 text-center text-sm text-muted-foreground">
          Нет доступных дисциплин
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {data.map((subject) => (
            <StudentSubjectCard
              key={subject.id}
              subject={subject}
              onSelectStreams={() => openStreams(subject)}
            />
          ))}
        </div>
      )}

      <StreamSelectionDialog
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
        subjectId={selected?.id ?? null}
        subjectName={selected?.name ?? ''}
      />
    </div>
  );
}
