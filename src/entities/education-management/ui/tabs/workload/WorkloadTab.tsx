import { useState } from "react";
import { AsyncSelect } from "shared/components/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "shared/ui";
import { WorkloadTable } from "./";

export const WorkloadTab = () => {
  const [workload, setWorkload] = useState("");
  const [institute, setInstitute] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");

  // Заглушки для AsyncSelect без API
  const fetchWorkload = async (query?: string) => {
    const mockData = [
      { value: "1", label: "Бакалавриат" },
      { value: "2", label: "Магистратура" },
      { value: "3", label: "Аспирантура" },
    ];
    if (!query) return mockData;
    return mockData.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase())
    );
  };

  const fetchInstitute = async (query?: string) => {
    const mockData = [
      { value: "1", label: "Институт информационных технологий" },
      { value: "2", label: "Институт экономики" },
      { value: "3", label: "Институт управления" },
    ];
    if (!query) return mockData;
    return mockData.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase())
    );
  };

  const fetchDepartment = async (query?: string) => {
    const mockData = [
      { value: "1", label: "Кафедра программирования" },
      { value: "2", label: "Кафедра математики" },
      { value: "3", label: "Кафедра физики" },
    ];
    if (!query) return mockData;
    return mockData.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase())
    );
  };

  const fetchYear = async (query?: string) => {
    const mockData = [
      { value: "2024", label: "2024" },
      { value: "2023", label: "2023" },
      { value: "2022", label: "2022" },
    ];
    if (!query) return mockData;
    return mockData.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase())
    );
  };

  const fetchSemester = async (query?: string) => {
    const mockData = [
      { value: "1", label: "Осенний семестр" },
      { value: "2", label: "Весенний семестр" },
    ];
    if (!query) return mockData;
    return mockData.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase())
    );
  };

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
              fetcher={fetchInstitute}
              label="Институт"
              value={institute}
              onChange={setInstitute}
              renderOption={(option) => <span>{option.label}</span>}
              getOptionValue={(option) => option.value.toString()}
              getDisplayValue={(option) => option.label}
              placeholder="Институт"
            />
            <AsyncSelect
              fetcher={fetchDepartment}
              label="Кафедра"
              value={department}
              onChange={setDepartment}
              renderOption={(option) => <span>{option.label}</span>}
              getOptionValue={(option) => option.value.toString()}
              getDisplayValue={(option) => option.label}
              placeholder="Кафедра"
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
            />
          </div>
          <WorkloadTable />

        </CardContent>
      </Card>

      {/* Таблица нагрузки */}
    </div>
  );
};
