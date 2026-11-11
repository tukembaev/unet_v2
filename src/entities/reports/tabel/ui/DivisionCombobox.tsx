import { useMemo, useState } from 'react';
import { Building2, Check, ChevronsUpDown } from 'lucide-react';
import { cn } from 'shared/lib/utils';
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from 'shared/ui';
import type { TabelDivisionOption } from '../model/types';

type DivisionComboboxProps = {
  options: TabelDivisionOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

export function DivisionCombobox({
  options,
  value,
  onChange,
  placeholder = 'Выберите подразделение',
  disabled,
  className,
}: DivisionComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selected = useMemo(
    () => options.find((item) => String(item.value) === value) ?? null,
    [options, value]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return options;
    return options.filter((item) =>
      `${item.label} ${item.value}`.toLowerCase().includes(q)
    );
  }, [options, search]);

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setSearch('');
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            'h-10 w-full justify-between font-normal',
            !selected && 'text-muted-foreground',
            className
          )}
        >
          <span className="flex min-w-0 items-center gap-2">
            <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate">
              {selected?.label ?? placeholder}
            </span>
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Поиск подразделения…"
            value={search}
            onValueChange={setSearch}
          />
          <CommandList className="max-h-72">
            <CommandEmpty>Ничего не найдено</CommandEmpty>
            <CommandGroup>
              {filtered.map((item) => {
                const itemValue = String(item.value);
                const isSelected = itemValue === value;
                return (
                  <CommandItem
                    key={itemValue}
                    value={`${item.label} ${itemValue}`}
                    onSelect={() => {
                      onChange(isSelected ? null : itemValue);
                      setOpen(false);
                      setSearch('');
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4 shrink-0',
                        isSelected ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <span className="line-clamp-2">{item.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
