import React, { useState } from 'react';
import { Button, Badge, Checkbox, Label } from 'shared/ui';
import { Filter, X, LucideIcon } from 'lucide-react';

export interface FilterOption {
  label: string;
  value: string;
  icon?: LucideIcon;
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
        <div className="absolute top-full left-0 mt-2 w-72 bg-popover border border-border rounded-lg shadow-lg z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Фильтры</h3>
              {hasActiveFilters && onClearAll && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearAll}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3 mr-1" />
                  Очистить
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {filterGroups.map((group) => (
                <div key={group.id}>
                  <Label className="font-semibold text-xs text-muted-foreground mb-2 block">
                    {group.label}
                  </Label>
                  <div className="flex flex-col gap-4">
                    {group.options.map((option) => {
                      const Icon = option.icon;
                      return (
                        <div key={option.value} className="flex items-center gap-2">
                          <Checkbox
                            id={`${group.id}-${option.value}`}
                            checked={group.selectedValues.includes(option.value)}
                            onCheckedChange={() =>
                              handleFilterToggle(option.value, group.selectedValues, group.onChange)
                            }
                          />
                          <Label
                            htmlFor={`${group.id}-${option.value}`}
                            className="text-sm cursor-pointer flex items-center gap-2"
                          >
                            {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
                            {option.label}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
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

