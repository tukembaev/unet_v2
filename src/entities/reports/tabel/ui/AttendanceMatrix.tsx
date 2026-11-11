import { cn } from 'shared/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from 'shared/ui';
import {
  cellAction,
  cellDisplayText,
  compactDayLabel,
  daysInMonth,
  type TabelCellTarget,
  type TabelDayCell,
  type TabelEmployeeRow,
} from '../model/types';
import { AttendanceMatrixSkeleton } from './AttendanceMatrixSkeleton';

type AttendanceMatrixProps = {
  data: TabelEmployeeRow[];
  year: number;
  month: number;
  isLoading?: boolean;
  onCellClick?: (target: TabelCellTarget) => void;
};

function dayCellClass(cell: TabelDayCell | undefined): string {
  const display = cellDisplayText(cell);
  if (cell?.absence_id != null) {
    return 'bg-sky-50 text-sky-900 dark:bg-sky-950/40 dark:text-sky-100';
  }
  if (display === 'Выходной') {
    return 'bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-100';
  }
  if (display === 'Нет отметки') {
    return 'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-100';
  }
  if (display === 'День не наступил') {
    return 'text-muted-foreground';
  }
  return '';
}

function parseDuration(value: string | number | null | undefined): number | null {
  const match = String(value ?? '').trim().match(/^(\d+):(\d{2})(?::(\d{2}))?$/);
  if (!match) return null;
  return (
    Number(match[1]) * 3600 +
    Number(match[2]) * 60 +
    Number(match[3] ?? 0)
  );
}

function formatDuration(totalSeconds: number, withSeconds = false): string {
  if (totalSeconds <= 0) return '—';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const base = `${hours}:${String(minutes).padStart(2, '0')}`;
  return withSeconds ? `${base}:${String(seconds).padStart(2, '0')}` : base;
}

function parseRate(value: string | number | null | undefined): number | null {
  if (value == null || value === '') return null;
  const rate = Number(String(value).replace(',', '.'));
  return Number.isFinite(rate) ? rate : null;
}

function formatRate(value: number): string {
  return value.toFixed(2).replace(/\.?0+$/, '');
}

function cellSeconds(cell: TabelDayCell | undefined): number {
  return (
    parseDuration(cell?.working_time) ??
    parseDuration(cell?.display) ??
    0
  );
}

function resolveDayCell(
  days: TabelDayCell[],
  dayNumber: number
): TabelDayCell | undefined {
  return (
    days.find((d) => d.day === dayNumber) ??
    days[dayNumber - 1]
  );
}

export function AttendanceMatrix({
  data,
  year,
  month,
  isLoading,
  onCellClick,
}: AttendanceMatrixProps) {
  const dayCount = daysInMonth(year, month);
  const dayNumbers = Array.from({ length: dayCount }, (_, i) => i + 1);
  const totalRate = data.reduce((sum, row) => sum + (parseRate(row.rate) ?? 0), 0);
  const totalHours = data.reduce(
    (sum, row) => sum + (parseDuration(row.summary.working_hours) ?? 0),
    0
  );
  const weekdayCount = data.reduce<number | null>((found, row) => {
    if (found != null) return found;
    const days = Number(row.summary.working_days);
    return Number.isFinite(days) ? days : null;
  }, null);
  const dayTotals = dayNumbers.map((day) =>
    data.reduce((sum, row) => sum + cellSeconds(resolveDayCell(row.days, day)), 0)
  );

  if (isLoading) {
    return <AttendanceMatrixSkeleton year={year} month={month} />;
  }

  if (data.length === 0) {
    return (
      <p className="rounded-md border border-dashed py-10 text-center text-sm text-muted-foreground">
        Нет данных за выбранный месяц
      </p>
    );
  }

  return (
    <div className="rounded-md border">
      <Table className="w-max text-xs">
        <TableHeader>
          <TableRow>
            <TableHead className="sticky left-0 z-20 w-9 bg-background px-2">
              №
            </TableHead>
            <TableHead className="sticky left-9 z-20 w-40 bg-background px-2">
              Сотрудник
            </TableHead>
            <TableHead className="w-40 px-2">Должность</TableHead>
            <TableHead className="w-14 px-1 text-center">Ставка</TableHead>
            <TableHead className="w-12 px-1 text-center">Дней</TableHead>
            <TableHead className="w-16 px-1 text-center">Часов</TableHead>
            {dayNumbers.map((day) => (
              <TableHead
                key={day}
                className="w-8 px-0 text-center text-[11px]"
              >
                {day}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={`${row.employee_name}-${index}`}>
              <TableCell className="sticky left-0 z-10 w-9 bg-background px-2">
                {index + 1}
              </TableCell>
              <TableCell className="sticky left-9 z-10 w-40 max-w-40 bg-background px-2 font-medium">
                <span className="line-clamp-2" title={row.employee_name}>
                  {row.employee_name}
                </span>
              </TableCell>
              <TableCell className="w-40 max-w-40 px-2">
                <span className="line-clamp-2" title={row.position_name}>
                  {row.position_name || '—'}
                </span>
              </TableCell>
              <TableCell className="px-1 text-center">{row.rate ?? '—'}</TableCell>
              <TableCell className="px-1 text-center">
                {row.summary.working_days ?? '—'}
              </TableCell>
              <TableCell className="px-1 text-center whitespace-nowrap">
                {row.summary.working_hours ?? '—'}
              </TableCell>
              {dayNumbers.map((day) => {
                const cell = resolveDayCell(row.days, day);
                const full = cellDisplayText(cell);
                const mode = cellAction(cell);
                const clickable = Boolean(onCellClick && mode && row.employee_id);
                return (
                  <TableCell
                    key={day}
                    className={cn(
                      'w-8 px-0 text-center text-[11px]',
                      dayCellClass(cell)
                    )}
                    title={
                      cell?.date_day
                        ? `${cell.date_day}${cell.day_of_week ? `, ${cell.day_of_week}` : ''}: ${full}`
                        : full
                    }
                  >
                    {clickable && cell && mode ? (
                      <button
                        type="button"
                        className="h-full w-full rounded-sm px-0.5 hover:ring-1 hover:ring-ring"
                        onClick={() =>
                          onCellClick?.({
                            employeeId: row.employee_id!,
                            employeeName: row.employee_name,
                            mode,
                            cell,
                          })
                        }
                      >
                        {compactDayLabel(full)}
                      </button>
                    ) : (
                      compactDayLabel(full)
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow className="hover:bg-transparent">
            <TableCell className="sticky left-0 z-10 w-9 bg-muted px-2" />
            <TableCell
              className="sticky left-9 z-10 w-40 bg-muted px-2 font-semibold"
              title="Итого по отделу"
            >
              Итого
            </TableCell>
            <TableCell className="px-2 text-muted-foreground">
              {data.length} сотр.
            </TableCell>
            <TableCell className="px-1 text-center font-semibold">
              {formatRate(totalRate)}
            </TableCell>
            <TableCell
              className="px-1 text-center font-semibold"
              title="Будних дней в месяце"
            >
              {weekdayCount ?? '—'}
            </TableCell>
            <TableCell className="px-1 text-center font-semibold whitespace-nowrap">
              {formatDuration(totalHours, true)}
            </TableCell>
            {dayTotals.map((seconds, index) => (
              <TableCell
                key={dayNumbers[index]}
                className="w-8 px-0 text-center text-[11px] font-semibold"
                title={seconds > 0 ? formatDuration(seconds, true) : undefined}
              >
                {formatDuration(seconds)}
              </TableCell>
            ))}
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
