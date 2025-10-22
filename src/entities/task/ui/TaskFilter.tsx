import React, { useState } from 'react';
import { Button, Badge, Checkbox } from 'shared/ui';
import { Filter, X } from 'lucide-react';

interface FilterOption {
  key: string;
  label: string;
  value: string;
}

const filterOptions: FilterOption[] = [
  { key: 'ALL', label: 'Все', value: 'all' },
  { key: 'ATTACHED', label: 'Прикрепленные', value: 'attached' },
  { key: 'COMPLETED', label: 'Завершенные', value: 'completed' },
  { key: 'DOING', label: 'Выполняю', value: 'doing' },
  { key: 'HELPING', label: 'Помогаю', value: 'helping' },
  { key: 'INSTRUCTED', label: 'Поручил', value: 'instructed' },
  { key: 'WATCHING', label: 'Наблюдаю', value: 'watching' },
];

interface TaskFilterProps {
  selectedFilters: string[];
  onFiltersChange: (filters: string[]) => void;
}

export const TaskFilter: React.FC<TaskFilterProps> = ({
  selectedFilters,
  onFiltersChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterToggle = (value: string) => {
    if (value === 'all') {
      // If "Все" is selected, clear all other filters
      onFiltersChange(['all']);
    } else {
      // Remove "all" if it exists and toggle the specific filter
      const newFilters = selectedFilters.filter(f => f !== 'all');
      if (newFilters.includes(value)) {
        // Remove filter
        const updatedFilters = newFilters.filter(f => f !== value);
        // If no filters left, add "all"
        onFiltersChange(updatedFilters.length === 0 ? ['all'] : updatedFilters);
      } else {
        // Add filter
        onFiltersChange([...newFilters, value]);
      }
    }
  };

  const clearAllFilters = () => {
    onFiltersChange(['all']);
  };

  const hasActiveFilters = selectedFilters.length > 0 && !selectedFilters.includes('all');

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
            {selectedFilters.length}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-sm">Фильтры</h3>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  <X className="h-3 w-3 mr-1" />
                  Очистить
                </Button>
              )}
            </div>
            
            <div className="space-y-2">
              {filterOptions.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                  onClick={() => handleFilterToggle(option.value)}
                >
                  <Checkbox
                    checked={selectedFilters.includes(option.value)}
                    onCheckedChange={() => handleFilterToggle(option.value)}
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
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
