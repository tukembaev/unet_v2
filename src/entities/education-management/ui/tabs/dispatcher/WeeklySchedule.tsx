import type { WeeklyScheduleMap, WeeklyScheduleSubject } from '../../../model/types';
import { cn } from 'shared/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, Skeleton } from 'shared/ui';
import { TIME_SLOT_OPTIONS, WEEKDAY_OPTIONS } from './constants';

type WeeklyScheduleProps = {
  title: string;
  data?: WeeklyScheduleMap;
  isLoading?: boolean;
  emptyHint?: string;
};

const DAY_ALIASES: Record<string, string> = {
  mon: 'Понедельник',
  tue: 'Вторник',
  wed: 'Среда',
  thu: 'Четверг',
  fri: 'Пятница',
  sat: 'Суббота',
  sun: 'Воскресенье',
  monday: 'Понедельник',
  tuesday: 'Вторник',
  wednesday: 'Среда',
  thursday: 'Четверг',
  friday: 'Пятница',
  saturday: 'Суббота',
  sunday: 'Воскресенье',
  понедельник: 'Понедельник',
  вторник: 'Вторник',
  среда: 'Среда',
  четверг: 'Четверг',
  пятница: 'Пятница',
  суббота: 'Суббота',
  воскресенье: 'Воскресенье',
};

function normalizeDay(raw: string): string {
  const key = raw.trim().toLowerCase();
  return DAY_ALIASES[key] ?? raw.trim();
}

function collectBusy(
  data?: WeeklyScheduleMap
): Map<string, Map<string, WeeklyScheduleSubject[]>> {
  const byDay = new Map<string, Map<string, WeeklyScheduleSubject[]>>();
  if (!data) return byDay;

  for (const [rawDay, slots] of Object.entries(data)) {
    const day = normalizeDay(rawDay);
    const byTime = byDay.get(day) ?? new Map<string, WeeklyScheduleSubject[]>();
    for (const slot of slots ?? []) {
      const subjects = (slot.subjects ?? []).filter((item) =>
        Boolean(item.subject?.trim())
      );
      if (!subjects.length) continue;
      const time = matchTimeSlot(slot.time || subjects[0]?.time || '');
      if (!time) continue;
      byTime.set(time, [...(byTime.get(time) ?? []), ...subjects]);
    }
    if (byTime.size) byDay.set(day, byTime);
  }

  return byDay;
}

function shortDay(label: string): string {
  return label.slice(0, 2);
}

function normalizeTime(raw: string): string {
  return raw.replace(/\s+/g, '').replace('—', '-').replace('–', '-');
}

function matchTimeSlot(raw: string): string {
  const normalized = normalizeTime(raw);
  const known = TIME_SLOT_OPTIONS.find(
    (slot) => normalizeTime(slot) === normalized
  );
  return known ?? raw.trim();
}

export function WeeklySchedule({
  title,
  data,
  isLoading,
  emptyHint = 'Выберите параметры, чтобы увидеть занятость',
}: WeeklyScheduleProps) {
  const busy = collectBusy(data);
  const hasBusy = busy.size > 0;
  const visibleDays = WEEKDAY_OPTIONS.filter(
    (day) => day.value !== 'sun' || busy.has(day.label)
  );

  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-0 border-b bg-muted/20 px-3 py-2.5">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-3">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : !hasBusy ? (
          <p className="px-1 py-4 text-center text-sm text-muted-foreground">
            {emptyHint}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-[11px]">
              <thead>
                <tr>
                  <th className="sticky left-0 z-10 w-24 bg-background px-1.5 py-1 text-left font-medium text-muted-foreground">
                    Время
                  </th>
                  {visibleDays.map((day) => (
                    <th
                      key={day.value}
                      className="px-1 py-1 text-center font-medium text-muted-foreground"
                      title={day.label}
                    >
                      <span className="hidden sm:inline">{day.label.slice(0, 3)}</span>
                      <span className="sm:hidden">{shortDay(day.label)}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TIME_SLOT_OPTIONS.map((time) => (
                  <tr key={time} className="border-t border-border/60">
                    <td className="sticky left-0 z-10 whitespace-nowrap bg-background px-1.5 py-1 font-medium tabular-nums text-muted-foreground">
                      {time}
                    </td>
                    {visibleDays.map((day) => {
                      const subjects = busy.get(day.label)?.get(time) ?? [];
                      const occupied = subjects.length > 0;
                      const tip = subjects
                        .map((item) =>
                          [item.subject, item.class_type, item.auditorium, item.teacher]
                            .filter(Boolean)
                            .join(' · ')
                        )
                        .join('\n');
                      return (
                        <td key={`${day.value}-${time}`} className="px-0.5 py-1 align-top">
                          <div
                            className={cn(
                              'min-h-8 rounded-md border px-1 py-0.5',
                              occupied
                                ? 'border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-50'
                                : 'border-transparent bg-muted/20'
                            )}
                            title={tip || undefined}
                          >
                            {occupied ? (
                              <div className="space-y-0.5">
                                {subjects.map((item, index) => (
                                  <p
                                    key={`${item.subject}-${index}`}
                                    className="line-clamp-2 leading-tight"
                                  >
                                    {item.subject}
                                  </p>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
