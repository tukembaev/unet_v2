import { useEffect, useRef, useState } from 'react';
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'shared/ui';
import { ChevronLeft, ChevronRight, FilterX, Search } from 'lucide-react';
import { FilterCombobox } from 'entities/education-management/ui/tabs/dispatcher/FilterCombobox';
import {
  useFlows,
  useFormEducationOptions,
  useLevelEducationOptions,
  useSyllabusSemesters,
  useWorkPlans,
} from '../model/queries';
import { StreamsTable } from './StreamsTable';

const ALL = '__all__';
const FILTERS_KEY = 'streams-filters';

type StreamsFilters = {
  level: string;
  form: string;
  workPlan: string;
  semester: string;
  page: number;
  search: string;
};

const EMPTY_FILTERS: StreamsFilters = {
  level: '',
  form: '',
  workPlan: ALL,
  semester: ALL,
  page: 1,
  search: '',
};

function readFilters(): StreamsFilters {
  try {
    const raw = sessionStorage.getItem(FILTERS_KEY);
    if (!raw) return EMPTY_FILTERS;
    const parsed = JSON.parse(raw) as Partial<StreamsFilters>;
    const page = Number(parsed.page);
    const level = typeof parsed.level === 'string' ? parsed.level : '';
    const form = typeof parsed.form === 'string' ? parsed.form : '';
    const hasEducation = Boolean(level && form);
    return {
      level,
      form,
      workPlan:
        hasEducation && typeof parsed.workPlan === 'string' ? parsed.workPlan : ALL,
      semester:
        hasEducation && typeof parsed.semester === 'string' ? parsed.semester : ALL,
      page: Number.isFinite(page) && page > 0 ? page : 1,
      search: typeof parsed.search === 'string' ? parsed.search : '',
    };
  } catch {
    return EMPTY_FILTERS;
  }
}

const FlowPage = () => {
  const initialFilters = readFilters();
  const [selectedLevel, setSelectedLevel] = useState(initialFilters.level);
  const [selectedForm, setSelectedForm] = useState(initialFilters.form);
  const [selectedWorkPlan, setSelectedWorkPlan] = useState(initialFilters.workPlan);
  const [selectedSemester, setSelectedSemester] = useState(initialFilters.semester);
  const [page, setPage] = useState(initialFilters.page);
  const [search, setSearch] = useState(initialFilters.search);
  const [debouncedSearch, setDebouncedSearch] = useState(initialFilters.search);
  const skipSearchPageReset = useRef(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 350);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (skipSearchPageReset.current) {
      skipSearchPageReset.current = false;
      return;
    }
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    const next: StreamsFilters = {
      level: selectedLevel,
      form: selectedForm,
      workPlan: selectedWorkPlan,
      semester: selectedSemester,
      page,
      search,
    };
    sessionStorage.setItem(FILTERS_KEY, JSON.stringify(next));
  }, [selectedLevel, selectedForm, selectedWorkPlan, selectedSemester, page, search]);

  const syllabusId =
    selectedWorkPlan !== ALL && Number.isFinite(Number(selectedWorkPlan))
      ? Number(selectedWorkPlan)
      : null;
  const semesterId =
    selectedSemester !== ALL && Number.isFinite(Number(selectedSemester))
      ? Number(selectedSemester)
      : null;

  const { data: levels = [], isLoading: levelsLoading } = useLevelEducationOptions();
  const { data: forms = [], isLoading: formsLoading } = useFormEducationOptions();
  const levelLabel =
    levels.find((item) => item.value === selectedLevel)?.label || selectedLevel;
  const formLabel =
    forms.find((item) => item.value === selectedForm)?.label || selectedForm;
  const educationReady = Boolean(selectedLevel && selectedForm);
  const { data: workPlans = [], isLoading: workPlansLoading } = useWorkPlans(
    educationReady ? levelLabel : null,
    educationReady ? formLabel : null
  );
  const { data: semesters = [], isLoading: semestersLoading } =
    useSyllabusSemesters(syllabusId);

  const subjectsQuery = useFlows({
    ...(syllabusId != null ? { syllabus: syllabusId } : {}),
    ...(semesterId != null ? { semester: semesterId } : {}),
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    page,
  });

  const subjects = subjectsQuery.data?.results ?? [];
  const totalCount = subjectsQuery.data?.count ?? 0;
  const hasNext = Boolean(subjectsQuery.data?.next);
  const hasPrevious = Boolean(subjectsQuery.data?.previous) || page > 1;
  const activeFiltersCount = [
    selectedLevel || null,
    selectedForm || null,
    syllabusId,
    semesterId,
    debouncedSearch || null,
  ].filter((v) => v != null && v !== '').length;

  const resetEducation = () => {
    setSelectedWorkPlan(ALL);
    setSelectedSemester(ALL);
    setPage(1);
  };

  const resetFilters = () => {
    setSelectedLevel('');
    setSelectedForm('');
    setSelectedWorkPlan(ALL);
    setSelectedSemester(ALL);
    setSearch('');
    setDebouncedSearch('');
    setPage(1);
    sessionStorage.removeItem(FILTERS_KEY);
  };

  return (
    <div className="space-y-6 p-4">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Потоки</h1>

        <div className="grid w-full gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">Уровень</p>
            <Select
              value={selectedLevel || undefined}
              onValueChange={(value) => {
                setSelectedLevel(value);
                resetEducation();
              }}
              disabled={levelsLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Уровень" />
              </SelectTrigger>
              <SelectContent>
                {levels.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">Форма</p>
            <Select
              value={selectedForm || undefined}
              onValueChange={(value) => {
                setSelectedForm(value);
                resetEducation();
              }}
              disabled={formsLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Форма обучения" />
              </SelectTrigger>
              <SelectContent>
                {forms.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">РУП</p>
            <FilterCombobox
              options={workPlans}
              value={selectedWorkPlan === ALL ? null : selectedWorkPlan}
              onChange={(value) => {
                setSelectedWorkPlan(value ?? ALL);
                setSelectedSemester(ALL);
                setPage(1);
              }}
              disabled={!educationReady || workPlansLoading}
              placeholder={
                educationReady ? 'Выберите РУП' : 'Сначала уровень и форма'
              }
              searchPlaceholder="Поиск РУП…"
            />
          </div>

          <div className="space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">Семестр</p>
            <Select
              value={selectedSemester}
              onValueChange={(value) => {
                setSelectedSemester(value);
                setPage(1);
              }}
              disabled={syllabusId == null || semestersLoading}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    syllabusId == null ? 'Сначала выберите РУП' : 'Все семестры'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Все семестры</SelectItem>
                {semesters.map((semester) => (
                  <SelectItem key={semester.value} value={String(semester.value)}>
                    {semester.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 sm:col-span-2 xl:col-span-1">
            <p className="text-sm font-medium text-muted-foreground">Поиск</p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Название, код предмета"
                className="pl-9"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {activeFiltersCount > 0
            ? `Активных фильтров: ${activeFiltersCount}`
            : 'Показаны все предметы'}
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          disabled={activeFiltersCount === 0}
        >
          <FilterX className="mr-2 h-4 w-4" />
          Сбросить
        </Button>
      </div>

      <div className="space-y-4">
        <StreamsTable data={subjects} isLoading={subjectsQuery.isLoading} />

        {totalCount > 0 || hasNext || hasPrevious ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Найдено: {totalCount}
              {subjects.length > 0 ? ` · страница ${page}` : ''}
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!hasPrevious || subjectsQuery.isFetching}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Назад
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!hasNext || subjectsQuery.isFetching}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Вперёд
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default FlowPage;
