import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Download, Search } from "lucide-react";

import { Button, Input } from "shared/ui";
import { cn } from "shared/lib/utils";
import { getHttpErrorMessage } from "shared/lib/http-error";
import { toast } from "sonner";
import { downloadAvgKpiDocx } from "../../../model/api";
import { useAvgKpiReport } from "../../../model/queries";
import { KpiEmployeeReportTable } from "../../KpiEmployeeReportTable";
import { KpiEmployeeTableSkeleton } from "../../KpiEmployeeTableSkeleton";

const PAGE_ASSUME = 20;

export const AVG_KPI_POSITION_OPTIONS = [
  { label: "Преподаватели", value: "Преподаватели" },
  { label: "Старшие преподаватели", value: "Старшие преподаватели" },
  { label: "Доценты", value: "Доценты" },
  { label: "Профессоры", value: "Профессоры" },
] as const;

export function AvgScoreTab() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState("");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const s = searchParams.get("search") ?? "";
    const pos = searchParams.get("position") ?? "";
    setSearch(s);
    if (AVG_KPI_POSITION_OPTIONS.some((o) => o.value === pos)) {
      setPosition(pos);
    } else {
      setPosition("");
    }
  }, [searchParams]);

  useEffect(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (search.trim()) next.set("search", search.trim());
        else next.delete("search");
        if (position) next.set("position", position);
        else next.delete("position");
        return next;
      },
      { replace: true }
    );
  }, [search, position, setSearchParams]);

  useEffect(() => {
    setPage(1);
  }, [search, position]);

  const { data, isLoading, isFetching, error } = useAvgKpiReport({
    page,
    search: search.trim() || undefined,
    position: position.trim() || undefined,
  });

  const rows = data?.items ?? [];
  const count = data?.count ?? 0;
  const avgScore = data?.avgScore ?? null;
  const errMsg = error ? getHttpErrorMessage(error) : undefined;
  const hasNext = rows.length >= PAGE_ASSUME;
  const queryEnabled = Boolean(position.trim());

  const onExportDocx = async () => {
    if (!position.trim()) {
      toast.error("Сначала выберите категорию");
      return;
    }
    try {
      setExporting(true);
      const blob = await downloadAvgKpiDocx({
        position: position.trim(),
        search: search.trim() || undefined,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `kpi-avg-employees-${Date.now()}.docx`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Файл скачан");
    } catch (e) {
      toast.error("Не удалось скачать отчёт", {
        description: getHttpErrorMessage(e),
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 rounded-xl border border-border/70 bg-muted/20 p-4">
        <div className="flex flex-wrap gap-2">
          {AVG_KPI_POSITION_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              type="button"
              size="sm"
              variant={position === opt.value ? "default" : "outline"}
              className={cn(
                "rounded-full",
                position === opt.value && "shadow-sm"
              )}
              onClick={() => setPosition(opt.value)}
            >
              {opt.label}
            </Button>
          ))}
        </div>

        <div className="flex max-w-xl items-center gap-2 rounded-lg border border-border/60 bg-background px-3">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
          <Input
            id="kpi-avg-search"
            className="border-0 bg-transparent shadow-none focus-visible:ring-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по имени сотрудника…"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            disabled={exporting || !position.trim()}
            onClick={() => void onExportDocx()}
          >
            <Download className="h-4 w-4" />
            Экспорт в Word
          </Button>
        </div>
      </div>

      {queryEnabled ? (
        <div
          className={cn(
            "rounded-lg border border-border/50 bg-muted/30 px-4 py-3 text-center text-sm text-foreground"
          )}
        >
          Все {position} выше среднего балла (средний балл:{" "}
          <span className="font-semibold tabular-nums">
            {avgScore != null ? avgScore : isLoading ? "…" : 0}
          </span>
          )
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
        <span>
          {queryEnabled ? (
            <>
              Записей: <span className="font-medium text-foreground">{count}</span>
              {isFetching ? " · обновление…" : null}
            </>
          ) : (
            "Выберите категорию должности"
          )}
        </span>
        {queryEnabled ? (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={page <= 1 || isLoading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              aria-label="Предыдущая страница"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="tabular-nums text-foreground">Стр. {page}</span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={!hasNext || isLoading}
              onClick={() => setPage((p) => p + 1)}
              aria-label="Следующая страница"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        ) : null}
      </div>

      {errMsg && (
        <p className="text-sm text-destructive" role="alert">
          {errMsg}
        </p>
      )}

      {!queryEnabled ? (
        <div className="rounded-xl border border-dashed border-border/70 bg-muted/10 px-6 py-12 text-center text-sm text-muted-foreground">
          Выберите категорию для отображения данных
        </div>
      ) : isLoading && rows.length === 0 ? (
        <KpiEmployeeTableSkeleton />
      ) : rows.length > 0 ? (
        <KpiEmployeeReportTable
          rows={rows}
          positionColumnTitle="Структура"
          totalScoreColumnTitle="Общий балл"
          detailNavigationState={{ tab: "avgScore" }}
        />
      ) : (
        <div className="rounded-xl border border-dashed border-border/70 bg-muted/10 px-6 py-12 text-center text-sm text-muted-foreground">
          Нет данных для категории «{position}»
        </div>
      )}
    </div>
  );
}
