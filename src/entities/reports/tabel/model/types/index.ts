export type StructureUnitType = {
  /** Код для `unit_type` в organizations/select, например DEPARTMENT */
  value: string;
  label: string;
};

export type TabelDivisionOption = {
  /** UUID структуры */
  value: string;
  label: string;
};

export type TabelDayCell = {
  day?: number;
  date_day?: string;
  day_of_week?: string;
  working_time?: string | number | null;
  /** Готовый текст ячейки с бэкенда. */
  display?: string | null;
  short_code?: string | null;
  absence_id?: number | null;
  absence_type_id?: number | null;
  status_info?: string;
  auditorium?: string;
};

export type TabelEmployeeSummary = {
  working_days: string | number | null;
  working_hours: string | number | null;
  start_date: string | null;
  end_date: string | null;
};

export type TabelEmployeeRow = {
  employee_id?: number;
  employee_name: string;
  subdivision: string;
  position_name: string;
  rate: string | number | null;
  division_name?: string;
  days: TabelDayCell[];
  summary: TabelEmployeeSummary;
};

export type AbsenceType = {
  id: number;
  title: string;
  short_code: string;
  is_active: boolean;
};

export type EmployeeAbsence = {
  id: number;
  employee: number;
  employee_name: string;
  absence_type: number;
  absence_type_title: string;
  short_code: string;
  /** YYYY-MM-DD для полей формы. */
  date_from: string;
  date_to: string;
  comment: string;
};

export type AbsenceWritePayload = {
  employee: number;
  absence_type: number;
  date_from: string;
  date_to: string;
  comment: string;
};

export type TabelCellTarget = {
  employeeId: number;
  employeeName: string;
  mode: 'create' | 'edit' | 'view';
  cell: TabelDayCell;
};

export type TabelReportParams = {
  /** UUID структуры */
  divisionId: string;
  month: number;
  year: number;
};

export const MONTH_OPTIONS = [
  { value: 1, label: 'Январь' },
  { value: 2, label: 'Февраль' },
  { value: 3, label: 'Март' },
  { value: 4, label: 'Апрель' },
  { value: 5, label: 'Май' },
  { value: 6, label: 'Июнь' },
  { value: 7, label: 'Июль' },
  { value: 8, label: 'Август' },
  { value: 9, label: 'Сентябрь' },
  { value: 10, label: 'Октябрь' },
  { value: 11, label: 'Ноябрь' },
  { value: 12, label: 'Декабрь' },
] as const;

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function isDayOff(value: string | number | null | undefined): boolean {
  return String(value ?? '') === 'Выходной';
}

export function isNoMark(value: string | number | null | undefined): boolean {
  return String(value ?? '') === 'Нет отметки';
}

export function formatWorkingTime(
  value: string | number | null | undefined
): string {
  if (value == null || value === '') return '—';
  return String(value);
}

/** Короткая подпись ячейки дня — полная строка остаётся в title. */
export function compactDayLabel(
  value: string | number | null | undefined
): string {
  if (isDayOff(value)) return 'В';
  if (isNoMark(value)) return '—';
  if (String(value ?? '') === 'День не наступил') return '·';
  const text = formatWorkingTime(value);
  const time = text.match(/^(\d{2}:\d{2}):\d{2}$/);
  if (time) return time[1];
  return text;
}

export function cellDisplayText(cell: TabelDayCell | undefined): string {
  if (!cell) return '—';
  if (cell.display != null && cell.display !== '') return cell.display;
  return formatWorkingTime(cell.working_time);
}

/** DD.MM.YYYY или YYYY-MM-DD → YYYY-MM-DD. */
export function toIsoDate(value: string | null | undefined): string {
  const raw = String(value ?? '').trim();
  const dmy = raw.match(/^(\d{2})\.(\d{2})\.(\d{4})/);
  if (dmy) return `${dmy[3]}-${dmy[2]}-${dmy[1]}`;
  const iso = raw.match(/^(\d{4}-\d{2}-\d{2})/);
  return iso ? iso[1] : '';
}

export function cellAction(cell: TabelDayCell | undefined): TabelCellTarget['mode'] | null {
  if (!cell) return null;
  if (cell.absence_id != null) return 'edit';
  const display = cellDisplayText(cell);
  if (display === 'День не наступил') return 'view';
  if (display === 'Нет отметки' || display === 'Выходной') return 'create';
  if (cell.working_time) return 'view';
  return 'create';
}
