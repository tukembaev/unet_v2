import { Award, Briefcase, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "shared/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "shared/ui";
import { cn } from "shared/lib/utils";
import type { KpiReportTableRow } from "../model/types";
import { ROUTES } from "app/providers/routes";
import {
  formatCriterionCell,
  formatCriterionColumnHeader,
  getEarnedScoreDisplay,
  getEmployeeAvatarUrl,
  getEmployeeDisplayName,
  getEmployeePosition,
  getMetricCellValue,
  pickBKpiColumnKeys,
} from "../lib/employee-report-row";

function resolveUserId(row: KpiReportTableRow): number | null {
  const raw = row.user_id;
  const n = typeof raw === "number" ? raw : Number(raw);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function initials(name: string) {
  const p = name.split(/\s+/).filter(Boolean);
  const a = p[0]?.[0] ?? "";
  const b = p[1]?.[0] ?? "";
  return (a + b).toUpperCase() || "—";
}

type Props = {
  rows: KpiReportTableRow[];
  className?: string;
  /** Подпись колонки «должность / структура» (в avg-kpi с бэка приходит `division`). */
  positionColumnTitle?: string;
  /** Подпись колонки итога (например «Общий балл»). */
  totalScoreColumnTitle?: string;
  detailNavigationState?: Record<string, unknown>;
};

export function KpiEmployeeReportTable({
  rows,
  className,
  positionColumnTitle = "Должность",
  totalScoreColumnTitle = "Баллы",
  detailNavigationState,
}: Props) {
  const navigate = useNavigate();
  const bKeys = pickBKpiColumnKeys(rows);

  if (rows.length === 0) {
    return (
      <div
        className={cn(
          "rounded-xl border border-dashed border-border/70 bg-muted/10 px-6 py-12 text-center text-sm text-muted-foreground",
          className
        )}
      >
        Нет записей для отображения.
      </div>
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm",
        className
      )}
    >
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/60 bg-muted/30 hover:bg-muted/30">
              <TableHead className="min-w-[220px] px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <UserRound className="h-3.5 w-3.5 opacity-70" aria-hidden />
                  Сотрудник
                </span>
              </TableHead>
              <TableHead className="min-w-[140px] px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 opacity-70" aria-hidden />
                  {positionColumnTitle}
                </span>
              </TableHead>
              {bKeys.map((key) => (
                <TableHead
                  key={key}
                  className="w-[72px] min-w-[64px] px-2 py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  {formatCriterionColumnHeader(key)}
                </TableHead>
              ))}
              <TableHead className="min-w-[100px] px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                <span className="inline-flex items-center justify-center gap-1.5">
                  <Award className="h-3.5 w-3.5 opacity-70" aria-hidden />
                  {totalScoreColumnTitle}
                </span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, idx) => {
              const name = getEmployeeDisplayName(row);
              const avatar = getEmployeeAvatarUrl(row);
              const position = getEmployeePosition(row);
              const earnedTotal = getEarnedScoreDisplay(row);
              const userId = resolveUserId(row);

              return (
                <TableRow
                  key={String(row.id ?? idx)}
                  className={cn(
                    "border-b border-border/40 transition-colors hover:bg-muted/20",
                    userId && "cursor-pointer"
                  )}
                  onClick={() => {
                    if (!userId) return;
                    navigate(`${ROUTES.KPI_EMPLOYEE}/${userId}`, {
                      state: detailNavigationState ? { kpiBackContext: detailNavigationState } : undefined,
                    });
                  }}
                >
                  <TableCell className="px-4 py-3 align-middle">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-border/60">
                        <AvatarImage src={avatar} alt="" className="object-cover" />
                        <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                          {initials(name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium leading-snug text-foreground">
                        {name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] px-4 py-3 text-sm text-foreground">
                    <span className="line-clamp-2">{position}</span>
                  </TableCell>
                  {bKeys.map((key) => (
                    <TableCell
                      key={key}
                      className="px-2 py-3 text-center text-sm tabular-nums text-foreground"
                    >
                      {formatCriterionCell(getMetricCellValue(row, key))}
                    </TableCell>
                  ))}
                  <TableCell className="px-4 py-3 text-center text-sm tabular-nums font-semibold text-foreground">
                    {earnedTotal === "—" ? (
                      <span className="font-normal text-muted-foreground">—</span>
                    ) : (
                      earnedTotal
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
