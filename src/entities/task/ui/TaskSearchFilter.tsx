import React, { useState } from 'react';
import { Input } from 'shared/ui';
import { Button } from 'shared/ui';
import { Badge } from 'shared/ui';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from 'shared/ui';
import { Popover, PopoverContent, PopoverTrigger } from 'shared/ui';
import { Search, Filter, Plus, Check, ChevronDown, X } from 'lucide-react';
import { cn } from 'shared/lib';

const filterOptions = [
  { key: 'ALL', label: 'Все', value: 'all' },
  { key: 'ATTACHED', label: 'Прикрепленные', value: 'attached' },
  { key: 'COMPLETED', label: 'Завершенные', value: 'completed' },
  { key: 'DOING', label: 'Выполняю', value: 'doing' },
  { key: 'HELPING', label: 'Помогаю', value: 'helping' },
  { key: 'INSTRUCTED', label: 'Поручил', value: 'instructed' },
  { key: 'WATCHING', label: 'Наблюдаю', value: 'watching' },
];

interface TaskSearchFilterProps {
  onSearch?: (value: string) => void;
  selectedFilters?: string[];
  onFiltersChange?: (filters: string[]) => void;
  onAddTask?: () => void;
}

export const TaskSearchFilter: React.FC<TaskSearchFilterProps> = ({
  onSearch,
  selectedFilters = ['all'],
  onFiltersChange,
  onAddTask,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterToggle = (value: string) => {
    if (value === 'all') {
      onFiltersChange?.(['all']);
    } else {
      const newFilters = selectedFilters.filter(f => f !== 'all');
      if (newFilters.includes(value)) {
        const updatedFilters = newFilters.filter(f => f !== value);
        onFiltersChange?.(updatedFilters.length === 0 ? ['all'] : updatedFilters);
      } else {
        // When adding a new filter, remove 'all' if it exists
        onFiltersChange?.([...newFilters, value]);
      }
    }
  };

  const clearAllFilters = () => {
    onFiltersChange?.(['all']);
  };

  const hasActiveFilters = selectedFilters.length > 0 && !selectedFilters.includes('all');

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Поиск задач..."
          className="pl-10 w-full sm:w-64"
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>

      {/* Filter Multiselect */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-between min-w-[120px] sm:min-w-[140px] w-full sm:w-auto">
            <div className="flex items-center gap-1 sm:gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm">Фильтр</span>
              {hasActiveFilters && (
                <Badge variant="secondary" className="px-1.5 py-0.5 text-xs">
                  {selectedFilters.length}
                </Badge>
              )}
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] sm:w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Поиск фильтров..." />
            <CommandList>
              <CommandEmpty>Фильтры не найдены.</CommandEmpty>
              <CommandGroup>
                {hasActiveFilters && (
                  <CommandItem onSelect={clearAllFilters}>
                    <X className="mr-2 h-4 w-4" />
                    Очистить все
                  </CommandItem>
                )}
                {filterOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleFilterToggle(option.value)}
                    className="flex items-center"
                  >
                    <div className="flex items-center space-x-2">
                      <div className={cn(
                        "flex items-center justify-center w-4 h-4 border rounded mr-2",
                        selectedFilters.includes(option.value) 
                          ? "bg-blue-600 border-blue-600" 
                          : "border-gray-300"
                      )}>
                        {selectedFilters.includes(option.value) && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span>{option.label}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Add Task Button */}
      <Button onClick={onAddTask} className="w-full sm:w-auto">
        <Plus className="h-4 w-4 sm:mr-2" />
        <span className="hidden xs:inline ml-2 sm:ml-0 text-sm">Добавить задачу</span>
        <span className="xs:hidden text-sm">Добавить</span>
      </Button>
    </div>
  );
};
