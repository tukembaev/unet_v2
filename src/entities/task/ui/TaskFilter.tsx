import React, { useState } from 'react';
import { Button, Badge, Checkbox } from 'shared/ui';
import { Filter, X } from 'lucide-react';

export type TaskRole = 'RESPONSIBLE' | 'EXECUTOR' | 'OBSERVER' | 'CREATOR';

interface FilterOption {
  key: string;
  label: string;
  value: string;
}

const roleFilterOptions: FilterOption[] = [
  { key: 'CREATOR', label: 'Поручил', value: 'CREATOR' },
  { key: 'RESPONSIBLE', label: 'Ответственный', value: 'RESPONSIBLE' },
  { key: 'EXECUTOR', label: 'Соисполнитель', value: 'EXECUTOR' },
  { key: 'OBSERVER', label: 'Наблюдатель', value: 'OBSERVER' },
];

export interface TaskFilters {
  roles: TaskRole[];
}

interface TaskFilterProps {
  selectedFilters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
}

export const TaskFilter: React.FC<TaskFilterProps> = ({
  selectedFilters,
  onFiltersChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleRoleToggle = (value: TaskRole) => {
    const newRoles = selectedFilters.roles.includes(value)
      ? selectedFilters.roles.filter(r => r !== value)
      : [...selectedFilters.roles, value];
    
    onFiltersChange({
      roles: newRoles,
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      roles: [],
    });
  };

  const hasActiveFilters = selectedFilters.roles.length > 0;
  const activeFiltersCount = selectedFilters.roles.length;

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <Filter className="h-4 w-4" />
        Фильтр
        {hasActiveFilters && (
          <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
            {activeFiltersCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-sm">Фильтр по роли</h3>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <X className="h-3 w-3 mr-1" />
                  Очистить
                </Button>
              )}
            </div>
            
            {/* Role Filters */}
            <div className="space-y-2">
              {roleFilterOptions.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-accent p-2 rounded"
                  onClick={() => handleRoleToggle(option.value as TaskRole)}
                >
                  <Checkbox
                    checked={selectedFilters.roles.includes(option.value as TaskRole)}
                    onCheckedChange={() => handleRoleToggle(option.value as TaskRole)}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
