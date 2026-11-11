import { useCallback, useEffect, useState } from "react";
import { AsyncSelect } from "shared/components/select";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "shared/ui";
import { WorkloadTable, WorkloadTableSkeleton } from "./";
import { useFaculties, useWorkLoadBySemester, useWorkloadYears } from "entities/education-management/model/queries";
import { getDepartments } from "entities/education-management/model/api";
import { usePrintArea } from "shared/lib";
import { Printer, RefreshCcw } from "lucide-react";

const WORKLOAD_OPTIONS = [
  { value: "pre", label: "Предварительная нагрузка" },
  { value: "final", label: "Окончательная нагрузка" },
];

const SEMESTER_OPTIONS = [
  { value: "осенний", label: "Осенний семестр" },
  { value: "весенний", label: "Весенний семестр" },
];

export const WorkloadTab = () => {
  const { data: faculties } = useFaculties();
  const { data: years = [] } = useWorkloadYears();
  const [workload, setWorkload] = useState("");
  const [institute, setInstitute] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");

  const {
    data: workLoadData,
    isLoading: isLoadingWorkLoad,
    isFetching: isFetchingWorkLoad,
    refetch: refetchWorkLoad,
  } = useWorkLoadBySemester(
    year, 
    parseInt(department) || 0,
    workload,
    semester
  );

  const fetchWorkload = useCallback(async (query?: string) => {
    if (!query) return WORKLOAD_OPTIONS;
    return WORKLOAD_OPTIONS.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase())
    );
  }, []);

  const fetchFaculties = useCallback(
    async (query?: string) => {
      if (!faculties) return [];
      if (!query) return faculties;
      return faculties.filter((faculty) =>
        faculty.label.toLowerCase().includes(query.toLowerCase())
      );
    },
    [faculties]
  );

  const fetchDepartments = useCallback(
    async (query?: string) => {
      if (!institute) return [];
      try {
        const departments = await getDepartments(parseInt(institute));
        if (!query) return departments;
        return departments.filter((dept) =>
          dept.label.toLowerCase().includes(query.toLowerCase())
        );
      } catch (error) {
        console.error("Error fetching departments:", error);
        return [];
      }
    },
    [institute]
  );

  const fetchYear = useCallback(async (query?: string) => {
    if (!query) return years;
    return years.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase())
    );
  }, [years]);

  const fetchSemester = useCallback(async (query?: string) => {
    if (!query) return SEMESTER_OPTIONS;
    return SEMESTER_OPTIONS.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase())
    );
  }, []);

  useEffect(() => {
    if (!institute) {
      setDepartment("");
      setYear("");
      setSemester("");
    } else if (!department) {
      setYear("");
      setSemester("");
    } else if (!year) {
      setSemester("");
    }
  }, [institute, department, year]);
const { ref: printRef, print } = usePrintArea<HTMLDivElement>({
    styles: `
      @media print {
        .print-card { box-shadow: none !important; border: 1px solid #e5e7eb !important; overflow: hidden !important; }
        .no-print { display: none !important; }
      }
    `,
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Отчет нагрузки</CardTitle>
          <CardDescription>
            Формирование отчетов по учебной нагрузке
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <AsyncSelect
              fetcher={fetchWorkload}
              label="Нагрузка"
              value={workload}
              onChange={setWorkload}
              renderOption={(option) => <span>{option.label}</span>}
              getOptionValue={(option) => option.value.toString()}
              getDisplayValue={(option) => option.label}
              placeholder="Нагрузка"
            />
            <AsyncSelect
              key={`institute-${workload}`}
              fetcher={fetchFaculties}
              label="Институт"
              value={institute}
              onChange={setInstitute}
              renderOption={(option) => <span>{option.label}</span>}
              getOptionValue={(option) => option.value.toString()}
              getDisplayValue={(option) => option.label}
              placeholder="Институт"
              disabled={!workload}
            />
            <AsyncSelect
              key={`dept-${institute}`}
              fetcher={fetchDepartments}
              label="Кафедра"
              value={department}
              onChange={setDepartment}
              renderOption={(option) => <span>{option.label}</span>}
              getOptionValue={(option) => option.value.toString()}
              getDisplayValue={(option) => option.label}
              placeholder="Кафедра"
              disabled={!institute}
            />
            <AsyncSelect
              key={`year-${department}`}
              fetcher={fetchYear}
              label="Год"
              value={year}
              onChange={setYear}
              renderOption={(option) => <span>{option.label}</span>}
              getOptionValue={(option) => option.value.toString()}
              getDisplayValue={(option) => option.label}
              placeholder="Год"
              disabled={!department}
            />
            <AsyncSelect
              key={`semester-${year}`}
              fetcher={fetchSemester}
              label="Семестр"
              value={semester}
              onChange={setSemester}
              renderOption={(option) => <span>{option.label}</span>}
              getOptionValue={(option) => option.value.toString()}
              getDisplayValue={(option) => option.label}
              placeholder="Семестр"
              disabled={!year}
            />
            <Button
              variant="outline"
              onClick={() => void refetchWorkLoad()}
              disabled={!year || !department || !workload || !semester || isFetchingWorkLoad}
            >
              <RefreshCcw className={`mr-2 h-4 w-4 ${isFetchingWorkLoad ? "animate-spin" : ""}`} />
              Обновить
            </Button>
            <Button
            variant="outline"
            onClick={() =>
              print({
                pageTitle: "UNET — University Network — A4 Landscape 90%",
                page: { size: "A3", orientation: "landscape", marginMm: 12 },
                fit: "none",
                scale: 0.6,         // ручной масштаб
              })
            }
          >
            <Printer className="h-4 w-4 mr-2" />
            Печать A3 (альбомная, 90%)
          </Button>
          </div>
          {isLoadingWorkLoad ? (
            <WorkloadTableSkeleton />
          ) : (
            <WorkloadTable printRef={printRef} workLoadData={workLoadData} />
          )}

        </CardContent>
      </Card>

      {/* Таблица нагрузки */}
    </div>
  );
};
