import { useRef, useState } from "react";
import { useDepartmentsKpi } from "entities/kpi-report/model/queries";
import type { KpiDepartmentsReport } from "entities/kpi-report/model/types";
import { formatKpiCardScore } from "entities/kpi-report/lib/format-kpi-card-score";
import { Award, ArrowLeft, BarChart3, Building2, Printer } from "lucide-react";

import { Button } from "shared/ui";
import { getHttpErrorMessage } from "shared/lib/http-error";
import { printElement } from "shared/lib/print-element";
import { KpiOrgCardsSkeleton } from "../../../KpiOrgCardsSkeleton";
import { DepartmentEmployeesSection } from "./DepartmentEmployeesSection";

interface DepartmentsProps {
  id: number;
  onBack: () => void;
}

export function DepartmentsKpiReports({ id, onBack }: DepartmentsProps) {
  const { data, isLoading, error } = useDepartmentsKpi(id);
  const departmentsKpiReport = (data ?? []) as KpiDepartmentsReport[];
  const listRef = useRef<HTMLDivElement | null>(null);

  const [selectedDept, setSelectedDept] = useState<{
    id: number;
    name: string;
  } | null>(null);

  if (selectedDept) {
    return (
      <DepartmentEmployeesSection
        departmentId={selectedDept.id}
        departmentName={selectedDept.name}
        onBack={() => setSelectedDept(null)}
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button type="button" variant="outline" size="sm" className="gap-2 md:hidden" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
          Назад
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => {
            if (!listRef.current) return;
            printElement(listRef.current, "Кафедры KPI");
          }}
        >
          <Printer className="h-4 w-4" />
          Распечатать
        </Button>
      </div>

      {error && (
        <p className="text-sm text-destructive">
          {getHttpErrorMessage(error, "Не удалось загрузить кафедры.")}
        </p>
      )}

      {isLoading && departmentsKpiReport.length === 0 ? (
        <KpiOrgCardsSkeleton />
      ) : (
      <div ref={listRef} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {departmentsKpiReport.map((item) => {
          const passed = parseInt(item?.passed_percent?.split(".")[0] ?? "0", 10);
          const scoreLabel = formatKpiCardScore(item.score, item.scores);

          return (
            <button
              key={item?.id}
              type="button"
              onClick={() =>
                setSelectedDept({
                  id: item.id,
                  name: item.departament_name || `Кафедра #${item.id}`,
                })
              }
              className="rounded-2xl border border-border/80 bg-card p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="mb-4 flex items-center gap-2">
                <Building2 className="text-primary" size={22} />
                <h3 className="text-sm font-semibold leading-snug">{item?.departament_name}</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <BarChart3 size={18} className="text-muted-foreground" />

                  <div className="flex-1">
                    <p className="mb-1 text-sm">
                      Заполняемость:{" "}
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {passed}%
                      </span>
                    </p>

                    <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full bg-emerald-500" style={{ width: `${passed}%` }} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Award size={18} className="text-muted-foreground" />
                  <p className="text-sm">
                    Баллы:{" "}
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {scoreLabel}
                    </span>
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      )}
    </div>
  );
}
