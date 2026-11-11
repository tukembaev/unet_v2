import {
  useDepartments,
  useFaculties,
  useSemestersBySyllabus,
  useSyllabusesByDepartment,
  useWorkPlanBySemester,
} from 'entities/education-management/model/queries';
import type { WorkPlanItem } from 'entities/education-management/model/types';
import { useMemo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDispatcherStreamPath } from 'app/providers/routes';
import { EmptyInfo } from 'shared/components';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
  Skeleton,
} from 'shared/ui';
import { DispatcherTable } from './DispatcherTable';
import { FilterCombobox } from './FilterCombobox';

function FilterField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}

export const DispatcherTab = () => {
  const navigate = useNavigate();
  const [institute, setInstitute] = useState<string | null>(null);
  const [department, setDepartment] = useState<string | null>(null);
  const [syllabus, setSyllabus] = useState<string | null>(null);
  const [semester, setSemester] = useState<string | null>(null);

  const instituteId = institute != null ? Number(institute) : null;
  const departmentId = department != null ? Number(department) : null;
  const syllabusId = syllabus != null ? Number(syllabus) : null;
  const semesterId = semester != null ? Number(semester) : null;

  const facultiesQuery = useFaculties();
  const departmentsQuery = useDepartments(instituteId);
  const syllabusesQuery = useSyllabusesByDepartment(departmentId);
  const semestersQuery = useSemestersBySyllabus(syllabusId);
  const workPlanQuery = useWorkPlanBySemester(syllabusId, semesterId);

  const filtersReady = syllabusId != null && semesterId != null;
  const workPlanData = workPlanQuery.data ?? [];

  const filtersLabel = useMemo(() => {
    const parts = [
      facultiesQuery.data?.find((f) => f.value === instituteId)?.label,
      departmentsQuery.data?.find((d) => d.value === departmentId)?.label,
      syllabusesQuery.data?.find((s) => s.value === syllabusId)?.label,
      semestersQuery.data?.find((s) => s.value === semesterId)?.label,
    ].filter(Boolean);
    return parts.join(' · ');
  }, [
    facultiesQuery.data,
    departmentsQuery.data,
    syllabusesQuery.data,
    semestersQuery.data,
    instituteId,
    departmentId,
    syllabusId,
    semesterId,
  ]);

  const openSchedule = (item: WorkPlanItem) => {
    navigate(getDispatcherStreamPath(item.id), { state: { stream: item } });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Диспетчерская</CardTitle>
          <CardDescription>
            Центр управления учебным процессом — назначение пар потокам
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <FilterField label="Институт">
              <FilterCombobox
                options={facultiesQuery.data ?? []}
                value={institute}
                onChange={(value) => {
                  setInstitute(value);
                  setDepartment(null);
                  setSyllabus(null);
                  setSemester(null);
                }}
                disabled={facultiesQuery.isLoading}
                placeholder="Выберите институт"
                searchPlaceholder="Поиск института…"
              />
            </FilterField>

            <FilterField label="Кафедра">
              <FilterCombobox
                options={departmentsQuery.data ?? []}
                value={department}
                onChange={(value) => {
                  setDepartment(value);
                  setSyllabus(null);
                  setSemester(null);
                }}
                disabled={instituteId == null || departmentsQuery.isLoading}
                placeholder={
                  instituteId == null
                    ? 'Сначала выберите институт'
                    : 'Выберите кафедру'
                }
                searchPlaceholder="Поиск кафедры…"
              />
            </FilterField>

            <FilterField label="РУП">
              <FilterCombobox
                options={syllabusesQuery.data ?? []}
                value={syllabus}
                onChange={(value) => {
                  setSyllabus(value);
                  setSemester(null);
                }}
                disabled={departmentId == null || syllabusesQuery.isLoading}
                placeholder={
                  departmentId == null
                    ? 'Сначала выберите кафедру'
                    : 'Выберите РУП'
                }
                searchPlaceholder="Поиск РУП…"
              />
            </FilterField>

            <FilterField label="Семестр">
              <FilterCombobox
                options={semestersQuery.data ?? []}
                value={semester}
                onChange={setSemester}
                disabled={syllabusId == null || semestersQuery.isLoading}
                placeholder={
                  syllabusId == null
                    ? 'Сначала выберите РУП'
                    : 'Выберите семестр'
                }
                searchPlaceholder="Поиск семестра…"
              />
            </FilterField>
          </div>
        </CardContent>
      </Card>

      {filtersReady && workPlanQuery.isLoading ? (
        <Card>
          <CardHeader>
            <CardTitle>Потоки</CardTitle>
            <CardDescription>{filtersLabel || 'Загрузка…'}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-3/4" />
          </CardContent>
        </Card>
      ) : null}

      {filtersReady && !workPlanQuery.isLoading && workPlanData.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Потоки</CardTitle>
            <CardDescription>
              {filtersLabel || 'Результаты по выбранным параметрам'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DispatcherTable
              data={workPlanData}
              onScheduleAction={openSchedule}
            />
          </CardContent>
        </Card>
      ) : null}

      {filtersReady &&
      !workPlanQuery.isLoading &&
      workPlanData.length === 0 ? (
        <EmptyInfo />
      ) : null}

      {!filtersReady ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Нет данных… Выберите параметры фильтрации: институт → кафедра → РУП
            → семестр.
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
};
