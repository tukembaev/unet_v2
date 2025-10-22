import { getDepartments, getSemesters, getSyllabuses } from "entities/education-management/model/api";
import { useFaculties, useWorkPlanBySemester } from "entities/education-management/model/queries";
import { useEffect, useState } from "react";
import { EmptyInfo } from "shared/components";
import { AsyncSelect } from "shared/components/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Skeleton } from "shared/ui";
import { DispatcherTable } from "./DispatcherTable";


export const DispatcherTab = () => {
  const { data: faculties, isLoading } = useFaculties();
  const [institute, setInstitute] = useState("");
  const [department, setDepartment] = useState("");
  const [syllabus, setSyllabus] = useState("");
  const [semester, setSemester] = useState("");
  
  const { data: workPlanData, isLoading: isLoadingWorkPlan } = useWorkPlanBySemester(
    parseInt(syllabus) || 0, 
    parseInt(semester) || ''
  );


  const handleScheduleAction = (id: number) => {
    console.log("Составить расписание для записи с ID:", id);
    // Здесь можно добавить логику для создания расписания
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

  const fetchSyllabuses = async (query?: string) => {
    if (!department) return [];
    try {
      const syllabuses = await getSyllabuses(parseInt(department));
      if (!query) return syllabuses;
      return syllabuses.filter((syll) =>
        syll.label.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error("Error fetching syllabuses:", error);
      return [];
    }
  };

  const fetchSemesters = async (query?: string) => {
    if (!syllabus) return [];
    try {
      const semesters = await getSemesters(parseInt(syllabus));
      if (!query) return semesters;
      return semesters.filter((sem) =>
        sem.label.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error("Error fetching semesters:", error);
      return [];
    }
  };

  // Сброс зависимых селектов при изменении родительского
  useEffect(() => {
    if (!institute) {
      setDepartment("");
      setSyllabus("");
      setSemester("");
    } else if (!department) {
      setSyllabus("");
      setSemester("");
    } else if (!syllabus) {
      setSemester("");
    }
  }, [institute, department, syllabus]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Диспетчерская</CardTitle>
          <CardDescription>
            Диспетчерская для создания и просмотра учебных планов
          </CardDescription>
        </CardHeader>
        <CardContent>
        <div className="flex gap-4 flex-wrap"> 
          <AsyncSelect
            fetcher={fetchFaculties}
            label="Институт"
            value={institute}
            onChange={setInstitute}
            renderOption={(option) => <span>{option.label}</span>}
            getOptionValue={(option) => option.value.toString()}
            getDisplayValue={(option) => option.label}
            placeholder="Выберите институт"
            disabled={isLoading}
          />
          <AsyncSelect
            fetcher={fetchDepartments}
            label="Кафедра"
            value={department}
            onChange={setDepartment}
            renderOption={(option) => <span>{option.label}</span>}
            getOptionValue={(option) => option.value.toString()}
            getDisplayValue={(option) => option.label}
            placeholder="Выберите кафедру"
            disabled={!institute}
          />
          <AsyncSelect
            fetcher={fetchSyllabuses}
            label="РУП"
            value={syllabus}
            onChange={setSyllabus}
            renderOption={(option) => <span>{option.label}</span>}
            getOptionValue={(option) => option.value.toString()}
            getDisplayValue={(option) => option.label}
            placeholder="Выберите РУП"
            disabled={!department}
            />
          <AsyncSelect
            fetcher={fetchSemesters}
            label="Семестр"
            value={semester}
            onChange={setSemester}
            renderOption={(option) => <span>{option.label}</span>}
            getOptionValue={(option) => option.value.toString()}
            getDisplayValue={(option) => option.label}
            placeholder="Выберите семестр"
            disabled={!syllabus}
            />
        </div>
        </CardContent>
      </Card>

      {/* Таблица с результатами */}
      {workPlanData && workPlanData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Учебный план</CardTitle>
            <CardDescription>
              Результаты по выбранным параметрам
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DispatcherTable 
              data={workPlanData} 
              onScheduleAction={handleScheduleAction}
            />
          </CardContent>
        </Card>
      )}

      {/* Индикатор загрузки */}
      {isLoadingWorkPlan && (
        <Card>
          <CardHeader>
            <CardTitle>Учебный план</CardTitle>
            <CardDescription>
              Результаты по выбранным параметрам
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      )}

      {/* Сообщение когда все селекты выбраны но данных нет */}
      {syllabus && semester && !isLoadingWorkPlan && (!workPlanData || workPlanData.length === 0) && (
        <EmptyInfo />
      )}
    </div>
  );
};
