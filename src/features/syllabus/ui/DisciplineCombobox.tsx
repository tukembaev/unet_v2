import { useCallback, useEffect, useState, type UIEvent } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import type { DisciplineOption } from "entities/education-management/model/api";
import {
  Button,
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "shared/ui";
import { cn } from "shared/lib";

const SEARCH_DEBOUNCE_MS = 350;

type Props = {
  options: DisciplineOption[];
  value: string;
  onValueChange: (disciplineId: string) => void;
  disabled?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  /** Подгрузка следующей страницы при прокрутке списка (limit/offset на бэке) */
  onLoadMore?: () => void;
  hasMore?: boolean;
  isFetchingNextPage?: boolean;
  /** Строка поиска уходит на бэк (после debounce); при закрытии попапа сбрасывается в "" */
  onBackendSearchChange?: (trimmedQuery: string) => void;
  /** Первая загрузка / смена поиска (не подгрузка страницы) */
  isListFetching?: boolean;
  /** Если value выбран, но строки нет в текущих options (другой поиск) — показать подпись на кнопке */
  selectedLabelFallback?: string;
};

export function DisciplineCombobox({
  options,
  value,
  onValueChange,
  disabled,
  placeholder = "Выберите дисциплину",
  searchPlaceholder = "Поиск дисциплины...",
  emptyText = "Ничего не найдено",
  onLoadMore,
  hasMore = false,
  isFetchingNextPage = false,
  onBackendSearchChange,
  isListFetching = false,
  selectedLabelFallback,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!onBackendSearchChange) return;
    const t = window.setTimeout(() => {
      onBackendSearchChange(search.trim());
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(t);
  }, [search, onBackendSearchChange]);

  const handleListScroll = useCallback(
    (e: UIEvent<HTMLDivElement>) => {
      if (!onLoadMore || !hasMore || isFetchingNextPage) return;
      const el = e.currentTarget;
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 64) {
        onLoadMore();
      }
    },
    [hasMore, isFetchingNextPage, onLoadMore]
  );

  const selected = options.find((o) => String(o.value) === value);
  const triggerLabel =
    selected?.label ??
    (value && selectedLabelFallback?.trim() ? selectedLabelFallback : undefined);

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          setSearch("");
          onBackendSearchChange?.("");
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-auto min-h-10 w-full justify-between py-2 font-normal"
          disabled={disabled}
        >
          <span className="min-w-0 flex-1 whitespace-normal break-words text-left text-foreground leading-snug">
            {triggerLabel ? (
              triggerLabel
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="min-w-[var(--radix-popover-trigger-width)] w-[min(48rem,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] p-0"
        align="start"
        sideOffset={6}
        collisionPadding={16}
      >
        <Command shouldFilter={false} className="w-full">
          <CommandInput
            placeholder={searchPlaceholder}
            value={search}
            onValueChange={setSearch}
          />
          <CommandList className="max-h-72" onScroll={handleListScroll}>
            {isListFetching ? (
              <div className="px-2 py-3 text-center text-sm text-muted-foreground">
                Поиск…
              </div>
            ) : options.length === 0 ? (
              <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                {emptyText}
              </div>
            ) : null}
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={`${opt.label} ${opt.value}`}
                  className="items-start py-2"
                  onSelect={() => {
                    onValueChange(String(opt.value));
                    setSearch("");
                    onBackendSearchChange?.("");
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 mt-0.5 h-4 w-4 shrink-0",
                      value === String(opt.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="min-w-0 flex-1 whitespace-normal break-words text-left leading-snug">
                    {opt.label}
                  </span>
                </CommandItem>
              ))}
              {isFetchingNextPage ? (
                <div className="px-2 py-2 text-center text-xs text-muted-foreground">
                  Загрузка…
                </div>
              ) : null}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
