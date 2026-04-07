import React, { useState, useEffect, useRef } from 'react';
import { Input } from 'shared/ui';
import { Button } from 'shared/ui';
import { Search, Plus } from 'lucide-react';
import { FormQuery, useFormNavigation } from 'shared/lib';
import { TaskFilter, TaskFilters } from './TaskFilter';

interface TaskSearchFilterProps {
  onSearch?: (value: string) => void;
  selectedFilters?: TaskFilters;
  onFiltersChange?: (filters: TaskFilters) => void;
}

const TaskSearchFilterComponent: React.FC<TaskSearchFilterProps> = ({
  onSearch,
  selectedFilters = { roles: [] },
  onFiltersChange,
}) => {
  const openForm = useFormNavigation();
  const [searchValue, setSearchValue] = useState('');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    // Очищаем предыдущий таймер
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Устанавливаем новый таймер для debounce (300ms)
    debounceTimerRef.current = setTimeout(() => {
      onSearch?.(value);
    }, 300);
  };

  // Очистка таймера при размонтировании
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Поиск задач..."
          className="pl-10 w-full sm:w-64"
          value={searchValue}
          onChange={handleSearchChange}
        />
      </div>

      {/* Filter Component */}
      <TaskFilter 
        selectedFilters={selectedFilters}
        onFiltersChange={(filters) => onFiltersChange?.(filters)}
      />

      {/* Add Task Button */}
      <Button onClick={() =>  openForm(FormQuery.CREATE_TASK)} className="w-full sm:w-auto">
        <Plus className="h-4 w-4 sm:mr-2" />
        <span className="hidden xs:inline ml-2 sm:ml-0 text-sm">Добавить задачу</span>
        <span className="xs:hidden text-sm">Добавить</span>
      </Button>
    </div>
  );
};

export const TaskSearchFilter = React.memo(TaskSearchFilterComponent);
