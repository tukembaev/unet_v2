import { useState } from 'react';
import { Button } from 'shared/ui';
import { Plus } from 'lucide-react';
import { AsyncSelect } from 'shared/components/select';
import { useFaculties, useReports } from 'entities/education-management/model/queries';
import { ReportsTable } from 'entities/education-management/ui/tabs/report/ReportsTable';

// Generate academic year options from 2019-2020 to 2023-2024
const generateAcademicYears = () => {
  const years = [];
  for (let startYear = 2019; startYear <= 2023; startYear++) {
    const endYear = startYear + 1;
    years.push({
      value: `${startYear}-${endYear}`,
      label: `${startYear}-${endYear}`,
    });
  }
  return years;
};

const academicYearOptions = generateAcademicYears();

const formOfStudyOptions = [
  { value: 'full_time', label: 'Очная' },
  { value: 'part_time', label: 'Заочная' },
];

export const ReportsTabContent = () => {
  const { data: faculties, isLoading: isLoadingFaculties } = useFaculties();
  const { data: reports } = useReports();
  const [institute, setInstitute] = useState('');
  const [formOfStudy, setFormOfStudy] = useState('');
  const [academicYear, setAcademicYear] = useState('');

  const fetchFaculties = async (query?: string) => {
    if (!faculties) return [];
    if (!query) return faculties;
    return faculties.filter((faculty) =>
      faculty.label.toLowerCase().includes(query.toLowerCase())
    );
  };

  const fetchFormOfStudy = async (query?: string) => {
    if (!query) return formOfStudyOptions;
    return formOfStudyOptions.filter((option) =>
      option.label.toLowerCase().includes(query.toLowerCase())
    );
  };

  const fetchAcademicYears = async (query?: string) => {
    if (!query) return academicYearOptions;
    return academicYearOptions.filter((option) =>
      option.label.toLowerCase().includes(query.toLowerCase())
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        <AsyncSelect
          fetcher={fetchFaculties}
          label="Институт"
          value={institute}
          onChange={setInstitute}
          renderOption={(option) => <span>{option.label}</span>}
          getOptionValue={(option) => option.value.toString()}
          getDisplayValue={(option) => option.label}
          placeholder="Выберите институт"
          disabled={isLoadingFaculties}
        />

        <AsyncSelect
          fetcher={fetchFormOfStudy}
          label="Форма обучения"
          value={formOfStudy}
          onChange={setFormOfStudy}
          renderOption={(option) => <span>{option.label}</span>}
          getOptionValue={(option) => option.value}
          getDisplayValue={(option) => option.label}
          placeholder="Выберите форму обучения"
        />

        <AsyncSelect
          fetcher={fetchAcademicYears}
          label="Уч год"
          value={academicYear}
          onChange={setAcademicYear}
          renderOption={(option) => <span>{option.label}</span>}
          getOptionValue={(option) => option.value}
          getDisplayValue={(option) => option.label}
          placeholder="Выберите учебный год"
        />

        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Создать
        </Button>
      </div>

      {reports && reports.length > 0 && <ReportsTable data={reports} />}
    </div>
  );
};

