import { useEffect, useState } from "react";
import { AsyncSelect } from "shared/components/select";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "shared/ui";
import { WorkloadTable, WorkloadTableSkeleton } from "./";
import { useFaculties, useWorkLoadBySemester } from "entities/education-management/model/queries";
import { getDepartments } from "entities/education-management/model/api";
import { usePrintArea } from "shared/lib";
import { Printer } from "lucide-react";

export const WorkloadTab = () => {
  const { data: faculties } = useFaculties();
  const [workload, setWorkload] = useState("");
  const [institute, setInstitute] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");

  const { data: workLoadData, isLoading: isLoadingWorkLoad } = useWorkLoadBySemester(
    parseInt(year) || 0, 
    parseInt(department) || 0,
    workload,
    semester
  );

  // Заглушки для AsyncSelect без API
  const fetchWorkload = async (query?: string) => {
    const mockData = [
      { value: "pre", label: "Предварительная нагрузка" },
      { value: "final", label: "Окончательная нагрузка" },
    ];
    if (!query) return mockData;
    return mockData.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase())
    );
  };

  const fetchFaculties = async (query?: string) => {
    if (!faculties) return [];
    if (!query) return faculties;
    return faculties.filter((faculty) =>
      faculty.label.toLowerCase().includes(query.toLowerCase())
    );
  };

  const fetchDepartments = async (query?: string) => {
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
  };

  const fetchYear = async (query?: string) => {
    const mockData = [
      { value: "2023/2024", label: "2023/2024" },
      { value: "2024/2025", label: "2024/2025" },

    ];
    if (!query) return mockData;
    return mockData.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase())
    );
  };

  const fetchSemester = async (query?: string) => {
    const mockData = [
      { value: "осений", label: "Осенний семестр" },
      { value: "весенний", label: "Весенний семестр" },
    ];
    if (!query) return mockData;
    return mockData.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase())
    );
  };

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
            onClick={() =>
              print({
                pageTitle: "UNET V2 — A4 Landscape 90%",
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
