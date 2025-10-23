import React, { useState } from 'react';
import { Button, Badge, Checkbox } from 'shared/ui';
import { Filter, X } from 'lucide-react';

interface FilterOption {
  label: string;
  value: string;
}

const typeOptions: FilterOption[] = [
  { label: 'Все', value: 'all' },
  { label: 'Рапорт', value: 'Рапорт' },
  { label: 'Письмо', value: 'Письмо' },
  { label: 'Заявление', value: 'Заявление' },
];

const statusOptions: FilterOption[] = [
  { label: 'Все', value: 'all' },
  { label: 'В режиме ожидания', value: 'В режиме ожидания' },
  { label: 'В работе', value: 'В работе' },
  { label: 'Выполнено', value: 'Выполнено' },
  { label: 'Отклонено', value: 'Отклонено' },
];

interface DocumentsFilterProps {
  selectedTypes: string[];
  selectedStatuses: string[];
  onTypesChange: (types: string[]) => void;
  onStatusesChange: (statuses: string[]) => void;
}

export const DocumentsFilter: React.FC<DocumentsFilterProps> = ({
  selectedTypes,
  selectedStatuses,
  onTypesChange,
  onStatusesChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterToggle = (
    value: string,
    selectedFilters: string[],
    onChange: (filters: string[]) => void
  ) => {
    if (value === 'all') {
      onChange(['all']);
    } else {
      const newFilters = selectedFilters.filter(f => f !== 'all');
      if (newFilters.includes(value)) {
        const updatedFilters = newFilters.filter(f => f !== value);
        onChange(updatedFilters.length === 0 ? ['all'] : updatedFilters);
      } else {
        onChange([...newFilters, value]);
      }
    }
  };

  const clearAllFilters = () => {
    onTypesChange(['all']);
    onStatusesChange(['all']);
  };

  const hasActiveTypeFilters = selectedTypes.length > 0 && !selectedTypes.includes('all');
  const hasActiveStatusFilters = selectedStatuses.length > 0 && !selectedStatuses.includes('all');
  const hasActiveFilters = hasActiveTypeFilters || hasActiveStatusFilters;
  const activeFiltersCount = 
    (hasActiveTypeFilters ? selectedTypes.length : 0) + 
    (hasActiveStatusFilters ? selectedStatuses.length : 0);

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
        <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50 dark:bg-gray-900 dark:border-gray-700">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-sm">Фильтры</h3>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="h-3 w-3 mr-1" />
                  Очистить
                </Button>
              )}
            </div>

            {/* Type Filters */}
            <div className="mb-4">
              <h4 className="text-xs font-medium text-gray-500 mb-2 dark:text-gray-400">Тип документа</h4>
              <div className="space-y-2">
                {typeOptions.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded dark:hover:bg-gray-800"
                    onClick={() => handleFilterToggle(option.value, selectedTypes, onTypesChange)}
                  >
                    <Checkbox
                      checked={selectedTypes.includes(option.value)}
                      onCheckedChange={() => handleFilterToggle(option.value, selectedTypes, onTypesChange)}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Filters */}
            <div>
              <h4 className="text-xs font-medium text-gray-500 mb-2 dark:text-gray-400">Статус</h4>
              <div className="space-y-2">
                {statusOptions.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded dark:hover:bg-gray-800"
                    onClick={() => handleFilterToggle(option.value, selectedStatuses, onStatusesChange)}
                  >
                    <Checkbox
                      checked={selectedStatuses.includes(option.value)}
                      onCheckedChange={() => handleFilterToggle(option.value, selectedStatuses, onStatusesChange)}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                  </div>
                ))}
              </div>
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

