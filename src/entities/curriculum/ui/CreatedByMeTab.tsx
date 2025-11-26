import { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Skeleton,
} from 'shared/ui';
import { useAllSyllabus } from '../model';
import { DirectionItem } from '../model';
import { GenericFilter, FilterGroup } from 'shared/components/data-table';

// Generate year options from 2020 to 2050
const generateYearOptions = () => {
  const options = [{ label: 'Все', value: 'all' }];
  for (let year = 2020; year <= 2050; year++) {
    options.push({ label: year.toString(), value: year.toString() });
  }
  return options;
};

const yearOptions = generateYearOptions();

interface CreatedByMeTabProps {
  searchQuery: string;
}

export const CreatedByMeTab = ({ searchQuery }: CreatedByMeTabProps) => {
  const { data: directions, isLoading } = useAllSyllabus();
  const [selectedYear, setSelectedYear] = useState<string>('all');

  const filteredData = useMemo(() => {
    if (!directions) return [];

    let filtered = directions;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((item: DirectionItem) =>
        item.direction.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by selected year (show all records starting from selected year)
    if (selectedYear !== 'all') {
      const yearNum = parseInt(selectedYear, 10);
      filtered = filtered.filter((item: DirectionItem) => {
        if (!item.start_year) return false;
        const itemStartYear = parseInt(item.start_year, 10);
        return itemStartYear >= yearNum;
      });
    }

    return filtered;
  }, [directions, searchQuery, selectedYear]);

  const filterGroups: FilterGroup[] = [
    {
      id: 'year',
      label: 'Год (с ...)',
      options: yearOptions,
      selectedValues: selectedYear === 'all' ? ['all'] : [selectedYear],
      onChange: (values) => {
        setSelectedYear(values.includes('all') ? 'all' : values[0] || 'all');
      },
    },
  ];

  const handleClearFilters = () => {
    setSelectedYear('all');
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="rounded-md border">
          <div className="p-4">
            <div className="grid grid-cols-5 gap-4 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-6" />
              ))}
            </div>
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-5 gap-4 mb-2">
                {Array.from({ length: 5 }).map((_, colIndex) => (
                  <Skeleton key={colIndex} className="h-8" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <GenericFilter filterGroups={filterGroups} onClearAll={handleClearFilters} />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="text-center font-bold">Направление</TableHead>
              <TableHead className="text-center font-bold">Количество Предметов</TableHead>
              <TableHead className="text-center font-bold">Количество семестров</TableHead>
              <TableHead className="text-center font-bold">Год</TableHead>
              <TableHead className="text-center font-bold">Создал</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  {searchQuery || selectedYear !== 'all'
                    ? 'По вашему запросу ничего не найдено'
                    : 'Нет данных для отображения'}
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item: DirectionItem) => (
                <TableRow key={item.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{item.direction}</TableCell>
                  <TableCell className="text-center">{item.subjects_count}</TableCell>
                  <TableCell className="text-center">{item.semester_count}</TableCell>
                  <TableCell className="text-center">
                    {item.start_year && item.end_year
                      ? `${item.start_year}-${item.end_year}`
                      : '-'}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.employee_name || '-'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

