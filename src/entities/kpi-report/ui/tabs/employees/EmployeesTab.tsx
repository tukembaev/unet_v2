import { useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

import { Button, Input } from "shared/ui";
import { getHttpErrorMessage } from "shared/lib/http-error";
import { useEmployeeReport } from "../../../model/queries";
import { KpiEmployeeReportTable } from "../../KpiEmployeeReportTable";
import { KpiEmployeeTableSkeleton } from "../../KpiEmployeeTableSkeleton";

const PAGE_ASSUME = 20;

export function EmployeesTab() {
  const [page, setPage] = useState(1);
  const [searchDraft, setSearchDraft] = useState("");
  const [search, setSearch] = useState("");

  const { data, isLoading, isFetching, error } = useEmployeeReport({
    page,
    search: search || undefined,
  });

  const rows = data?.items ?? [];
  const count = data?.count ?? 0;
  const errMsg = error ? getHttpErrorMessage(error) : undefined;
  const hasNext = rows.length >= PAGE_ASSUME;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-muted/15 p-4 sm:flex-row sm:flex-wrap sm:items-center">
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
          className="gap-2"
          onClick={() => {
            setSearch(searchDraft.trim());
            setPage(1);
          }}
        >
          <Search className="h-4 w-4" />
          Найти
        </Button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
        <span>
          {count ? (
            <>
              Найдено: <span className="font-medium text-foreground">{count}</span>
            </>
          ) : null}
          {isFetching ? " · обновление…" : null}
        </span>
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
