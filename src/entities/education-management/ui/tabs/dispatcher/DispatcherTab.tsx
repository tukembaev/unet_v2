import { useFaculties } from "entities/education-management/model/queries";
import { useState, useEffect } from "react";
import { AsyncSelect } from "shared/components/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "shared/ui";
import { getDepartments, getSyllabuses, getSemesters, getWorkPlanBySemester } from "entities/education-management/model/api";
import { WorkPlanItem } from "entities/education-management/model/types";

export const DispatcherTab = () => {
  const { data: faculties, isLoading } = useFaculties();
  const [institute, setInstitute] = useState("");
  const [department, setDepartment] = useState("");
  const [syllabus, setSyllabus] = useState("");
  const [semester, setSemester] = useState("");
  const [workPlanData, setWorkPlanData] = useState<WorkPlanItem[]>([]);
  const [isLoadingWorkPlan, setIsLoadingWorkPlan] = useState(false);
  
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
      setWorkPlanData([]);
    }
  }, [institute]);

  useEffect(() => {
    if (!department) {
      setSyllabus("");
      setSemester("");
      setWorkPlanData([]);
    }
  }, [department]);

  useEffect(() => {
    if (!syllabus) {
      setSemester("");
      setWorkPlanData([]);
    }
  }, [syllabus]);

  useEffect(() => {
    if (!semester) {
      setWorkPlanData([]);
    }
  }, [semester]);


  useEffect(() => {
    const loadWorkPlan = async () => {
      if (syllabus || semester) {
        setIsLoadingWorkPlan(true);
        try {
          const data = await getWorkPlanBySemester(parseInt(syllabus), parseInt(semester));
          setWorkPlanData(data);
        } catch (error) {
          console.error("Error loading work plan:", error);
          setWorkPlanData([]);
        } finally {
          setIsLoadingWorkPlan(false);
        }
      }
    };

    loadWorkPlan();
  }, [syllabus, semester]);


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
      {workPlanData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Учебный план</CardTitle>
            <CardDescription>
              Результаты по выбранным параметрам
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>№</TableHead>
                    <TableHead>Номер</TableHead>
                    <TableHead>Название предмета</TableHead>
                    <TableHead>Тип потока</TableHead>
                    <TableHead>Преподаватель</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Студентов</TableHead>
                    <TableHead>Вместимость</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workPlanData.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.number}</TableCell>
                      <TableCell>{item.name_subject}</TableCell>
                      <TableCell>{item.stream_type}</TableCell>
                      <TableCell>{item.teacher_name}</TableCell>
                      <TableCell>{item.status}</TableCell>
                      <TableCell>{item.students_count}</TableCell>
                      <TableCell>{item.capacity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Индикатор загрузки */}
      {isLoadingWorkPlan && (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Загрузка учебного плана...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Сообщение когда все селекты выбраны но данных нет */}
      {syllabus && semester && !isLoadingWorkPlan && workPlanData.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <p className="text-sm text-gray-600">Данные не найдены для выбранных параметров</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
