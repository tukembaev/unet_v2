import { Check, ChevronsUpDown, RefreshCw, X } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { cn } from 'shared/lib';
import {
  Badge,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'shared/ui';
import { SelectSkeleton } from 'shared/components/select/SelectSkeleton';
import { useOrganizations } from '../model/queries';
import {
  ORG_UNIT_TYPE_OPTIONS,
  type OrganizationUnit,
  type OrgUnitType,
} from '../model/types';

const ITEM_HEIGHT = 44;
const LIST_MAX_HEIGHT = 280;
const EMPTY_ORGS: OrganizationUnit[] = [];

type Props = {
  value: OrganizationUnit[];
  onChange: (value: OrganizationUnit[]) => void;
  placeholder?: string;
  disabled?: boolean;
};

export function OrganizationMultiSelect({
  value,
  onChange,
  placeholder = 'Выберите подразделения',
  disabled = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [unitType, setUnitType] = useState<OrgUnitType>('DEPARTMENT');
  const [scrollElement, setScrollElement] = useState<HTMLDivElement | null>(
    null
  );

  const { data, isLoading, isError, refetch, isFetching } =
    useOrganizations(unitType);
  const orgs = data ?? EMPTY_ORGS;

  const selectedIds = useMemo(() => new Set(value.map((v) => v.id)), [value]);

  const filtered = useMemo(() => {
    if (!search.trim()) return orgs;
    const q = search.toLowerCase();
    return orgs.filter(
      (org) =>
        org.name.toLowerCase().includes(q) ||
        (org.abbreviation ?? '').toLowerCase().includes(q)
    );
  }, [orgs, search]);

  const virtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => scrollElement,
    estimateSize: () => ITEM_HEIGHT,
    overscan: 6,
  });

  const handleSelect = useCallback(
    (org: OrganizationUnit) => {
      if (selectedIds.has(org.id)) {
        onChange(value.filter((v) => v.id !== org.id));
        return;
      }
      onChange([...value, org]);
    },
    [onChange, selectedIds, value]
  );

  const listHeight = Math.min(filtered.length * ITEM_HEIGHT, LIST_MAX_HEIGHT);

  return (
    <div className="space-y-2">
      <Select
        value={unitType}
        onValueChange={(v) => setUnitType(v as OrgUnitType)}
        disabled={disabled}
      >
        <SelectTrigger className="rounded-xl">
          <SelectValue placeholder="Тип подразделения" />
        </SelectTrigger>
        <SelectContent>
          {ORG_UNIT_TYPE_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {value.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {value.map((org) => (
            <Badge
              key={org.id}
              variant="secondary"
              className="gap-1 rounded-full pr-1"
            >
              <span className="max-w-[180px] truncate">{org.name}</span>
              <button
                type="button"
                className="rounded-full p-0.5 hover:bg-muted"
                onClick={() => onChange(value.filter((v) => v.id !== org.id))}
                aria-label={`Убрать ${org.name}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      ) : null}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            disabled={disabled}
            className="h-10 w-full justify-between rounded-xl font-normal"
          >
            <span className="truncate text-muted-foreground">
              {placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          <div className="border-b p-2">
            <input
              className="h-9 w-full rounded-md border bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground"
              placeholder="Поиск по названию"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {isLoading ? (
            <SelectSkeleton />
          ) : isError ? (
            <div className="flex flex-col items-center gap-2 p-4 text-sm text-muted-foreground">
              Не удалось загрузить подразделения
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => void refetch()}
                disabled={isFetching}
              >
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                Повторить
              </Button>
            </div>
          ) : filtered.length === 0 ? (
            <p className="p-4 text-center text-sm text-muted-foreground">
              Ничего не найдено
            </p>
          ) : (
            <div
              ref={setScrollElement}
              className="overflow-auto"
              style={{ height: listHeight }}
            >
              <div
                className="relative w-full"
                style={{ height: virtualizer.getTotalSize() }}
              >
                {virtualizer.getVirtualItems().map((virtualRow) => {
                  const org = filtered[virtualRow.index];
                  const selected = selectedIds.has(org.id);
                  return (
                    <button
                      key={org.id}
                      type="button"
                      className={cn(
                        'absolute left-0 top-0 flex w-full items-center gap-2 px-3 text-left text-sm hover:bg-accent',
                        selected && 'bg-accent/60'
                      )}
                      style={{
                        height: virtualRow.size,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                      onClick={() => handleSelect(org)}
                    >
                      <Check
                        className={cn(
                          'h-4 w-4 shrink-0',
                          selected ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      <span className="min-w-0 truncate">
                        {org.name}
                        {org.abbreviation ? (
                          <span className="ml-1 text-xs text-muted-foreground">
                            ({org.abbreviation})
                          </span>
                        ) : null}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
