import { useState } from 'react';
import { toast } from 'sonner';
import { CalendarDays, FilterX, RefreshCcw } from 'lucide-react';
import { getHttpErrorMessage } from 'shared/lib';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Empty,
  EmptyDescription,
  EmptyTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'shared/ui';
import {
  useStructureUnitTypes,
  useTabelOrganizations,
  useTabelReport,
} from '../model/queries';
import { MONTH_OPTIONS, type TabelCellTarget } from '../model/types';
import { AbsenceDialog } from './AbsenceDialog';
import { AttendanceMatrix } from './AttendanceMatrix';
import { DivisionCombobox } from './DivisionCombobox';

function buildYearOptions(currentYear: number): number[] {
  return [currentYear - 1, currentYear, currentYear + 1];
}

export function TabelReport() {
  const now = new Date();
  const [unitType, setUnitType] = useState<string>('');
  const [divisionId, setDivisionId] = useState<string | null>(null);
  const [month, setMonth] = useState(String(now.getMonth() + 1));
  const [year, setYear] = useState(String(now.getFullYear()));
  const [cellTarget, setCellTarget] = useState<TabelCellTarget | null>(null);

  const unitTypesQuery = useStructureUnitTypes();
  const organizationsQuery = useTabelOrganizations(unitType || null);
  const reportParams =
    divisionId != null
      ? {
          divisionId,
          month: Number(month),
          year: Number(year),
        }
      : null;
  const reportQuery = useTabelReport(reportParams);

  const selectedDivision = (organizationsQuery.data ?? []).find(
    (d) => d.value === divisionId
  );
  const title =
    reportQuery.data?.[0]?.division_name ||
    selectedDivision?.label ||
    'Табель';

  const reset = () => {
    setUnitType('');
    setDivisionId(null);
    setMonth(String(now.getMonth() + 1));
    setYear(String(now.getFullYear()));
  };

  const refresh = () => {
    void Promise.all([
      unitTypesQuery.refetch(),
      unitType ? organizationsQuery.refetch() : Promise.resolve(),
      reportParams ? reportQuery.refetch() : Promise.resolve(),
    ]);
  };

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border-border/70 shadow-sm">
        <CardHeader className="flex flex-col gap-4 border-b bg-muted/30 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl">Табель</CardTitle>
            <p className="text-sm text-muted-foreground">
              Матричный отчёт по отработанному времени подразделения. Отметки
              сотрудники делают в мобильном приложении.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {divisionId != null ? (
              <Badge variant="secondary" className="h-8 px-3">
                Сотрудников: {reportQuery.data?.length ?? 0}
              </Badge>
            ) : null}
            <Button
              variant="outline"
              onClick={refresh}
              disabled={
                unitTypesQuery.isFetching ||
                organizationsQuery.isFetching ||
                reportQuery.isFetching
              }
            >
              <RefreshCcw
                className={`mr-2 h-4 w-4 ${
                  unitTypesQuery.isFetching ||
                  organizationsQuery.isFetching ||
                  reportQuery.isFetching
                    ? 'animate-spin'
                    : ''
                }`}
              />
              Обновить
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-12">
            <Select
              value={unitType || undefined}
              onValueChange={(value) => {
                setUnitType(value);
                setDivisionId(null);
              }}
              disabled={unitTypesQuery.isLoading}
            >
              <SelectTrigger className="lg:col-span-3">
                <SelectValue placeholder="Тип структуры" />
              </SelectTrigger>
              <SelectContent>
                {(unitTypesQuery.data ?? []).map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <DivisionCombobox
              className="lg:col-span-5"
              options={organizationsQuery.data ?? []}
              value={divisionId}
              onChange={setDivisionId}
              disabled={!unitType || organizationsQuery.isLoading}
              placeholder={
                unitType ? 'Выберите структуру' : 'Сначала выберите тип'
              }
            />

            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="lg:col-span-2">
                <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Месяц" />
              </SelectTrigger>
              <SelectContent>
                {MONTH_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={String(option.value)}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="lg:col-span-2">
                <SelectValue placeholder="Год" />
              </SelectTrigger>
              <SelectContent>
                {buildYearOptions(now.getFullYear()).map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">
              {divisionId == null
                ? 'Выберите тип и структуру, чтобы открыть матрицу'
                : `${title} · ${MONTH_OPTIONS.find((m) => m.value === Number(month))?.label} ${year}`}
            </p>
            <Button variant="ghost" onClick={reset}>
              <FilterX className="mr-2 h-4 w-4" />
              Сбросить
            </Button>
          </div>

          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-flex h-4 w-4 items-center justify-center rounded bg-amber-100 text-[10px] ring-1 ring-amber-200 dark:bg-amber-950">
                В
              </span>
              Выходной
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-flex h-4 w-4 items-center justify-center rounded bg-rose-100 text-[10px] ring-1 ring-rose-200 dark:bg-rose-950">
                —
              </span>
              Нет отметки
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-flex h-4 w-4 items-center justify-center rounded bg-sky-100 text-[10px] ring-1 ring-sky-200 dark:bg-sky-950">
                Б
              </span>
              Пропуск
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-background ring-1 ring-border" />
              Отработанные часы
            </span>
          </div>

          {unitTypesQuery.isError || organizationsQuery.isError ? (
            <Empty className="border border-dashed py-10">
              <EmptyTitle>Не удалось загрузить структуры</EmptyTitle>
              <EmptyDescription>
                {getHttpErrorMessage(
                  unitTypesQuery.error ?? organizationsQuery.error,
                  'Проверьте доступ к API структур'
                )}
              </EmptyDescription>
            </Empty>
          ) : null}

          {divisionId == null ? (
            <Empty className="border border-dashed py-10">
              <EmptyTitle>Структура не выбрана</EmptyTitle>
              <EmptyDescription>
                Выберите тип структуры и саму структуру — откроется табель за
                месяц.
              </EmptyDescription>
            </Empty>
          ) : reportQuery.isError ? (
            <Empty className="border border-dashed py-10">
              <EmptyTitle>Не удалось загрузить табель</EmptyTitle>
              <EmptyDescription>
                {getHttpErrorMessage(
                  reportQuery.error,
                  'Проверьте доступ к API report-tabel/'
                )}
              </EmptyDescription>
            </Empty>
          ) : (
            <AttendanceMatrix
              data={reportQuery.data ?? []}
              year={Number(year)}
              month={Number(month)}
              isLoading={reportQuery.isLoading}
              onCellClick={(target) => {
                if (!target.employeeId) {
                  toast.error('У сотрудника нет идентификатора для пропуска');
                  return;
                }
                setCellTarget(target);
              }}
            />
          )}
          <AbsenceDialog target={cellTarget} onClose={() => setCellTarget(null)} />
        </CardContent>
      </Card>
    </div>
  );
}
