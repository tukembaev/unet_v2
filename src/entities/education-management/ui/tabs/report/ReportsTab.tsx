import { useFaculties } from "entities/education-management/model/queries";
import { useState } from "react";
import { AsyncSelect } from "shared/components/select";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "shared/ui";

const eduFormOptions = [
  { value: "Очная", label: "Очная" },
  { value: "Заочная", label: "Заочная" },
];

const eduYearOptions = [
  { value: "2019-2020", label: "2019-2020" },
  { value: "2020-2021", label: "2020-2021" },
  { value: "2021-2022", label: "2021-2022" },
  { value: "2022-2023", label: "2022-2023" },
  { value: "2023-2024", label: "2023-2024" },
];

export const ReportsTab = () => {
  const { data: faculties, isLoading, error } = useFaculties();
  const [institute, setInstitute] = useState("");
  const [eduForm, setEduForm] = useState("");
  const [eduYear, setEduYear] = useState("");
  
  const fetchFaculties = async (query?: string) => {
    if (!faculties) return [];
    if (!query) return faculties;
    return faculties.filter((faculty) =>
      faculty.label.toLowerCase().includes(query.toLowerCase())
    );
  };

  const fetchEduForm = async (query?: string) => {
    if (!query) return eduFormOptions;
    return eduFormOptions.filter((option) =>
      option.label.toLowerCase().includes(query.toLowerCase())
    );
  };

  const fetchEduYear = async (query?: string) => {
    if (!query) return eduYearOptions;
    return eduYearOptions.filter((option) =>
      option.label.toLowerCase().includes(query.toLowerCase())
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Отчеты</CardTitle>
          <CardDescription>
            Генерация и просмотр отчетов по учебному процессу
          </CardDescription>
        </CardHeader>
        <CardContent>
        <div className="flex gap-4"> 
          <AsyncSelect
            fetcher={fetchFaculties}
            label="Институт"
            value={institute}
            onChange={setInstitute}
            renderOption={(option) => <span>{option.label}</span>}
            getOptionValue={(option) => option.value.toString()}
            getDisplayValue={(option) => option.label}
            placeholder="Выберите институт"
          />
          <AsyncSelect
            fetcher={fetchEduForm}
            label="Форма обучения"
            value={eduForm}
            onChange={setEduForm}
            renderOption={(option) => <span>{option.label}</span>}
            getOptionValue={(option) => option.value.toString()}
            getDisplayValue={(option) => option.label}
            placeholder="Выберите форму обучения"
          />
          <AsyncSelect
            fetcher={fetchEduYear}
            label="Год обучения"
            value={eduYear}
            onChange={setEduYear}
            renderOption={(option) => <span>{option.label}</span>}
            getOptionValue={(option) => option.value.toString()}
            getDisplayValue={(option) => option.label}
            placeholder="Выберите год обучения"
            />
            <Button variant={"outline"}>
              Создать
            </Button>
        </div>
        </CardContent>
      </Card>
    </div>
  );
};
