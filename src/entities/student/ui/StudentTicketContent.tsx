import { useEffect } from 'react';
import { toast } from 'sonner';
import { useStudentTicketQuery } from '../model/queries';
import { getHttpErrorMessage } from 'shared/lib/http-error';
import { Avatar, AvatarFallback, AvatarImage, Skeleton } from 'shared/ui';

export function StudentTicketContent() {
  const { data, isLoading, isError, error } = useStudentTicketQuery();

  useEffect(() => {
    if (isError) {
      toast.error('Не удалось загрузить студенческий билет', {
        description: getHttpErrorMessage(error),
      });
    }
  }, [isError, error]);

  const fullName = [data?.surname, data?.first_name, data?.last_name]
    .filter(Boolean)
    .join(' ');
  const course = data?.cource || data?.course || '—';

  if (isLoading) {
    return (
      <div className="mx-auto max-w-md space-y-3">
        <Skeleton className="h-6 w-48 rounded-xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-3">
        <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
          Студенческий билет
        </h1>
        <div className="rounded-2xl border border-dashed border-border/70 py-12 text-center text-sm text-muted-foreground">
          Данные билета недоступны
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
        Студенческий билет
      </h1>

      <div className="mx-auto max-w-md overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-b from-muted/40 to-background shadow-sm">
        <div className="flex items-center gap-3 border-b border-border/60 bg-primary/5 px-4 py-3">
          <Avatar className="h-16 w-16 rounded-xl border border-border/60">
            <AvatarImage src={data.photo || undefined} alt={fullName} />
            <AvatarFallback className="rounded-xl text-sm">
              {(data.first_name?.[0] ?? '') + (data.surname?.[0] ?? '')}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{fullName || '—'}</p>
            <p className="text-xs text-muted-foreground">
              {data.abbreviation_faculty || data.faculty || '—'}
            </p>
            {data.code_stud ? (
              <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                № {data.code_stud}
              </p>
            ) : null}
          </div>
        </div>

        <dl className="divide-y divide-border/60 text-sm">
          {[
            ['Факультет', data.faculty || '—'],
            ['Группа', data.group || '—'],
            ['Курс', course],
            ['Учебный год', data.year_study || '—'],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between gap-3 px-4 py-2.5"
            >
              <dt className="text-xs text-muted-foreground">{label}</dt>
              <dd className="text-right text-sm font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
