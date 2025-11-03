import React, { useState } from 'react';
import { Button, Badge, Checkbox } from 'shared/ui';
import { Filter, X } from 'lucide-react';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

interface GenericFilterProps {
  filterGroups: FilterGroup[];
  onClearAll?: () => void;
}

export const GenericFilter: React.FC<GenericFilterProps> = ({
  filterGroups,
  onClearAll,
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

  const hasActiveFilters = filterGroups.some(
    group => group.selectedValues.length > 0 && !group.selectedValues.includes('all')
  );

  const activeFiltersCount = filterGroups.reduce(
    (acc, group) => acc + (group.selectedValues.includes('all') ? 0 : group.selectedValues.length),
    0
  );

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
              {hasActiveFilters && onClearAll && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearAll}
                  className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="h-3 w-3 mr-1" />
                  Очистить
                </Button>
              )}
            </div>

            {filterGroups.map((group, index) => (
              <div key={group.id} className={index > 0 ? 'mt-4' : ''}>
                <h4 className="text-xs font-medium text-gray-500 mb-2 dark:text-gray-400">
                  {group.label}
                </h4>
                <div className="space-y-2">
                  {group.options.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded dark:hover:bg-gray-800"
                      onClick={() =>
                        handleFilterToggle(option.value, group.selectedValues, group.onChange)
                      }
                    >
                      <Checkbox
                        checked={group.selectedValues.includes(option.value)}
                        onCheckedChange={() =>
                          handleFilterToggle(option.value, group.selectedValues, group.onChange)
                        }
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {option.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

