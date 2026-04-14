import { useKpiInstitutionReport } from "entities/kpi-report/model/queries";
import { formatKpiCardScore } from "entities/kpi-report/lib/format-kpi-card-score";
import { Award, ArrowLeft, BarChart3, Building2, Printer } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "shared/ui";
import { printElement } from "shared/lib/print-element";
import { KpiOrgCardsSkeleton } from "../../KpiOrgCardsSkeleton";
import { DepartmentsKpiReports } from "./departments/DepartmentsKpiReports";

type RestoreContext = {
  tab?: string;
  instituteId?: number;
  departmentId?: number;
  departmentName?: string;
};

export function Institute({ restoreContext }: { restoreContext?: RestoreContext }) {
  const [selectedInstitute, setSelectedInstitute] = useState<number | null>(null);
  const { data: institutionsKpiReport, isLoading, error } = useKpiInstitutionReport();
  const filteredData = institutionsKpiReport?.filter((item) => item);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!restoreContext || restoreContext.tab !== "institute") return;
    if (restoreContext.instituteId && restoreContext.instituteId > 0) {
      setSelectedInstitute(restoreContext.instituteId);
    }
  }, [restoreContext]);

  return (
    <div className="space-y-4 p-2">
      {selectedInstitute == null && (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => {
              if (!listRef.current) return;
              printElement(listRef.current, "Институты KPI");
            }}
          >
            <Printer className="h-4 w-4" />
            Распечатать
          </Button>
        </div>
      )}

      {selectedInstitute != null && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => setSelectedInstitute(null)}
        >
          <ArrowLeft className="h-4 w-4" />
          К институтам
        </Button>
      )}

      {error && (
        <p className="text-sm text-destructive">
          Не удалось загрузить институты. Проверьте доступ к API.
        </p>
      )}

      {selectedInstitute == null ? (
        isLoading && !filteredData?.length ? (
          <KpiOrgCardsSkeleton />
        ) : (
        <div ref={listRef} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredData?.map((item) => {
            const passed = parseInt(item?.passed_percent?.split(".")[0] ?? "0", 10);
            const scoreLabel = formatKpiCardScore(item.score, item.scores);

            return (
              <button
                key={item?.id}
                type="button"
                onClick={() => setSelectedInstitute(item?.id)}
                className="cursor-pointer rounded-2xl border border-border/80 bg-card p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="mb-4 flex items-center gap-2">
                  <Building2 className="text-primary" size={22} />
                  <h3 className="text-sm font-semibold leading-snug">{item?.title_faculty}</h3>
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
                      Баллы института:{" "}
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {scoreLabel.split("/")[1]}
                      </span>
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        )
      ) : (
        <DepartmentsKpiReports
          id={selectedInstitute}
          onBack={() => setSelectedInstitute(null)}
          initialDepartmentId={
            restoreContext?.tab === "institute" &&
            restoreContext.instituteId === selectedInstitute
              ? restoreContext.departmentId
              : undefined
          }
          initialDepartmentName={
            restoreContext?.tab === "institute" &&
            restoreContext.instituteId === selectedInstitute
              ? restoreContext.departmentName
              : undefined
          }
        />
      )}
    </div>
  );
}
