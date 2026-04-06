import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import type { DisciplineOption } from "entities/education-management/model/api";
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
} from "shared/ui";
import { cn } from "shared/lib";

type Props = {
  options: DisciplineOption[];
  value: string;
  onValueChange: (disciplineId: string) => void;
  disabled?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
};

export function DisciplineCombobox({
  options,
  value,
  onValueChange,
  disabled,
  placeholder = "Выберите дисциплину",
  searchPlaceholder = "Поиск дисциплины...",
  emptyText = "Ничего не найдено",
}: Props) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => String(o.value) === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-auto min-h-10 w-full justify-between py-2 font-normal"
          disabled={disabled}
        >
          <span className="line-clamp-2 text-left text-foreground">
            {selected?.label ?? (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList className="max-h-72">
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={`${opt.label} ${opt.value}`}
                  onSelect={() => {
                    onValueChange(String(opt.value));
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 shrink-0",
                      value === String(opt.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="line-clamp-2">{opt.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
