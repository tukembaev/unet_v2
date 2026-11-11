import { BookOpen, ClipboardList, FlaskConical, Hammer, User } from 'lucide-react';
import type { StudentSubject } from '../model/types';
import { Badge, Button, Card, CardContent } from 'shared/ui';
import { cn } from 'shared/lib/utils';

type Props = {
  subject: StudentSubject;
  onSelectStreams: () => void;
};

function StreamLine({
  label,
  icon: Icon,
  number,
  teacher,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  number?: number | string | null;
  teacher?: string | null;
}) {
  if (number == null && !teacher) return null;
  return (
    <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span>{label}</span>
      {number != null && <span className="font-medium text-foreground">{number}</span>}
      {teacher ? (
        <>
          <span>·</span>
          <span className="inline-flex items-center gap-1">
            <User className="h-3 w-3" />
            {teacher}
          </span>
        </>
      ) : null}
    </div>
  );
}

export function StudentSubjectCard({ subject, onSelectStreams }: Props) {
  return (
    <Card
      className={cn(
        'rounded-2xl border-border/70 shadow-sm',
        !subject.active && 'opacity-70'
      )}
    >
      <CardContent className="space-y-3 p-3.5 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <BookOpen className="h-4 w-4 shrink-0 text-primary" />
              <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Дисциплина
              </span>
              <Badge
                variant="outline"
                className={cn(
                  'rounded-full px-2 py-0 text-[10px]',
                  subject.active
                    ? 'border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-400'
                    : 'text-muted-foreground'
                )}
              >
                {subject.active ? 'Активна' : 'Неактивна'}
              </Badge>
            </div>
            <p className="text-sm font-semibold leading-snug sm:text-[15px]">
              {subject.name_subject}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ClipboardList className="h-3.5 w-3.5" />
          Форма контроля:{' '}
          <span className="font-medium text-foreground">
            {subject.control_form || '—'}
          </span>
          {subject.credit != null ? (
            <span className="text-muted-foreground">
              · {subject.credit} кр.
            </span>
          ) : null}
        </div>

        <div className="space-y-1.5 border-t border-border/60 pt-2.5">
          <StreamLine
            label="Лекционный:"
            icon={BookOpen}
            number={subject.lecture?.number}
            teacher={subject.lecture?.teacher_name}
          />
          <StreamLine
            label="Практический:"
            icon={Hammer}
            number={subject.practice?.number}
            teacher={subject.practice?.teacher_name}
          />
          <StreamLine
            label="Лабораторный:"
            icon={FlaskConical}
            number={subject.lab?.number}
            teacher={subject.lab?.teacher_name}
          />
        </div>

        <Button
          type="button"
          size="sm"
          className="h-8 w-full rounded-xl text-xs sm:w-auto"
          disabled={!subject.active}
          onClick={onSelectStreams}
        >
          Выбрать поток
        </Button>
      </CardContent>
    </Card>
  );
}
