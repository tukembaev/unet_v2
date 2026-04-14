import { useState } from "react";
import { ChevronLeft, ChevronRight, Download, Search } from "lucide-react";

import { Button, Input } from "shared/ui";
import { getHttpErrorMessage } from "shared/lib/http-error";
import { toast } from "sonner";
import { downloadEmployeeReportDocx } from "entities/kpi-report/model/api";
import { useEmployeeReport } from "entities/kpi-report/model/queries";
import { KpiEmployeeReportTable } from "../../../KpiEmployeeReportTable";
import { KpiEmployeeTableSkeleton } from "../../../KpiEmployeeTableSkeleton";

const PAGE_ASSUME = 20;

type Props = {
  departmentId: number;
  departmentName: string;
  onBack: () => void;
};

export function DepartmentEmployeesSection({
  departmentId,
  departmentName,
  onBack,
}: Props) {
  const [page, setPage] = useState(1);
  const [searchDraft, setSearchDraft] = useState("");
  const [search, setSearch] = useState("");
  const [exporting, setExporting] = useState(false);

  const { data, isLoading, isFetching, error } = useEmployeeReport({
    page,
    search: search || undefined,
    department: String(departmentId),
  });

  const rows = data?.items ?? [];
  const count = data?.count ?? 0;
  const errMsg = error ? getHttpErrorMessage(error) : undefined;
  const hasNext = rows.length >= PAGE_ASSUME;

  const onExportDocx = async () => {
    try {
      setExporting(true);
      const blob = await downloadEmployeeReportDocx({
        departmentId,
        search: search.trim() || undefined,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `employee-report-dept-${departmentId}-${Date.now()}.docx`;
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mb-2 gap-2"
            onClick={onBack}
          >
            <ChevronLeft className="h-4 w-4" />
            К кафедрам
          </Button>
          <h3 className="truncate text-lg font-semibold text-foreground">
            {departmentName}
          </h3>
          <p className="text-sm text-muted-foreground">Сотрудники кафедры</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-muted/15 p-4 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="flex min-w-[200px] flex-1 items-center gap-2">
          <Input
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
            placeholder="Поиск по ФИО…"
            className="max-w-md"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearch(searchDraft.trim());
                setPage(1);
              }
            }}
          />
          <Button
            type="button"
            size="sm"
            className="gap-2 shrink-0"
            onClick={() => {
              setSearch(searchDraft.trim());
              setPage(1);
            }}
          >
            <Search className="h-4 w-4" />
            Найти
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2 shrink-0"
            disabled={exporting}
            onClick={() => void onExportDocx()}
          >
            <Download className="h-4 w-4" />
            Word
          </Button>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground sm:ml-auto">
          <span className="tabular-nums">
            {count ? `Всего: ${count}` : null}
            {isFetching ? " · …" : null}
          </span>
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
          <span className="tabular-nums text-foreground">{page}</span>
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
      </div>

      {errMsg && (
        <p className="text-sm text-destructive" role="alert">
          {errMsg}
        </p>
      )}

      {isLoading && rows.length === 0 ? (
        <KpiEmployeeTableSkeleton />
      ) : (
        <KpiEmployeeReportTable rows={rows} />
      )}
    </div>
  );
}
