import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, FileSpreadsheet, Filter, Loader2, Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import {
  exportInstitutesSyllabuses,
  type InstitutesSyllabusesParams,
} from "entities/education-management/model/api";
import {
  useDepartments,
  useFaculties,
  useReports,
} from "entities/education-management/model/queries";
import { EDUCATION_TAB_SEARCH_PARAM } from "entities/education-management/lib/use-education-tab-url";
import { ROUTES } from "app/providers/routes";
import { EmptyInfo } from "shared/components";
import { getHttpErrorMessage } from "shared/lib/http-error";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
} from "shared/ui";
import { toast } from "sonner";
import { FilterCombobox } from "../dispatcher/FilterCombobox";
import { ReportsTable } from "./ReportsTable";
import {
  SYLLABUS_STATUS_FILTER_OPTIONS,
  type SyllabusStatusFilter,
} from "./SyllabusStatusBadge";

const FILTER_KEYS = {
  institute: "institute_id",
  department: "department_id",
  status: "status",
} as const;

type DraftFilters = {
  instituteId: string | null;
  departmentId: string | null;
  status: SyllabusStatusFilter;
};

const INITIAL_DRAFT: DraftFilters = {
  instituteId: null,
  departmentId: null,
  status: "all",
};

function parseStatus(raw: string | null): SyllabusStatusFilter {
  if (
    raw === "all" ||
    raw === "under_review" ||
    raw === "revision" ||
    raw === "confirmed"
  ) {
    return raw;
  }
  return "all";
}

function filtersFromSearch(params: URLSearchParams): DraftFilters {
  return {
    instituteId: params.get(FILTER_KEYS.institute),
    departmentId: params.get(FILTER_KEYS.department),
    status: parseStatus(params.get(FILTER_KEYS.status)),
  };
}

function toParams(filters: DraftFilters): InstitutesSyllabusesParams {
  const institute_id = filters.instituteId
    ? Number(filters.instituteId)
    : null;
  const department_id = filters.departmentId
    ? Number(filters.departmentId)
    : null;
  return {
    institute_id:
      institute_id != null && Number.isFinite(institute_id) ? institute_id : null,
    department_id:
      department_id != null && Number.isFinite(department_id)
        ? department_id
        : null,
    status: filters.status,
  };
}

function writeFiltersToSearch(
  prev: URLSearchParams,
  filters: DraftFilters
): URLSearchParams {
  const next = new URLSearchParams(prev);
  next.set(EDUCATION_TAB_SEARCH_PARAM, "reports");

  if (filters.instituteId) next.set(FILTER_KEYS.institute, filters.instituteId);
  else next.delete(FILTER_KEYS.institute);

  if (filters.departmentId) {
    next.set(FILTER_KEYS.department, filters.departmentId);
  } else {
    next.delete(FILTER_KEYS.department);
  }

  if (filters.status && filters.status !== "all") {
    next.set(FILTER_KEYS.status, filters.status);
  } else {
    next.delete(FILTER_KEYS.status);
  }

  next.delete("years");

  return next;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export const ReportsTab = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlFilters = useMemo(
    () => filtersFromSearch(searchParams),
    [searchParams]
  );

  const [draft, setDraft] = useState<DraftFilters>(urlFilters);
  const [exporting, setExporting] = useState(false);

  // Если URL изменился снаружи (назад с РУП) — подтянуть селекты.
  useEffect(() => {
    setDraft(urlFilters);
  }, [urlFilters]);

  const applied = useMemo(() => toParams(urlFilters), [urlFilters]);

  const { data: faculties = [], isLoading: facultiesLoading } = useFaculties();
  const instituteIdNum = draft.instituteId ? Number(draft.instituteId) : null;
  const { data: departments = [], isFetching: departmentsLoading } =
    useDepartments(
      instituteIdNum != null && Number.isFinite(instituteIdNum)
        ? instituteIdNum
        : null
    );

  const {
    data: reports,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useReports(applied);

  const facultyOptions = useMemo(
    () => faculties.map((item) => ({ value: item.value, label: item.label })),
    [faculties]
  );

  const departmentOptions = useMemo(
    () => departments.map((item) => ({ value: item.value, label: item.label })),
    [departments]
  );

  const totalSyllabuses = useMemo(
    () =>
      (reports ?? []).reduce(
        (sum, institute) => sum + (institute.syllabuses?.length ?? 0),
        0
      ),
    [reports]
  );

  const persistFilters = useCallback(
    (filters: DraftFilters) => {
      setSearchParams((prev) => writeFiltersToSearch(prev, filters), {
        replace: true,
      });
    },
    [setSearchParams]
  );

  const returnToReports = useMemo(() => {
    const params = writeFiltersToSearch(
      new URLSearchParams(searchParams),
      draft
    );
    const query = params.toString();
    return query
      ? `${ROUTES.EDUCATION_MANAGEMENT}?${query}`
      : ROUTES.EDUCATION_MANAGEMENT;
  }, [draft, searchParams]);

  const applyFilters = () => {
    persistFilters(draft);
  };

  const resetFilters = () => {
    setDraft(INITIAL_DRAFT);
    persistFilters(INITIAL_DRAFT);
  };

  const openSyllabusPrepare = useCallback(() => {
    persistFilters(draft);
  }, [draft, persistFilters]);

  const handleExport = async () => {
    try {
      setExporting(true);
      const blob = await exportInstitutesSyllabuses(applied);
      downloadBlob(blob, "syllabuses_report.xlsx");
      toast.success("Excel-отчёт скачан");
    } catch (err) {
      toast.error("Не удалось скачать Excel", {
        description: getHttpErrorMessage(err, "Попробуйте ещё раз."),
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border-border/80 shadow-sm">
        <CardHeader className="space-y-1 border-b bg-muted/20 pb-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-xl">
                <FileSpreadsheet className="h-5 w-5 text-primary" aria-hidden />
                Отчётность по РУП
              </CardTitle>
              <CardDescription>
                Фильтруйте учебные планы по институту, кафедре и статусу
                проверки
              </CardDescription>
            </div>
            {!isLoading && reports ? (
              <div className="rounded-xl border bg-background px-3 py-2 text-right shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  В выборке
                </p>
                <p className="text-lg font-bold tabular-nums leading-tight">
                  {totalSyllabuses}
                  <span className="ml-1 text-sm font-medium text-muted-foreground">
                    РУП
                  </span>
                </p>
              </div>
            ) : null}
          </div>
        </CardHeader>

        <CardContent className="space-y-5 pt-5">
          <div className="rounded-2xl border bg-gradient-to-b from-muted/40 to-background p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Filter className="h-4 w-4 text-muted-foreground" aria-hidden />
              Фильтры
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">
                  Институт
                </Label>
                <FilterCombobox
                  options={facultyOptions}
                  value={draft.instituteId}
                  onChange={(value) =>
                    setDraft((prev) => ({
                      ...prev,
                      instituteId: value,
                      departmentId: null,
                    }))
                  }
                  placeholder={
                    facultiesLoading ? "Загрузка…" : "Все институты"
                  }
                  searchPlaceholder="Поиск института…"
                  disabled={facultiesLoading}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">
                  Кафедра
                </Label>
                <FilterCombobox
                  options={departmentOptions}
                  value={draft.departmentId}
                  onChange={(value) =>
                    setDraft((prev) => ({ ...prev, departmentId: value }))
                  }
                  placeholder={
                    !draft.instituteId
                      ? "Сначала институт"
                      : departmentsLoading
                        ? "Загрузка…"
                        : "Все кафедры"
                  }
                  searchPlaceholder="Поиск кафедры…"
                  disabled={!draft.instituteId || departmentsLoading}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">
                  Статус
                </Label>
                <Select
                  value={draft.status}
                  onValueChange={(value) =>
                    setDraft((prev) => ({
                      ...prev,
                      status: value as SyllabusStatusFilter,
                    }))
                  }
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Все статусы" />
                  </SelectTrigger>
                  <SelectContent>
                    {SYLLABUS_STATUS_FILTER_OPTIONS.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                type="button"
                onClick={applyFilters}
                disabled={isFetching}
                className="gap-2"
              >
                {isFetching ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <Search className="h-4 w-4" aria-hidden />
                )}
                Показать
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => void handleExport()}
                disabled={exporting || isLoading}
                className="gap-2"
              >
                {exporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <Download className="h-4 w-4" aria-hidden />
                )}
                Экспорт в Excel
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={resetFilters}
                disabled={isFetching}
              >
                Сбросить
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => void refetch()}
                disabled={isFetching}
              >
                Обновить
              </Button>
            </div>
          </div>

          {error ? (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {getHttpErrorMessage(error, "Ошибка загрузки отчёта по РУП")}
            </div>
          ) : null}

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="mx-auto h-8 w-64" />
              <div className="space-y-2 rounded-md border p-4">
                {Array.from({ length: 5 }).map((_, row) => (
                  <Skeleton key={row} className="h-9 w-full" />
                ))}
              </div>
            </div>
          ) : reports && reports.length > 0 ? (
            <ReportsTable
              data={reports}
              returnTo={returnToReports}
              onBeforeOpen={openSyllabusPrepare}
            />
          ) : (
            <EmptyInfo withCard={false} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
