import type { ScheduleWeekType, ScheduleWeekday } from '../../../model/types';

export const WEEKDAY_OPTIONS: { value: ScheduleWeekday; label: string }[] = [
  { value: 'mon', label: 'Понедельник' },
  { value: 'tue', label: 'Вторник' },
  { value: 'wed', label: 'Среда' },
  { value: 'thu', label: 'Четверг' },
  { value: 'fri', label: 'Пятница' },
  { value: 'sat', label: 'Суббота' },
  { value: 'sun', label: 'Воскресенье' },
];

export const WEEK_TYPE_OPTIONS: { value: ScheduleWeekType; label: string }[] = [
  { value: 'weekly', label: 'Еженедельно' },
  { value: 'even', label: 'Чётная неделя' },
  { value: 'odd', label: 'Нечётная неделя' },
  { value: 'biweekly', label: 'Через неделю' },
];

export const TIME_SLOT_OPTIONS = [
  '10:00-11:20',
  '11:30-12:50',
  '13:00-14:20',
  '14:30-15:50',
  '16:00-17:20',
  '17:30-18:50',
  '19:30-20:50',
] as const;

export function getStreamTeacherId(stream: {
  teacher?: number | null;
  teacher_id?: number | null;
}): number | null {
  const id = stream.teacher ?? stream.teacher_id;
  return typeof id === 'number' && Number.isFinite(id) && id > 0 ? id : null;
}
