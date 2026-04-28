import { useMemo, useState } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import type { SelectOptions } from '../model/types';
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
  Badge,
} from 'shared/ui';
import { cn } from 'shared/lib';

type Props = {
  options: SelectOptions[];
  value: number[];
  onChange: (next: number[]) => void;
  placeholder: string;
  disabled?: boolean;
  className?: string;
};

export function OptionMultiSelect({
  options,
  value,
  onChange,
  placeholder,
  disabled,
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const selected = useMemo(() => {
    const set = new Set(value);
    return options.filter((o) => set.has(o.value));
  }, [options, value]);
  const normalizedSearch = search.trim().toLowerCase();
  const filteredOptions = useMemo(() => {
    if (!normalizedSearch) return options;
    return options.filter((opt) =>
      `${opt.label} ${opt.value}`.toLowerCase().includes(normalizedSearch)
    );
  }, [normalizedSearch, options]);

  const toggle = (id: number) => {
    const set = new Set(value);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    onChange([...set]);
  };

  const remove = (id: number) => {
    onChange(value.filter((v) => v !== id));
  };

  return (
    <div className={cn('space-y-2', className)}>
      <Popover
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (!nextOpen) setSearch('');
        }}
      >
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="h-auto min-h-10 w-full justify-between py-2 text-left font-normal"
          >
            <span className="line-clamp-2 text-muted-foreground">
              {selected.length ? `Выбрано: ${selected.length}` : placeholder}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput placeholder="Поиск..." value={search} onValueChange={setSearch} />
            <CommandList className="max-h-60">
              <CommandEmpty>Ничего не найдено</CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((opt) => {
                  const checked = value.includes(opt.value);
                  return (
                    <CommandItem
                      key={opt.value}
                      value={`${opt.label} ${opt.value}`}
                      onSelect={() => toggle(opt.value)}
                    >
                      <span
                        className={cn(
                          'mr-2 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-primary',
                          checked && 'bg-primary text-primary-foreground'
                        )}
                      >
                        {checked ? <Check className="h-3 w-3" /> : null}
                      </span>
                      <span className="line-clamp-2">{opt.label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((opt) => (
            <Badge key={opt.value} variant="secondary" className="gap-1 pr-1 font-normal">
              <span className="max-w-[220px] truncate">{opt.label}</span>
              <button
                type="button"
                className="rounded-sm p-0.5 hover:bg-muted"
                onClick={() => remove(opt.value)}
                aria-label="Убрать"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
